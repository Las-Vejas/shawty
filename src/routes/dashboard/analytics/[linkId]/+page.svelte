<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    function getTopItems(obj: Record<string, number>, limit = 5) {
        return Object.entries(obj)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit);
    }

    function getPercentage(value: number, total: number) {
        return ((value / total) * 100).toFixed(1);
    }
</script>

<svelte:head>
    <title>Analytics - {data.link.short_code}</title>
</svelte:head>

<div class="p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <a href="/dashboard" class="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white mb-2 inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Dashboard
                </a>
                <h1 class="text-3xl font-bold">Analytics</h1>
                <div class="flex items-center gap-2 mt-2">
                    <a href="/{data.link.short_code}" class="text-lg text-blue-500 dark:text-blue-400 hover:underline">
                        www.shawty.app/{data.link.short_code}
                    </a>
                    <span class="text-zinc-500">→</span>
                    <a href={data.link.long_url} target="_blank" rel="noopener noreferrer" class="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 truncate max-w-md">
                        {data.link.long_url}
                    </a>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm text-zinc-500 dark:text-zinc-400">Total Clicks</p>
                <p class="text-4xl font-bold">{data.analytics.totalClicks.toLocaleString()}</p>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Countries -->
            <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
                <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-400">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <h3 class="font-semibold">Top Countries</h3>
                </div>
                <div class="space-y-2">
                    {#each getTopItems(data.analytics.byCountry, 3) as [country, count]}
                        <div class="flex items-center justify-between text-sm">
                            <span class="dark:text-zinc-300">{country}</span>
                            <span class="font-medium">{count}</span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Devices -->
            <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
                <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-400">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <h3 class="font-semibold">Devices</h3>
                </div>
                <div class="space-y-2">
                    {#each getTopItems(data.analytics.byDevice, 3) as [device, count]}
                        <div class="flex items-center justify-between text-sm">
                            <span class="dark:text-zinc-300 capitalize">{device}</span>
                            <span class="font-medium">{count}</span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Operating Systems -->
            <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
                <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-400">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                        <rect x="9" y="9" width="6" height="6"></rect>
                        <line x1="9" y1="1" x2="9" y2="4"></line>
                        <line x1="15" y1="1" x2="15" y2="4"></line>
                        <line x1="9" y1="20" x2="9" y2="23"></line>
                        <line x1="15" y1="20" x2="15" y2="23"></line>
                        <line x1="20" y1="9" x2="23" y2="9"></line>
                        <line x1="20" y1="14" x2="23" y2="14"></line>
                        <line x1="1" y1="9" x2="4" y2="9"></line>
                        <line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                    <h3 class="font-semibold">Operating Systems</h3>
                </div>
                <div class="space-y-2">
                    {#each getTopItems(data.analytics.byOS, 3) as [os, count]}
                        <div class="flex items-center justify-between text-sm">
                            <span class="dark:text-zinc-300">{os}</span>
                            <span class="font-medium">{count}</span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Browsers -->
            <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
                <div class="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-400">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="21.17" y1="8" x2="12" y2="8"></line>
                        <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                        <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                    </svg>
                    <h3 class="font-semibold">Browsers</h3>
                </div>
                <div class="space-y-2">
                    {#each getTopItems(data.analytics.byBrowser, 3) as [browser, count]}
                        <div class="flex items-center justify-between text-sm">
                            <span class="dark:text-zinc-300">{browser}</span>
                            <span class="font-medium">{count}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Country Chart -->
            <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
                <h3 class="text-lg font-semibold mb-4">Clicks by Country</h3>
                <div class="space-y-3">
                    {#each getTopItems(data.analytics.byCountry, 10) as [country, count]}
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-sm">
                                <span class="dark:text-zinc-300">{country}</span>
                                <span class="text-zinc-600 dark:text-zinc-400">{count} ({getPercentage(count, data.analytics.totalClicks)}%)</span>
                            </div>
                            <div class="w-full bg-zinc-800 rounded-full h-2">
                                <div 
                                    class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style="width: {getPercentage(count, data.analytics.totalClicks)}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Device Chart -->
            <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
                <h3 class="text-lg font-semibold mb-4">Clicks by Device</h3>
                <div class="space-y-3">
                    {#each getTopItems(data.analytics.byDevice) as [device, count]}
                        <div class="space-y-1">
                            <div class="flex items-center justify-between text-sm">
                                <span class="dark:text-zinc-300 capitalize">{device}</span>
                                <span class="text-zinc-600 dark:text-zinc-400">{count} ({getPercentage(count, data.analytics.totalClicks)}%)</span>
                            </div>
                            <div class="w-full bg-zinc-800 rounded-full h-2">
                                <div 
                                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style="width: {getPercentage(count, data.analytics.totalClicks)}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Click Log -->
        <div class="dark:bg-zinc-900 rounded-xl p-6 border dark:border-zinc-800">
            <h3 class="text-lg font-semibold mb-4">Recent Clicks</h3>
            {#if data.clicks && data.clicks.length > 0}
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="border-b dark:border-zinc-800">
                            <tr class="text-left text-sm text-zinc-400">
                                <th class="pb-3 font-medium">Time</th>
                                <th class="pb-3 font-medium">Location</th>
                                <th class="pb-3 font-medium">Device</th>
                                <th class="pb-3 font-medium">OS</th>
                                <th class="pb-3 font-medium">Browser</th>
                                <th class="pb-3 font-medium">Referrer</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            {#each data.clicks.slice(0, 50) as click}
                                <tr class="border-b dark:border-zinc-800/50 dark:hover:bg-zinc-800/30">
                                    <td class="py-3 dark:text-zinc-300">
                                        {new Date(click.clicked_at).toLocaleString()}
                                    </td>
                                    <td class="py-3">
                                        <span class="dark:text-zinc-300">
                                            {click.city ? `${click.city}, ` : ''}{click.country || 'Unknown'}
                                        </span>
                                    </td>
                                    <td class="py-3 dark:text-zinc-300 capitalize">{click.device || 'Unknown'}</td>
                                    <td class="py-3 dark:text-zinc-300">{click.os || 'Unknown'}</td>
                                    <td class="py-3 dark:text-zinc-300">{click.browser || 'Unknown'}</td>
                                    <td class="py-3 dark:text-zinc-400 text-xs truncate max-w-xs">
                                        {#if click.referrer}
                                            <a href={click.referrer} target="_blank" rel="noopener noreferrer" class="hover:text-blue-400">
                                                {new URL(click.referrer).hostname}
                                            </a>
                                        {:else}
                                            Direct
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <p class="dark:text-zinc-400 text-center py-8">No clicks yet</p>
            {/if}
        </div>
    </div>
</div>