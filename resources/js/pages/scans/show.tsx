import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
    description: string | null;
}

interface Website {
    id: number;
    name: string;
    url: string;
}

interface Scan {
    id: number;
    status: string;
    started_at: string | null;
    completed_at: string | null;
    pages_scanned: number;
    vulnerabilities_found: number;
    error_message: string | null;
    website: Website;
    vulnerabilities: Vulnerability[];
}

interface Stats {
    total_vulnerabilities: number;
    critical_vulnerabilities: number;
    high_vulnerabilities: number;
    medium_vulnerabilities: number;
    low_vulnerabilities: number;
    verified_vulnerabilities: number;
}

interface Props {
    scan: Scan;
    stats: Stats;
    [key: string]: unknown;
}

export default function ScanShow({ scan, stats }: Props) {
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
            title: scan.website.name,
            href: `/websites/${scan.website.id}`,
        },
        {
            title: `Scan #${scan.id}`,
            href: `/scans/${scan.id}`,
        },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
            case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
            case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
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

    const formatDuration = (startedAt: string | null, completedAt: string | null) => {
        if (!startedAt) return 'N/A';
        if (!completedAt) return 'Running...';
        
        const start = new Date(startedAt);
        const end = new Date(completedAt);
        const diff = Math.abs(end.getTime() - start.getTime());
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        return `${minutes}m ${seconds}s`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Scan #${scan.id} - ${scan.website.name} - XSS Scanner`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                📊 Scan #{scan.id}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scan.status)}`}>
                                {scan.status}
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Website: <Link href={route('websites.show', scan.website.id)} className="text-red-600 hover:text-red-700 font-medium">{scan.website.name}</Link>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{scan.website.url}</p>
                    </div>
                    <Link
                        href={route('websites.show', scan.website.id)}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        ← Back to Website
                    </Link>
                </div>

                {/* Scan Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                                <span className="text-2xl">📄</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Pages Scanned</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{scan.pages_scanned}</p>
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
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{scan.vulnerabilities_found}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Verified</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.verified_vulnerabilities}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                                <span className="text-2xl">⏱️</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatDuration(scan.started_at, scan.completed_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vulnerability Breakdown */}
                {scan.vulnerabilities_found > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vulnerability Breakdown</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical_vulnerabilities}</div>
                                    <div className="text-sm text-red-700 dark:text-red-300">Critical</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.high_vulnerabilities}</div>
                                    <div className="text-sm text-orange-700 dark:text-orange-300">High</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.medium_vulnerabilities}</div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Medium</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.low_vulnerabilities}</div>
                                    <div className="text-sm text-green-700 dark:text-green-300">Low</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scan Details</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Started At</p>
                                <p className="text-gray-900 dark:text-white">
                                    {scan.started_at ? new Date(scan.started_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Completed At</p>
                                <p className="text-gray-900 dark:text-white">
                                    {scan.completed_at ? new Date(scan.completed_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        {scan.error_message && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Error Message</p>
                                <p className="text-red-700 dark:text-red-300">{scan.error_message}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vulnerabilities List */}
                {scan.vulnerabilities.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vulnerabilities Found</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {scan.vulnerabilities.map((vuln) => (
                                    <div key={vuln.id} className={`p-6 rounded-lg border-2 ${getSeverityColor(vuln.severity)}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(vuln.severity)}`}>
                                                    {vuln.severity.toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {vuln.type.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{vuln.method}</span>
                                                {vuln.verified && (
                                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">✓ Verified</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vulnerable URL</p>
                                            <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded break-all">
                                                {vuln.url}
                                            </p>
                                        </div>

                                        {vuln.parameter && (
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vulnerable Parameter</p>
                                                <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded">
                                                    {vuln.parameter}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">XSS Payload</p>
                                            <div className="bg-gray-800 dark:bg-gray-900 p-3 rounded text-sm font-mono text-gray-100 overflow-x-auto">
                                                {vuln.payload}
                                            </div>
                                        </div>

                                        {vuln.evidence && (
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evidence</p>
                                                <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm font-mono text-gray-900 dark:text-gray-100 overflow-x-auto">
                                                    {vuln.evidence}
                                                </div>
                                            </div>
                                        )}

                                        {vuln.description && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{vuln.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* No Vulnerabilities Found */}
                {scan.vulnerabilities_found === 0 && scan.status === 'completed' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
                        <div className="text-4xl mb-4">🛡️</div>
                        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">No Vulnerabilities Found</h3>
                        <p className="text-green-700 dark:text-green-300">
                            Great news! The scan completed successfully and didn't find any XSS vulnerabilities on the scanned pages.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}