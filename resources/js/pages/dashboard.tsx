import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Website {
    id: number;
    name: string;
    url: string;
    status: string;
    last_scanned_at: string | null;
    scans_count: number;
    scans: Array<{
        id: number;
        status: string;
        vulnerabilities_found: number;
        completed_at: string | null;
    }>;
}

interface Scan {
    id: number;
    status: string;
    vulnerabilities_found: number;
    completed_at: string | null;
    website: {
        id: number;
        name: string;
        url: string;
    };
}

interface Vulnerability {
    id: number;
    url: string;
    type: string;
    severity: string;
    parameter: string | null;
    payload: string;
    scan: {
        id: number;
        website: {
            id: number;
            name: string;
        };
    };
}

interface Stats {
    total_websites: number;
    total_scans: number;
    total_vulnerabilities: number;
    critical_vulnerabilities: number;
    running_scans: number;
}

interface Props {
    websites: Website[];
    recentScans: Scan[];
    recentVulnerabilities: Vulnerability[];
    stats: Stats;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ websites, recentVulnerabilities, stats }: Props) {
    const handleAddWebsite = () => {
        router.visit(route('websites.create'));
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



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="XSS Scanner Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🔍 XSS Scanner Dashboard
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Monitor and manage your website security scans
                        </p>
                    </div>
                    <button
                        onClick={handleAddWebsite}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        + Add Website
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                                <span className="text-2xl">🌐</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Websites</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_websites}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
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
                            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                                <span className="text-2xl">🔄</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Running</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.running_scans}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Websites */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Websites</h2>
                                <Link
                                    href={route('websites.index')}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {websites.length > 0 ? (
                                <div className="space-y-4">
                                    {websites.map((website) => (
                                        <div key={website.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{website.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{website.url}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {website.scans_count} scans • Last: {website.last_scanned_at ? new Date(website.last_scanned_at).toLocaleDateString() : 'Never'}
                                                </p>
                                            </div>
                                            <Link
                                                href={route('websites.show', website.id)}
                                                className="text-red-600 hover:text-red-700 font-medium"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🌐</div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">No websites added yet</p>
                                    <button
                                        onClick={handleAddWebsite}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Add Your First Website
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Vulnerabilities */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="p-6 border-b border-sidebar-border/70 dark:border-sidebar-border">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Vulnerabilities</h2>
                        </div>
                        <div className="p-6">
                            {recentVulnerabilities.length > 0 ? (
                                <div className="space-y-4">
                                    {recentVulnerabilities.slice(0, 5).map((vuln) => (
                                        <div key={vuln.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                                        {vuln.severity.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{vuln.type.replace('_', ' ').toUpperCase()}</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{vuln.scan.website.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{vuln.url}</p>
                                                {vuln.parameter && (
                                                    <p className="text-xs text-gray-500 mt-1">Parameter: {vuln.parameter}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">🛡️</div>
                                    <p className="text-gray-600 dark:text-gray-400">No vulnerabilities found yet</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Start scanning your websites to identify security issues</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}