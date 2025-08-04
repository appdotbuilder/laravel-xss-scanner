import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Scan {
    id: number;
    status: string;
    started_at: string | null;
    completed_at: string | null;
    pages_scanned: number;
    vulnerabilities_found: number;
    error_message: string | null;
    vulnerabilities: Vulnerability[];
}

interface Vulnerability {
    id: number;
    url: string;
    type: string;
    severity: string;
    parameter: string | null;
    payload: string;
    evidence: string | null;
    method: string;
    verified: boolean;
}

interface Website {
    id: number;
    name: string;
    url: string;
    description: string | null;
    status: string;
    last_scanned_at: string | null;
    scan_settings: {
        max_pages: number;
        max_depth: number;
        delay_between_requests: number;
    };
    scans: Scan[];
}

interface Stats {
    total_scans: number;
    total_vulnerabilities: number;
    critical_vulnerabilities: number;
    last_scan: Scan | null;
}

interface Props {
    website: Website;
    stats: Stats;
    [key: string]: unknown;
}

export default function WebsiteShow({ website, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Websites',
            href: '/websites',
        },
        {
            title: website.name,
            href: `/websites/${website.id}`,
        },
    ];

    const handleStartScan = () => {
        router.post(route('websites.scan', website.id), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
            router.delete(route('websites.destroy', website.id));
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
            case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
            case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
            case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
            case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
            case 'pending': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
            default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
        }
    };

    const hasRunningScan = website.scans.some(scan => scan.status === 'running');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${website.name} - XSS Scanner`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                🌐 {website.name}
                            </h1>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${website.status === 'active' ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20' : 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'}`}>
                                {website.status}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{website.url}</p>
                        {website.description && (
                            <p className="text-gray-600 dark:text-gray-300">{website.description}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleStartScan}
                            disabled={hasRunningScan}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${
                                hasRunningScan
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                        >
                            {hasRunningScan ? '🔄 Scan Running...' : '🔍 Start Scan'}
                        </button>
                        <Link
                            href={route('websites.edit', website.id)}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Scans</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_scans}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Vulnerabilities</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_vulnerabilities}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/20">
                                <span className="text-2xl">🚨</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Critical</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.critical_vulnerabilities}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                                <span className="text-2xl">🕒</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Last Scan</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {website.last_scanned_at ? new Date(website.last_scanned_at).toLocaleDateString() : 'Never'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Scans */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Scans</h2>
                    </div>
                    <div className="p-6">
                        {website.scans.length > 0 ? (
                            <div className="space-y-4">
                                {website.scans.slice(0, 10).map((scan) => (
                                    <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scan.status)}`}>
                                                {scan.status}
                                            </span>
                                            <div>
                                                <div className="flex items-center gap-4 text-sm text-gray-900 dark:text-white">
                                                    <span>{scan.pages_scanned} pages scanned</span>
                                                    <span>{scan.vulnerabilities_found} vulnerabilities found</span>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {scan.started_at && `Started: ${new Date(scan.started_at).toLocaleString()}`}
                                                    {scan.completed_at && ` • Completed: ${new Date(scan.completed_at).toLocaleString()}`}
                                                </div>
                                                {scan.error_message && (
                                                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                        Error: {scan.error_message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Link
                                            href={route('scans.show', scan.id)}
                                            className="text-red-600 hover:text-red-700 font-medium"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">📊</div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">No scans performed yet</p>
                                <button
                                    onClick={handleStartScan}
                                    disabled={hasRunningScan}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                        hasRunningScan
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {hasRunningScan ? 'Scan Running...' : 'Start First Scan'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Latest Vulnerabilities */}
                {stats.last_scan && stats.last_scan.vulnerabilities && stats.last_scan.vulnerabilities.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Latest Vulnerabilities</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {stats.last_scan.vulnerabilities.slice(0, 5).map((vuln) => (
                                    <div key={vuln.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                                    {vuln.severity.toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-500">{vuln.type.replace('_', ' ').toUpperCase()}</span>
                                                <span className="text-xs text-gray-500">{vuln.method}</span>
                                                {vuln.verified && (
                                                    <span className="text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{vuln.url}</p>
                                        {vuln.parameter && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Parameter: {vuln.parameter}</p>
                                        )}
                                        <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded text-xs font-mono text-gray-100 overflow-x-auto">
                                            {vuln.payload}
                                        </div>
                                        {vuln.evidence && (
                                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                <strong>Evidence:</strong> {vuln.evidence}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scan Configuration</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Pages</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{website.scan_settings.max_pages}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Max Depth</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{website.scan_settings.max_depth}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Request Delay</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{website.scan_settings.delay_between_requests}ms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}