import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

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
        title: 'Add Website',
        href: '/websites/create',
    },
];

export default function WebsiteCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        url: '',
        description: '',
        scan_settings: {
            max_pages: 50,
            max_depth: 3,
            delay_between_requests: 1000,
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('websites.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Website - XSS Scanner" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🌐 Add Website
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                            Add a new website to scan for XSS vulnerabilities
                        </p>
                    </div>
                    <Link
                        href={route('websites.index')}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        ← Back to Websites
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
                                        placeholder="e.g., My Company Website"
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
                                        placeholder="https://example.com"
                                        required
                                    />
                                    {errors.url && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.url}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Enter the base URL of the website you want to scan
                                    </p>
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
                                        placeholder="Optional description for this website"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
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
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Limit the number of pages to scan (1-1000)
                                    </p>
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
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        How deep to crawl from the starting URL (1-10 levels)
                                    </p>
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
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Delay between requests to be respectful to the target server
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Warning */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl flex-shrink-0">⚠️</span>
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                        Ethical Scanning Only
                                    </h3>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        Only scan websites that you own or have explicit permission to test. 
                                        Unauthorized scanning may violate laws and terms of service.
                                    </p>
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
                                {processing ? 'Adding Website...' : 'Add Website'}
                            </button>
                            <Link
                                href={route('websites.index')}
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