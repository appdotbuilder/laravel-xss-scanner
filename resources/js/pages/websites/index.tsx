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
    vulnerabilities_count: number;
    scans: Array<{
        id: number;
        status: string;
        vulnerabilities_found: number;
        completed_at: string | null;
    }>;
}

interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    websites: {
        data: Website[];
        links: PaginationLinks;
        meta: PaginationMeta;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Websites',
        href: '/websites',
    },
];

export default function WebsitesIndex({ websites }: Props) {
    const handleAddWebsite = () => {
        router.visit(route('websites.create'));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
            case 'inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
            case 'scanning': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
            default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
        }
    };

    const getLastScanStatus = (website: Website) => {
        if (website.scans.length === 0) return 'Never scanned';
        const lastScan = website.scans[0];
        return `${lastScan.status} • ${lastScan.vulnerabilities_found} vulns`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Websites - XSS Scanner" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🌐 Websites
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Manage and scan your websites for XSS vulnerabilities
                        </p>
                    </div>
                    <button
                        onClick={handleAddWebsite}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        + Add Website
                    </button>
                </div>

                {websites.data.length > 0 ? (
                    <>
                        {/* Websites Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {websites.data.map((website) => (
                                <div key={website.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    {website.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 break-all">
                                                    {website.url}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(website.status)}`}>
                                                        {website.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">{website.scans_count}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Scans</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">{website.vulnerabilities_count || 0}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">Vulnerabilities</div>
                                            </div>
                                        </div>

                                        {/* Last Scan Info */}
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Last Scan</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {website.last_scanned_at ? new Date(website.last_scanned_at).toLocaleDateString() : 'Never'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                                {getLastScanStatus(website)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('websites.show', website.id)}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                href={route('websites.edit', website.id)}
                                                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                            >
                                                ✏️
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {websites.meta.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {((websites.meta.current_page - 1) * websites.meta.per_page) + 1} to {Math.min(websites.meta.current_page * websites.meta.per_page, websites.meta.total)} of {websites.meta.total} websites
                                </div>
                                <div className="flex items-center gap-2">
                                    {websites.links.prev && (
                                        <Link
                                            href={websites.links.prev}
                                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-sidebar-border/70 dark:border-sidebar-border rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Page {websites.meta.current_page} of {websites.meta.last_page}
                                    </span>
                                    {websites.links.next && (
                                        <Link
                                            href={websites.links.next}
                                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-sidebar-border/70 dark:border-sidebar-border rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-6xl mb-6">🌐</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No websites yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
                            Add your first website to start scanning for XSS vulnerabilities and keeping your applications secure.
                        </p>
                        <button
                            onClick={handleAddWebsite}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Add Your First Website
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}