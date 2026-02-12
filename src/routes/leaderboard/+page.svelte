<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>Leaderboard - Shawty</title>
</svelte:head>

<div class="p-6 mb-16">
    <div class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center space-y-4 mt-16">
            <h1 class="text-4xl font-bold">🏆 Leaderboard</h1>
            <p class="text-lg text-zinc-400">Most clicked links by Hack Clubbers</p>
        </div>

        <!-- Leaderboard -->
        <div class="bg-zinc-900 rounded-2xl shadow-lg p-6">
            {#if data.links && data.links.length > 0}
                <div class="space-y-3">
                    {#each data.links as link, index}
                        <div class="flex items-center gap-4 rounded-xl bg-zinc-800 px-6 py-4 hover:bg-zinc-750 transition-colors">
                            <!-- Rank -->
                            <div class="flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl
                                {index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                 index === 1 ? 'bg-zinc-400/20 text-zinc-300' : 
                                 index === 2 ? 'bg-orange-500/20 text-orange-400' : 
                                 'bg-zinc-700 text-zinc-400'}">
                                {#if index === 0}
                                    🥇
                                {:else if index === 1}
                                    🥈
                                {:else if index === 2}
                                    🥉
                                {:else}
                                    #{index + 1}
                                {/if}
                            </div>

                            <!-- Link Info -->
                            <div class="flex flex-col min-w-0 flex-1">
                                <a href="/{link.short_code}" class="text-base font-medium text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                    www.shawty.app/{link.short_code}
                                </a>
                                <a href={link.long_url} target="_blank" rel="noopener noreferrer" class="text-sm text-zinc-400 truncate hover:text-zinc-300">
                                    {link.long_url}
                                </a>
                            </div>

                            <!-- Clicks -->
                            <div class="flex flex-col items-end">
                                <span class="text-2xl font-bold text-white">{link.clicks.toLocaleString()}</span>
                                <span class="text-xs text-zinc-400">clicks</span>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-16 space-y-4">
                    <div class="text-6xl">🏆</div>
                    <p class="text-xl text-zinc-400">No links on the leaderboard yet</p>
                    <p class="text-sm text-zinc-500">Be the first to add your link!</p>
                </div>
            {/if}
        </div>

        <!-- Info Box -->
        <div class="bg-blue-600/15 dark:bg-blue-500/10 border border-blue-500/35 dark:border-blue-500/20 rounded-xl p-6">
            <div class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400 shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div class="text-sm text-blue-500 dark:text-blue-300">
                    <p class="font-medium mb-1">How to join the leaderboard?</p>
                    <p class="text-blue-500/80 dark:text-blue-300/80">Go to your dashboard, click the menu on any link, and toggle "Show on Leaderboard" to make your link public!</p>
                </div>
            </div>
        </div>
    </div>
</div>