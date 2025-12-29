<script lang="ts">
    export let data;
</script>

<div class="relative overflow-hidden">
    <!-- Hero Section -->
    <div class="relative px-6 py-20 lg:py-32">
        <!-- Background gradient -->
        <div class="absolute inset-0 -z-10 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
        
        <div class="mx-auto max-w-5xl text-center space-y-8">
        <!-- Hero Text -->
            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight">
                <span class="bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    Short links,
                </span>
                <br />
                <span class="bg-linear-to-r from-amber-400 to-sky-400 bg-clip-text text-transparent">
                    infinite possibilities
                </span>
            </h1>

            <p class="text-xl text-zinc-400 max-w-2xl mx-auto">
                Create branded short links, track clicks, and share QR codes. Built by Hack Clubbers, for Hack Clubbers.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {#if data?.user}
                    <a href="/dashboard" class="px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 text-lg shadow-lg hover:shadow-xl transition-all">
                        Go to Dashboard →
                    </a>
                {:else}
                    <a href="/login" class="px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 text-lg shadow-lg hover:shadow-xl transition-all">
                        Get Started For Free
                    </a>
                {/if}
                <a href="#features" class="px-8 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-medium text-lg transition-all">
                    See Features
                </a>
            </div>

            <!-- Stats -->
                <div class="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div class="space-y-1">
                        <p class="text-3xl font-bold text-white">∞</p>
                        <p class="text-sm text-zinc-400">Links Created</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-3xl font-bold text-white">⚡</p>
                        <p class="text-sm text-zinc-400">Lightning Fast</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-3xl font-bold text-white">🔒</p>
                        <p class="text-sm text-zinc-400">Secure</p>
                    </div>
                </div>
        </div>
    </div>

    <!-- Demo Section -->
    <div class="px-6 py-6">
        <div class="mx-auto max-w-4xl">
            <div class="bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">
                <div class="flex items-center gap-2 mb-6">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                <div class="space-y-4">
                    <div class="flex gap-3">
                        <input
                            value="https://hackclub.com/some/really/long/url/that/nobody/wants/to/type"
                            disabled
                            class="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-400"
                        />
                        <button disabled class="px-6 py-3 rounded-xl bg-white text-zinc-900 font-medium">
                            Shorten
                        </button>
                    </div>
                    
                    <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                        <p class="text-emerald-400 mb-2">✨ Shortened successfully!</p>
                        <p class="text-2xl font-mono text-white">vejas.site/hack</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="px-6 py-20">
        <div class="mx-auto max-w-5xl">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4">Everything you need</h2>
                <p class="text-xl text-zinc-400">Powerful features, simple interface</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-400">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Instant Shortening</h3>
                    <p class="text-zinc-400">Transform long URLs into short, shareable links in seconds.</p>
                </div>

                <!-- Feature 2 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-400">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">QR Codes</h3>
                    <p class="text-zinc-400">Generate QR codes for any link with one click.</p>
                </div>

                <!-- Feature 3 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-400">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Click Tracking</h3>
                    <p class="text-zinc-400">Monitor how many times your links are clicked.</p>
                </div>

                <!-- Feature 4 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-400">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure</h3>
                    <p class="text-zinc-400">Authenticated with Hack Club SSO for security.</p>
                </div>

                <!-- Feature 5 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-pink-400">
                            <line x1="6" y1="20" x2="6" y2="12"></line>
                            <line x1="12" y1="20" x2="12" y2="8"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Analytics for each link</h3>
                    <p class="text-zinc-400">See analytics for every link you create with great detail.</p>
                </div>

                <!-- Feature 6 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan-400">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Privacy First</h3>
                    <p class="text-zinc-400">Your data stays yours. No tracking, no ads.</p>
                </div>
            </div>
        </div>
    </div>

<div id="analytics" class="px-6 py-20">
        <div class="mx-auto max-w-5xl">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-4">Analytics you care about</h2>
                <p class="text-xl text-zinc-400">Easy to read data included!</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- User Location -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">User Location</h3>
                    <p class="text-zinc-400">See where your users are coming from with (not so) detailed location data.</p>
                </div>

                <!-- Feature 2 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-pink-400">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Devices</h3>
                    <p class="text-zinc-400">See what devices your users are using to access your sites.</p>
                </div>

                <!-- Feature 3 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-lime-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-lime-400">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Operating systems</h3>
                    <p class="text-zinc-400">See what operating system is most popular among your users.</p>
                </div>

                <!-- Feature 4 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-rose-400">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure</h3>
                    <p class="text-zinc-400">Nobody can see your link data except you.</p>
                </div>

                <!-- Feature 5 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-400">
                            <line x1="6" y1="20" x2="6" y2="12"></line>
                            <line x1="12" y1="20" x2="12" y2="8"></line>
                            <line x1="18" y1="20" x2="18" y2="4"></line>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Analytics for each link</h3>
                    <p class="text-zinc-400">See analytics for every link you create with great detail.</p>
                </div>

                <!-- Feature 6 -->
                <div class="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-400">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Privacy First</h3>
                    <p class="text-zinc-400">Your data stays yours. No tracking, no ads.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="px-6 py-20">
        <div class="mx-auto max-w-4xl">
            <div class="bg-linear-to-r from-teal-500/10 to-amber-500/10 rounded-3xl p-12 text-center border border-zinc-800">
                <h2 class="text-4xl font-bold mb-4">Ready to get started?</h2>
                <p class="text-xl text-zinc-400 mb-8">Join Hack Clubbers already using Shawty</p>
                {#if !data?.user}
                    <a href="/login" class="inline-block px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 text-lg shadow-lg hover:shadow-xl transition-all">
                        Log in with Hack Club →
                    </a>
                {:else}
                    <a href="/dashboard" class="inline-block px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 text-lg shadow-lg hover:shadow-xl transition-all">
                        Go to Dashboard →
                    </a>
                {/if}
            </div>
        </div>
    </div>
</div>
