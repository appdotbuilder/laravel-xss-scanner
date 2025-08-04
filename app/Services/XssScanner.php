<?php

namespace App\Services;

use App\Models\Scan;
use App\Models\Vulnerability;
use App\Models\Website;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XssScanner
{
    /**
     * Common XSS payloads for testing
     */
    private array $xssPayloads = [
        // Basic script tags
        '<script>alert("XSS")</script>',
        '<script>alert(\'XSS\')</script>',
        '<script>alert(`XSS`)</script>',
        
        // Event handlers
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        '<body onload=alert("XSS")>',
        '<input onfocus=alert("XSS") autofocus>',
        
        // JavaScript protocol
        'javascript:alert("XSS")',
        'javascript:alert(String.fromCharCode(88,83,83))',
        
        // HTML encoding bypass
        '&lt;script&gt;alert("XSS")&lt;/script&gt;',
        
        // Attribute injection
        '" onmouseover="alert(\'XSS\')" "',
        '\' onmouseover=\'alert("XSS")\' \'',
        
        // Data URI
        '<iframe src="data:text/html,<script>alert(\'XSS\')</script>"></iframe>',
        
        // CSS injection
        '<style>@import"javascript:alert(\'XSS\')";</style>',
        
        // Template literals
        '${alert("XSS")}',
        '{{alert("XSS")}}',
        
        // Filter evasion
        '<ScRiPt>alert("XSS")</ScRiPt>',
        '<script>alert(String.fromCharCode(88,83,83))</script>',
    ];

    /**
     * Parameters commonly vulnerable to XSS
     */
    private array $commonParameters = [
        'q', 'search', 'query', 'keyword', 'term',
        'name', 'title', 'message', 'comment', 'content',
        'url', 'redirect', 'return', 'callback',
        'id', 'user', 'username', 'email',
        'page', 'category', 'tag', 'filter',
        'debug', 'test', 'preview'
    ];

    /**
     * Start a comprehensive XSS scan for a website
     */
    public function scanWebsite(Website $website): Scan
    {
        $scan = Scan::create([
            'website_id' => $website->id,
            'status' => 'running',
            'started_at' => now(),
            'scan_config' => [
                'max_pages' => $website->scan_settings['max_pages'] ?? 50,
                'max_depth' => $website->scan_settings['max_depth'] ?? 3,
                'delay_between_requests' => $website->scan_settings['delay_between_requests'] ?? 1000,
            ]
        ]);

        try {
            $this->performScan($scan);
            
            $scan->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Update website last scanned timestamp
            $website->update(['last_scanned_at' => now()]);

        } catch (Exception $e) {
            Log::error('XSS scan failed', [
                'scan_id' => $scan->id,
                'website_id' => $website->id,
                'error' => $e->getMessage()
            ]);

            $scan->update([
                'status' => 'failed',
                'completed_at' => now(),
                'error_message' => $e->getMessage(),
            ]);
        }

        return $scan;
    }

    /**
     * Perform the actual scanning process
     */
    protected function performScan(Scan $scan): void
    {
        $website = $scan->website;
        $baseUrl = rtrim($website->url, '/');
        $crawledUrls = [];
        $urlsToScan = [$baseUrl];
        $maxPages = $scan->scan_config['max_pages'] ?? 50;
        $maxDepth = $scan->scan_config['max_depth'] ?? 3;
        $delay = $scan->scan_config['delay_between_requests'] ?? 1000;

        $pagesScanned = 0;
        $vulnerabilitiesFound = 0;

        // Crawl and scan URLs
        while (!empty($urlsToScan) && $pagesScanned < $maxPages) {
            $currentUrl = array_shift($urlsToScan);
            
            if (in_array($currentUrl, $crawledUrls)) {
                continue;
            }

            $crawledUrls[] = $currentUrl;
            $pagesScanned++;

            try {
                // Add delay between requests to be respectful
                if ($delay > 0) {
                    usleep($delay * 1000); // Convert to microseconds
                }

                // Scan current URL for XSS vulnerabilities
                $vulnerabilities = $this->scanUrlForXss($currentUrl, $scan);
                $vulnerabilitiesFound += count($vulnerabilities);

                // Discover new URLs if we haven't reached max depth
                $depth = $this->calculateDepth($baseUrl, $currentUrl);
                if ($depth < $maxDepth) {
                    $newUrls = $this->discoverUrls($currentUrl, $baseUrl);
                    foreach ($newUrls as $newUrl) {
                        if (!in_array($newUrl, $crawledUrls) && !in_array($newUrl, $urlsToScan)) {
                            $urlsToScan[] = $newUrl;
                        }
                    }
                }

                // Update scan progress
                $scan->update([
                    'pages_scanned' => $pagesScanned,
                    'vulnerabilities_found' => $vulnerabilitiesFound,
                ]);

            } catch (Exception $e) {
                Log::warning('Failed to scan URL', [
                    'url' => $currentUrl,
                    'scan_id' => $scan->id,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }

    /**
     * Scan a specific URL for XSS vulnerabilities
     */
    protected function scanUrlForXss(string $url, Scan $scan): array
    {
        $vulnerabilities = [];

        // Test GET parameters
        $vulnerabilities = array_merge($vulnerabilities, $this->testGetParameters($url, $scan));

        // Test POST forms
        $vulnerabilities = array_merge($vulnerabilities, $this->testPostForms($url, $scan));

        return $vulnerabilities;
    }

    /**
     * Test GET parameters for XSS vulnerabilities
     */
    protected function testGetParameters(string $url, Scan $scan): array
    {
        $vulnerabilities = [];
        $parsedUrl = parse_url($url);

        // Test common parameters
        foreach ($this->commonParameters as $param) {
            foreach ($this->xssPayloads as $payload) {
                try {
                    $testUrl = $this->buildTestUrl($url, $param, $payload);
                    
                    $response = Http::timeout(10)
                        ->withUserAgent('XSS-Scanner/1.0 (Security Testing)')
                        ->get($testUrl);

                    if ($this->isVulnerable($response->body(), $payload)) {
                        $vulnerability = Vulnerability::create([
                            'scan_id' => $scan->id,
                            'url' => $testUrl,
                            'type' => 'reflected_xss',
                            'severity' => $this->calculateSeverity($payload),
                            'parameter' => $param,
                            'payload' => $payload,
                            'evidence' => $this->extractEvidence($response->body(), $payload),
                            'method' => 'GET',
                            'request_data' => ['url' => $testUrl],
                            'description' => "Reflected XSS vulnerability found in parameter '{$param}' via GET request.",
                        ]);

                        $vulnerabilities[] = $vulnerability;

                        Log::info('XSS vulnerability found', [
                            'url' => $testUrl,
                            'parameter' => $param,
                            'payload' => $payload,
                            'scan_id' => $scan->id
                        ]);

                        // Stop testing this parameter once we find a vulnerability
                        break;
                    }

                } catch (Exception $e) {
                    // Continue with next payload
                    continue;
                }
            }
        }

        return $vulnerabilities;
    }

    /**
     * Test POST forms for XSS vulnerabilities
     */
    protected function testPostForms(string $url, Scan $scan): array
    {
        $vulnerabilities = [];

        try {
            // Get the page content to find forms
            $response = Http::timeout(10)->get($url);
            $html = $response->body();

            // Simple form detection (in a real scanner, you'd use a proper DOM parser)
            preg_match_all('/<form[^>]*action=["\']([^"\']*)["\'][^>]*>/i', $html, $formMatches);
            preg_match_all('/<input[^>]*name=["\']([^"\']*)["\'][^>]*>/i', $html, $inputMatches);

            if (!empty($inputMatches[1])) {
                foreach ($inputMatches[1] as $inputName) {
                    foreach ($this->xssPayloads as $payload) {
                        try {
                            $postData = [$inputName => $payload];
                            
                            $response = Http::timeout(10)
                                ->withUserAgent('XSS-Scanner/1.0 (Security Testing)')
                                ->post($url, $postData);

                            if ($this->isVulnerable($response->body(), $payload)) {
                                $vulnerability = Vulnerability::create([
                                    'scan_id' => $scan->id,
                                    'url' => $url,
                                    'type' => 'reflected_xss',
                                    'severity' => $this->calculateSeverity($payload),
                                    'parameter' => $inputName,
                                    'payload' => $payload,
                                    'evidence' => $this->extractEvidence($response->body(), $payload),
                                    'method' => 'POST',
                                    'request_data' => $postData,
                                    'description' => "Reflected XSS vulnerability found in form field '{$inputName}' via POST request.",
                                ]);

                                $vulnerabilities[] = $vulnerability;

                                Log::info('XSS vulnerability found via POST', [
                                    'url' => $url,
                                    'parameter' => $inputName,
                                    'payload' => $payload,
                                    'scan_id' => $scan->id
                                ]);

                                // Stop testing this field once we find a vulnerability
                                break;
                            }

                        } catch (Exception $e) {
                            // Continue with next payload
                            continue;
                        }
                    }
                }
            }

        } catch (Exception $e) {
            // Failed to get page content, skip form testing
        }

        return $vulnerabilities;
    }

    /**
     * Build test URL with payload
     */
    protected function buildTestUrl(string $baseUrl, string $param, string $payload): string
    {
        $separator = str_contains($baseUrl, '?') ? '&' : '?';
        return $baseUrl . $separator . $param . '=' . urlencode($payload);
    }

    /**
     * Check if response indicates XSS vulnerability
     */
    protected function isVulnerable(string $responseBody, string $payload): bool
    {
        // Check if the payload appears unescaped in the response
        if (str_contains($responseBody, $payload)) {
            return true;
        }

        // Check for partial payload execution indicators
        $indicators = [
            'alert("XSS")',
            'alert(\'XSS\')',
            'alert(`XSS`)',
            'onerror=alert',
            'onload=alert',
            'javascript:alert',
        ];

        foreach ($indicators as $indicator) {
            if (str_contains($responseBody, $indicator)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate vulnerability severity based on payload
     */
    protected function calculateSeverity(string $payload): string
    {
        if (str_contains($payload, 'javascript:') || str_contains($payload, 'data:text/html')) {
            return 'high';
        }

        if (str_contains($payload, '<script>') || str_contains($payload, 'onerror=') || str_contains($payload, 'onload=')) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Extract evidence of vulnerability from response
     */
    protected function extractEvidence(string $responseBody, string $payload): string
    {
        $start = strpos($responseBody, $payload);
        if ($start === false) {
            return 'Payload detected in response';
        }

        // Extract surrounding context (50 characters before and after)
        $contextStart = max(0, $start - 50);
        $contextLength = min(strlen($responseBody) - $contextStart, 150);
        
        return '...' . substr($responseBody, $contextStart, $contextLength) . '...';
    }

    /**
     * Discover URLs from a page
     */
    protected function discoverUrls(string $url, string $baseUrl): array
    {
        $urls = [];

        try {
            $response = Http::timeout(10)->get($url);
            $html = $response->body();

            // Find links (simplified - in production, use a proper DOM parser)
            preg_match_all('/<a[^>]*href=["\']([^"\']*)["\'][^>]*>/i', $html, $matches);
            
            foreach ($matches[1] as $link) {
                $absoluteUrl = $this->makeAbsoluteUrl($link, $baseUrl);
                if ($this->isSameDomain($absoluteUrl, $baseUrl)) {
                    $urls[] = $absoluteUrl;
                }
            }

        } catch (Exception $e) {
            // Failed to discover URLs
        }

        return array_unique($urls);
    }

    /**
     * Convert relative URL to absolute URL
     */
    protected function makeAbsoluteUrl(string $url, string $baseUrl): string
    {
        if (str_starts_with($url, 'http')) {
            return $url;
        }

        if (str_starts_with($url, '//')) {
            $protocol = parse_url($baseUrl, PHP_URL_SCHEME) ?: 'https';
            return $protocol . ':' . $url;
        }

        if (str_starts_with($url, '/')) {
            $parsedBase = parse_url($baseUrl);
            $scheme = $parsedBase['scheme'] ?? 'https';
            $host = $parsedBase['host'] ?? '';
            return $scheme . '://' . $host . $url;
        }

        // Relative path
        return rtrim($baseUrl, '/') . '/' . ltrim($url, '/');
    }

    /**
     * Check if URL belongs to the same domain
     */
    protected function isSameDomain(string $url, string $baseUrl): bool
    {
        $urlHost = parse_url($url, PHP_URL_HOST);
        $baseHost = parse_url($baseUrl, PHP_URL_HOST);
        
        return $urlHost === $baseHost;
    }

    /**
     * Calculate URL depth from base URL
     */
    protected function calculateDepth(string $baseUrl, string $currentUrl): int
    {
        $basePath = parse_url($baseUrl, PHP_URL_PATH) ?: '/';
        $currentPath = parse_url($currentUrl, PHP_URL_PATH) ?: '/';
        
        $baseSegments = array_filter(explode('/', $basePath));
        $currentSegments = array_filter(explode('/', $currentPath));
        
        return max(0, count($currentSegments) - count($baseSegments));
    }
}