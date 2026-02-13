<script lang="ts">
    export let data;
    import Button from '$lib/components/ui/button/button.svelte';
    import Link from "@lucide/svelte/icons/link";
    import QrCode from "@lucide/svelte/icons/qr-code";
    import Activity from "@lucide/svelte/icons/activity";
    import Globe from "@lucide/svelte/icons/globe";
    import Shield from "@lucide/svelte/icons/shield"
    import Chart2 from "@lucide/svelte/icons/chart-no-axes-column"
    import Chart from "@lucide/svelte/icons/chart-no-axes-combined"
    import Lock from "@lucide/svelte/icons/lock"
    import Laptop from "@lucide/svelte/icons/laptop"
    import Infinity from "@lucide/svelte/icons/infinity"
    import Zap from "@lucide/svelte/icons/zap"
    import { onMount } from 'svelte';
    import gsap from 'gsap';

    onMount(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        const originalText = 'Secure';
        const element = document.getElementById('securitytext');
        
        if (element) {
            const scramble = () => {
                let iteration = 0;
                const interval = setInterval(() => {
                    element.innerText = originalText
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) {
                                return originalText[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');
                    
                    if (iteration >= originalText.length) {
                        clearInterval(interval);
                    }
                    iteration += 1 / 3;
                }, 30);
            };
            
            // Initial scramble on load
            scramble();
            
            // Scramble on hover
            const parent = element.parentElement;
            if (parent) {
                parent.addEventListener('mouseenter', scramble);
            }
        }

        // Hack rhyming words scramble effect
        const hackElement = document.getElementById('hacktext');
        const rhymingWords = ['hack', 'back', 'pack', 'stack', 'track', 'snack', 'slack', 'crack'];
        let currentIndex = 0;
        
        if (hackElement) {
            const scrambleToNext = () => {
                const nextIndex = (currentIndex + 1) % rhymingWords.length;
                const targetWord = rhymingWords[nextIndex];
                let iteration = 0;
                
                const interval = setInterval(() => {
                    hackElement.innerText = targetWord
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) {
                                return targetWord[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)].toLowerCase();
                        })
                        .join('');
                    
                    if (iteration >= targetWord.length) {
                        clearInterval(interval);
                        currentIndex = nextIndex;
                    }
                    iteration += 1 / 3;
                }, 50);
            };
            
            // Change word every 3 seconds
            setInterval(scrambleToNext, 3000);
        }
    });
</script>

<div class="relative overflow-hidden">
    <!-- Hero Section -->
    <div class="relative px-6 py-14 lg:py-32">
        <div class="mx-auto max-w-5xl text-center space-y-8">
        <!-- Hero Text -->
            <h1 class="text-5xl lg:text-7xl font-bold tracking-tight">
                <span class="bg-linear-to-r from-black to-zinc-700 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                    Links shorter,
                </span>
                <br />
                <span class="bg-linear-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    than my patience.
                </span>
            </h1>

            <p class="text-xl text-zinc-400 max-w-2xl mx-auto">
                Create branded short links, track clicks, and share QR codes. Built for Hack Clubbers.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {#if data?.user}
                    <Button href="/dashboard" variant="default" size="lg">
                        Go to Dashboard →
                    </Button>
                {:else}
                    <Button href="/login" variant="default" size="lg">
                        Get Started For Free
                    </Button>
                {/if}
                <Button href="#features" variant="outline" size="lg">
                    See Features
                </Button>
            </div>

            <!-- Stats -->
                <div class="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div class="flex flex-col space-y-4 items-center">

                        <Infinity class=""/>
                        <p class="text-sm dark:text-zinc-400 text-zinc-700">Links Created</p>
                    </div>
                    <div class="flex flex-col space-y-4 items-center">
                        <Zap/>
                        <p class="text-sm dark:text-zinc-400 text-zinc-700">Lightning Fast</p>
                    </div>
                    <div class="flex flex-col space-y-4 items-center">
                        <Lock/>
                        <p id="securitytext" class="text-sm dark:text-zinc-400 text-zinc-700">Secure</p>
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
                        <p class="text-2xl font-mono text-white">vejas.site/<span id="hacktext">hack</span></p>
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
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <Link color="currentColor" class="text-sky-400"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Instant Shortening</h3>
                    <p class="text-zinc-400">Transform long URLs into short, shareable links in seconds.</p>
                </div>

                <!-- Feature 2 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                        <QrCode class="text-purple-400" color="currentColor"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">QR Codes</h3>
                    <p class="text-zinc-400">Generate QR codes for any link with one click.</p>
                </div>

                <!-- Feature 3 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <Activity class="text-emerald-400" color="currentColor"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Click Tracking</h3>
                    <p class="text-zinc-400">Monitor how many times your links are clicked.</p>
                </div>

                <!-- Feature 4 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                        <Shield class='text-orange-400' color="currentColor"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Secure</h3>
                    <p class="text-zinc-400">Authenticated with Hack Club SSO for security.</p>
                </div>

                <!-- Feature 5 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                        <Chart class="text-pink-400"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Analytics for each link</h3>
                    <p class="text-zinc-400">See analytics for every link you create with great detail.</p>
                </div>

                <!-- Feature 6 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                        <Lock class="text-cyan-400"/>
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
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                        <Globe class="text-amber-400"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">User Location</h3>
                    <p class="text-zinc-400">See where your users are coming from with (not so) detailed location data.</p>
                </div>

                <!-- Feature 2 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                        <Laptop class="text-pink-400"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Devices</h3>
                    <p class="text-zinc-400">See what devices your users are using to access your sites.</p>
                </div>

                <!-- Feature 3 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-lime-500/10 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-lime-400">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Operating systems</h3>
                    <p class="text-zinc-400">See what operating system is most popular among your users.</p>
                </div>

                <!-- Feature 4 -->
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
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
                <div class="dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                        <Chart2 class="text-cyan-400"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Analytics for each link</h3>
                    <p class="text-zinc-400">See analytics for every link you create with great detail.</p>
                </div>

                <!-- Feature 6 -->
                <div class="border-gray-100 dark:bg-zinc-900 rounded-2xl p-8 border dark:border-zinc-800 dark:hover:border-zinc-700 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                        <Shield class="text-purple-400"/>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Privacy First</h3>
                    <p class="text-zinc-400">Only you can see the analytics of your links.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="px-6 py-20">
        <div class="mx-auto max-w-4xl">
            <div class="bg-linear-to-tr bg-transparent from-sky-500/50 to-purple-500/40 overflow-clip rounded-3xl p-12 text-center border border-gray-300 dark:border-zinc-800">
                <h2 class="text-4xl font-bold mb-4">Ready to get started?</h2>
                <p class="text-xl dark:text-gray-300 mb-8">Join Hack Clubbers already using Shawty</p>
                {#if !data?.user}
                    <Button href="/login" variant="default" class="">
                        Log in with Hack Club →
                    </Button>
                {:else}
                    <a href="/dashboard" class="inline-block px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold hover:bg-zinc-200 text-lg shadow-lg hover:shadow-xl transition-all">
                        Go to Dashboard →
                    </a>
                {/if}
            </div>
        </div>
    </div>
</div>
