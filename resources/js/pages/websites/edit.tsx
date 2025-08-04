import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Website {
    id: number;
    name: string;
    url: string;
    description: string | null;
    status: string;
    scan_settings: {
        max_pages: number;
        max_depth: number;
        delay_between_requests: number;
    };
}

interface Props {
    website: Website;
    [key: string]: unknown;
}

export default function WebsiteEdit({ website }: Props) {
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
        {
            title: 'Edit',
            href: `/websites/${website.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: website.name,
        url: website.url,
        description: website.description || '',
        status: website.status,
        scan_settings: {
            max_pages: website.scan_settings.max_pages,
            max_depth: website.scan_settings.max_depth,
            delay_between_requests: website.scan_settings.delay_between_requests,
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('websites.update', website.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${website.name} - XSS Scanner`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            ✏️ Edit Website
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Update website information and scan settings
                        </p>
                    </div>
                    <Link
                        href={route('websites.show', website.id)}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        ← Back to Website
                    </Link>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Website Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Website URL *
                                    </label>
                                    <input
                                        type="url"
                                        id="url"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {errors.url && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scan Settings */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Scan Settings</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="max_pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Maximum Pages to Scan
                                    </label>
                                    <input
                                        type="number"
                                        id="max_pages"
                                        value={data.scan_settings.max_pages}
                                        onChange={(e) => setData('scan_settings', { ...data.scan_settings, max_pages: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                        min="1"
                                        max="1000"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="max_depth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Maximum Crawl Depth
                                    </label>
                                    <input
                                        type="number"
                                        id="max_depth"
                                        value={data.scan_settings.max_depth}
                                        onChange={(e) => setData('scan_settings', { ...data.scan_settings, max_depth: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                        min="1"
                                        max="10"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="delay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Delay Between Requests (ms)
                                    </label>
                                    <input
                                        type="number"
                                        id="delay"
                                        value={data.scan_settings.delay_between_requests}
                                        onChange={(e) => setData('scan_settings', { ...data.scan_settings, delay_between_requests: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                        min="0"
                                        max="10000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                {processing ? 'Updating Website...' : 'Update Website'}
                            </button>
                            <Link
                                href={route('websites.show', website.id)}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}