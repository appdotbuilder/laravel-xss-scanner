import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="XSS Vulnerability Scanner">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-red-50 to-orange-50 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-red-950 dark:to-orange-950 dark:text-white">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                                🔍
                            </div>
                            <span className="font-semibold">XSS Scanner</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-6xl flex-col items-center text-center">
                        {/* Hero Section */}
                        <div className="mb-16 max-w-4xl">
                            <div className="mb-6 flex justify-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-600 text-4xl text-white shadow-lg">
                                    🛡️
                                </div>
                            </div>
                            <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-6xl">
                                🔍 XSS Vulnerability Scanner
                            </h1>
                            <p className="mb-8 text-xl text-gray-600 lg:text-2xl dark:text-gray-300">
                                Protect your web applications from Cross-Site Scripting attacks with our comprehensive security scanning platform
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white hover:bg-red-700 transition-colors shadow-lg"
                                    >
                                        Go to Dashboard →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white hover:bg-red-700 transition-colors shadow-lg"
                                        >
                                            Start Scanning for Free
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-block rounded-lg border-2 border-red-600 px-8 py-4 text-lg font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900">
                                    🌐
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Website Management</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Add and manage multiple websites for comprehensive security scanning across your entire web portfolio.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl dark:bg-green-900">
                                    🤖
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Smart Web Crawler</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Advanced crawler with JavaScript rendering support to scan modern web applications thoroughly.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-2xl dark:bg-red-900">
                                    ⚡
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">XSS Detection Engine</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Comprehensive XSS payload testing with reflected, stored, and DOM-based vulnerability detection.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl dark:bg-purple-900">
                                    📊
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Detailed Reports</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Get comprehensive vulnerability reports with evidence, severity ratings, and remediation guidance.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-2xl dark:bg-orange-900">
                                    🔒
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">Ethical Scanning</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Built for responsible security testing with rate limiting and respectful crawling policies.
                                </p>
                            </div>

                            <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-2xl dark:bg-teal-900">
                                    👥
                                </div>
                                <h3 className="mb-3 text-xl font-semibold">User Authentication</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Secure user accounts with personal dashboards to track your website security assessments.
                                </p>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-16 w-full max-w-4xl rounded-xl bg-yellow-50 border border-yellow-200 p-8 dark:bg-yellow-900/20 dark:border-yellow-800">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 text-2xl">⚠️</div>
                                <div>
                                    <h3 className="mb-2 text-xl font-semibold text-yellow-800 dark:text-yellow-200">
                                        Ethical Use Only
                                    </h3>
                                    <p className="text-yellow-700 dark:text-yellow-300">
                                        This XSS scanner is designed for ethical security testing purposes only. Only scan websites 
                                        that you own or have explicit permission to test. Unauthorized scanning may violate laws 
                                        and terms of service.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        {!auth.user && (
                            <div className="mt-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold">Ready to Secure Your Websites?</h2>
                                <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                                    Join thousands of developers protecting their applications from XSS vulnerabilities
                                </p>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-red-600 px-8 py-4 text-lg font-semibold text-white hover:bg-red-700 transition-colors shadow-lg"
                                >
                                    Start Your Free Security Scan
                                </Link>
                            </div>
                        )}

                        <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
                            <p>
                                Built with ❤️ for web security by{" "}
                                <a 
                                    href="https://app.build" 
                                    target="_blank" 
                                    className="font-medium text-red-600 hover:underline dark:text-red-400"
                                >
                                    app.build
                                </a>
                            </p>
                        </footer>
                    </main>
                </div>
            </div>
        </>
    );
}