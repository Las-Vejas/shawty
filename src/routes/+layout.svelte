<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import SunIcon from "@lucide/svelte/icons/sun";
      import MoonIcon from "@lucide/svelte/icons/moon";

    import Button from '$lib/components/ui/button/button.svelte';
    import { toggleMode } from "mode-watcher";
    import { ModeWatcher } from "mode-watcher";
    import { resetMode, setMode } from "mode-watcher";
      import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
      import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { onMount } from 'svelte';
    
    let { children, data } = $props();

    const commitHash = __GIT_COMMIT_HASH__ || 'main';
    const repoUrl = 'https://github.com/Las-Vejas/shawty';
    const commitUrl = `${repoUrl}/commit/${commitHash}`;

    let currentEmoji = $state('❤️');
    const emojis = ['☕', '💻', '🚀', '🔥', '💡', '🎉', '✨'];

    onMount(() => {
        let emojiIndex = 0;
        let isScrolling = false;
        
        const scroll = () => {
            isScrolling = true;
            let scrollCount = 0;
            const maxScrolls = 15;
            
            const scrollInterval = setInterval(() => {
                emojiIndex = (emojiIndex + 1) % emojis.length;
                currentEmoji = emojis[emojiIndex];
                scrollCount++;
                
                if (scrollCount >= maxScrolls) {
                    clearInterval(scrollInterval);
                    // Land on heart
                    currentEmoji = '❤️';
                    isScrolling = false;
                    
                    // Wait 15 seconds before next scroll
                    setTimeout(() => {
                        scroll();
                    }, 15000);
                }
            }, 100);
        };
        
        scroll();
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen  flex flex-col">
    <nav class="sticky top-0 z-50  backdrop-blur-sm border-b">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
                shawty
            </a>
            <div class="flex items-center gap-4">
                {#if data?.user}
                    <span class="text-sm">
                        Hey, <span class=" font-medium">{data.user.first_name}</span>!
                    </span>
                    <Button href="/dashboard" variant="default" class="">
                        Dashboard
                    </Button>
                    <Button href="/leaderboard" variant="ghost" class="">
                        Leaderboard
                    </Button>
                    <Button variant="destructive" href="/auth/logout">
                        Logout
                    </Button>
                    
                {:else}
                    <Button href="/leaderboard" variant="outline" class="">
                        Leaderboard
                    </Button>
                    <Button href="/login" variant="default" class="">
                        Log in
                    </Button>
                {/if}
            </div>
        </div>
    </nav>

    <main class="flex-1  min-h-[calc(100vh-16rem)]">
        <ModeWatcher />
        {@render children()}
    </main>

    <footer class="border-t border border- dark:border-zinc-800 ">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h3 class="text-lg font-bold mb-3">shawty</h3>
                    <p class="text-sm text-zinc-400">
                        Simple and short links.
                    </p>
                </div>

                <div>
                    <h4 class="text-sm font-semibold mb-3 ">Links</h4>
                    <ul class="space-y-2 text-sm ">
                        <li><a href="/" class="hover:text-zinc-400 transition-colors">Home</a></li>
                        <li><a href="/dashboard" class="hover:text-zinc-400 transition-colors">Dashboard</a></li>

                    </ul>
                </div>

                <div>
                    <h4 class="text-sm font-semibold mb-3">Connect</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="https://hackclub.enterprise.slack.com/team/U0930DMR4BA" class="hover:text-zinc-400 transition-colors">@Vejas on Slack</a></li>
                        <li><a href={repoUrl} target="_blank" rel="noopener noreferrer" class="hover:text-zinc-400 transition-colors">GitHub Repo</a></li>
                    </ul>
                </div>
            </div>

            <!-- Bottom bar -->
            <div class="flex justify-between items-center mt-8 pt-6 border-t border-amber-50 dark:border-zinc-800 text-center text-sm text-zinc-400">
                <div class="flex items-center gap-3">
                    <p>&copy; {new Date().getFullYear()} shawty. Built with {currentEmoji} by <a href="https://vejas.zip" class="text-decoration-underline">Vejas</a></p>
                    <span class="text-zinc-600">•</span>
                    <a 
                        href={commitUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-xs text-zinc-500 hover:text-zinc-400 transition-colors font-mono"
                        title="View commit on GitHub"
                    >
                        built from {commitHash}
                    </a>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
                    <SunIcon class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"/>
                    <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"/>
                    <span class="sr-only">Toggle theme</span>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    <DropdownMenu.Item onclick={() => setMode("light")}>Light</DropdownMenu.Item>
                    <DropdownMenu.Item onclick={() => setMode("dark")}>Dark</DropdownMenu.Item>
                    <DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </div>
    </footer>
</div>
