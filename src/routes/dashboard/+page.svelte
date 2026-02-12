<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Button from "$lib/components/ui/button/button.svelte";
    import ChartNoAxesColumn from "@lucide/svelte/icons/chart-no-axes-column";
    import QrCode from "@lucide/svelte/icons/qr-code";
    import Pencil from "@lucide/svelte/icons/pencil";
    import Trophy from "@lucide/svelte/icons/trophy";
    import Trash2 from "@lucide/svelte/icons/trash-2";
    import Ellipsis from "@lucide/svelte/icons/ellipsis";

    let { data, form }: { data: PageData; form: ActionData } = $props();
    
    // Link creation state
    let isCreatingLink = $state(false);
    let apiMessage = $state<{ type: 'success' | 'error'; text: string; shortCode?: string } | null>(null);
    let urlInput = $state('');
    let customSlugInput = $state('');
    let passwordInput = $state('');
    
    // Track which QR code is being shown
    let showQrId = $state<string | null>(null);
    
    // Track which link is being edited
    let editingId = $state<string | null>(null);
    let editUrl = $state<string>('');
    
    // Show advanced options
    let showAdvanced = $state<boolean>(false);
    
    function showQr(linkId: string) {
        showQrId = linkId;
    }
    
    function closeQr() {
        showQrId = null;
    }
    
    function startEdit(linkId: string, currentUrl: string) {
        editingId = linkId;
        editUrl = currentUrl;
    }
    
    function cancelEdit() {
        editingId = null;
        editUrl = '';
    }

    async function handleCreateLink() {
        const url = urlInput.trim();
        if (!url) {
            apiMessage = { type: 'error', text: 'URL is required' };
            return;
        }

        isCreatingLink = true;
        apiMessage = null;

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url,
                    customSlug: customSlugInput || null,
                    password: passwordInput || null
                })
            });

            const result = await response.json();

            if (response.ok && result.shortCode) {
                apiMessage = { 
                    type: 'success', 
                    text: `Short link created!`,
                    shortCode: result.shortCode
                };
                urlInput = '';
                customSlugInput = '';
                passwordInput = '';
                showAdvanced = false;
                // Refresh links from API
                await new Promise(resolve => setTimeout(resolve, 500));
                const linksResponse = await fetch('/api/links');
                if (linksResponse.ok) {
                    const linksData = await linksResponse.json();
                    data.links = linksData.links;
                    data.total = linksData.total;
                }
            } else {
                apiMessage = { type: 'error', text: result.error || 'Failed to create link' };
            }
        } catch (error) {
            console.error('Error creating link:', error);
            apiMessage = { type: 'error', text: 'An error occurred while creating the link' };
        } finally {
            isCreatingLink = false;
        }
    }
</script>

<div class="p-6">
    <div class="max-w-3xl mx-auto space-y-8">

        <!-- Shorten Card -->
        <div class="dark:bg-zinc-900 rounded-2xl border-gray-300 dark:border-zinc-800 border shadow-sm p-6 space-y-4">
            <h2 class="text-xl font-semibold">Shorten a link</h2>
            <div class="space-y-4">
                <div class="flex gap-3">
                    <input
                        bind:value={urlInput}
                        placeholder="example.com or https://example.com"
                        required
                        disabled={isCreatingLink}
                        class="flex-1 rounded-xl dark:bg-zinc-800 border-gray-300 dark:border-zinc-800 border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                    />
                    <Button type="button" onclick={handleCreateLink} variant="default" class="px-6 rounded-xl font-medium h-12.5" disabled={isCreatingLink}>
                        {isCreatingLink ? 'Creating...' : 'Shorten'}
                    </Button>
                </div>
                
                <!-- Advanced Options Toggle -->
                <button 
                    type="button"
                    onclick={() => showAdvanced = !showAdvanced}
                    disabled={isCreatingLink}
                    class="text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center gap-2 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform {showAdvanced ? 'rotate-180' : ''}">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    {showAdvanced ? 'Hide' : 'Show'} advanced options
                </button>
                
                {#if showAdvanced}
                    <div class="space-y-4 pt-2">
                        <div>
                            <label for="customSlug" class="block text-sm font-medium mb-2 dark:text-zinc-300">
                                Custom Slug (optional)
                            </label>
                            <div class="flex items-center gap-2">
                                <span class="text-sm dark:text-zinc-400">www.shawty.app/</span>
                                <input
                                    id="customSlug"
                                    bind:value={customSlugInput}
                                    type="text"
                                    pattern="[a-zA-Z0-9-]{20}"
                                    placeholder="my-custom-link"
                                    disabled={isCreatingLink}
                                    class="flex-1 rounded-xl border border-gray-300 dark:bg-zinc-800 dark:border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                                />  
                            </div>
                            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">3-20 characters: letters, numbers, and hyphens only</p>
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium mb-2 dark:text-zinc-300">
                                Password Protection (optional)
                            </label>
                            <input 
                                id="password"
                                type="password" 
                                bind:value={passwordInput}
                                placeholder="Leave empty for no password"
                                disabled={isCreatingLink}
                                class="w-full rounded-xl border border-gray-300 dark:bg-zinc-800 dark:border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                            />
                            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Visitors will need this password to access the link</p>
                        </div>
                    </div>
                {/if}
                
                <p class="text-xs dark:text-zinc-400">
                    {#if showAdvanced}
                        Leave custom slug empty for a random short link
                    {:else}
                        Your short link will look like: <span class="dark:text-zinc-200">www.shawty.app/abc123</span>
                    {/if}
                </p>
            </div>
        </div>

        <!-- Success/Error Messages -->
        {#if apiMessage?.type === 'error'}
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
                ❌ {apiMessage.text}
            </div>
        {/if}

        {#if apiMessage?.type === 'success' && apiMessage.shortCode}
            <div class="bg-emerald-500/30 border border-emerald-500/40 rounded-xl p-6 text-center">
                <p class="text-lg text-emerald-600 dark:text-emerald-400 mb-3">✅ {apiMessage.text}</p>
                <a href="/{apiMessage.shortCode}" class="text-xl font-medium hover:underline">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://www.shawty.app'}/{apiMessage.shortCode}
                </a>
            </div>
        {/if}

        {#if form?.updated}
            <div class="bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/10 border dark:border-emerald-500/20 rounded-xl p-4 text-emerald-400">
                ✅ Link updated successfully!
            </div>
        {/if}

        <!-- Links Table -->
        <div class="dark:bg-zinc-900 rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Your links</h2>
            {#if data.links && data.links.length > 0}
                <div class="space-y-3">
                    {#each data.links as link}
                        <div class="flex items-center justify-between rounded-xl border border-gray-300 dark:border-zinc-800 dark:bg-zinc-800 px-4 py-3">
                            <div class="flex flex-col min-w-0 flex-1">
                                <div class="flex items-center gap-2">
                                    <a href="/{link.short_code}" class="text-sm font-medium text-blue-400 hover:underline">
                                        www.shawty.app/{link.short_code}
                                    </a>
                                    {#if link.custom_slug}
                                        <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            ✨ Custom
                                        </span>
                                    {/if}
                                    {#if link.on_leaderboard}
                                        <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                            🏆 Public
                                        </span>
                                    {/if}
                                </div>
                                
                                {#if editingId === link.id}
                                    <!-- Edit Form -->
                                    <form method="POST" action="?/update" class="flex gap-2 mt-2">
                                        <input type="hidden" name="linkId" value={link.id} />
                                        <input
                                            name="newUrl"
                                            bind:value={editUrl}
                                            placeholder="Enter new destination URL"
                                            required
                                            class="flex-1 rounded-lg bg-zinc-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        <button type="submit" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm font-medium">
                                            Save
                                        </button>
                                        <button type="button" onclick={cancelEdit} class="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-sm">
                                            Cancel
                                        </button>
                                    </form>
                                {:else}
                                    <a href={link.long_url} target="_blank" rel="noopener noreferrer" class="text-xs text-zinc-400 truncate hover:text-zinc-300">
                                        {link.long_url}
                                    </a>
                                {/if}
                            </div>
                            <div class="flex items-center gap-4 text-sm ml-4">
                                <span class="text-zinc-400 whitespace-nowrap">{link.clicks} clicks</span>
                                <button onclick={() => navigator.clipboard.writeText(`${window.location.origin}/${link.short_code}`)} class="hover:underline text-blue-400">
                                    Copy
                                </button>
                                
                                <!-- Dropdown Menu -->
                                <DropdownMenu.Root>
                                <DropdownMenu.Trigger class="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-200 dark:border-zinc-800 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors">
                                    <Ellipsis class="h-4 w-4" />
                                    <span class="sr-only">More actions</span>
                                </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="start" class="w-auto">
                                        <DropdownMenu.Label class="text-xs font-medium">
                                            Actions
                                        </DropdownMenu.Label>
                                        <DropdownMenu.Separator />
                                        
                                        <!-- View Analytics -->
                                        <a href="/dashboard/analytics/{link.id}" class="contents">
                                            <DropdownMenu.Item class="cursor-pointer">
                                                <ChartNoAxesColumn class="mr-2 h-4 w-4" />
                                                View Analytics
                                            </DropdownMenu.Item>
                                        </a>
                                        
                                        <!-- Show QR Code -->
                                        <button type="button" class="contents" onclick={() => showQr(link.id)}>
                                            <DropdownMenu.Item class="cursor-pointer">
                                                <QrCode class="mr-2 h-4 w-4" />
                                                Show QR Code
                                            </DropdownMenu.Item>
                                        </button>
                                        
                                        <!-- Edit Destination -->
                                        <button type="button" class="contents" onclick={() => startEdit(link.id, link.long_url)}>
                                            <DropdownMenu.Item class="cursor-pointer">
                                                <Pencil class="mr-2 h-4 w-4" />
                                                Edit Destination
                                            </DropdownMenu.Item>
                                        </button>
                                        
                                        <DropdownMenu.Separator />
                                        
                                        <!-- Toggle Leaderboard -->
                                        <form method="POST" action="?/toggleLeaderboard" class="contents">
                                            <input type="hidden" name="linkId" value={link.id} />
                                            <input type="hidden" name="currentStatus" value={link.on_leaderboard} />
                                            <button type="submit" class="contents">
                                                <DropdownMenu.Item class="cursor-pointer justify-between">
                                                    <div class="flex items-start">
                                                        <Trophy class="mr-2 h-4 w-4 text-yellow-400" />
                                                        <span>Show on Leaderboard</span>
                                                    </div>
                                                    <div class="relative w-10 h-5 rounded-full transition-colors {link.on_leaderboard ? 'bg-emerald-500' : 'bg-zinc-600'}">
                                                        <div class="absolute top-0.5 transition-transform duration-200 {link.on_leaderboard ? 'translate-x-5' : 'translate-x-0.5'}">
                                                            <div class="w-4 h-4 rounded-full bg-white"></div>
                                                        </div>
                                                    </div>
                                                </DropdownMenu.Item>
                                            </button>
                                        </form>
                                        
                                        <DropdownMenu.Separator />
                                        
                                        <!-- Delete -->
                                        <form method="POST" action="?/delete" class="contents">
                                            <input type="hidden" name="linkId" value={link.id} />
                                            <button
                                                type="button"
                                                class="contents"
                                                onclick={(e) => {
                                                    if (confirm(`Delete "${link.short_code}"? This cannot be undone.`)) {
                                                        const form = e.currentTarget?.parentElement;
                                                        if (form instanceof HTMLFormElement) {
                                                            form.requestSubmit();
                                                        }
                                                    }
                                                }}
                                            >
                                                <DropdownMenu.Item class="text-red-400 focus:text-red-400 cursor-pointer">
                                                    <Trash2 class="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenu.Item>
                                            </button>
                                        </form>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class="text-zinc-400 text-center py-8">No links yet. Create one above!</p>
            {/if}
        </div>
    </div>
</div>

<!-- QR Code Modal -->
{#if showQrId}
    {@const link = data.links?.find(l => l.id === showQrId)}
    {#if link}
        <div 
            role="button"
            tabindex="0"
            class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onclick={closeQr}
            onkeydown={(e) => e.key === 'Escape' && closeQr()}
        >
            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby="qr-modal-title"
                tabindex="-1"
                class="dark:bg-zinc-900 bg-zinc-200 rounded-2xl p-8 max-w-md w-full"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
            >
                <div class="flex items-center justify-between mb-6">
                    <h3 id="qr-modal-title" class="text-xl font-semibold">QR Code</h3>
                    <button 
                        onclick={closeQr}
                        aria-label="Close QR code modal"
                        class="w-8 h-8 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="bg-black p-6 rounded-xl flex items-center justify-center">
                    <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : 'https://www.shawty.app'}/${link.short_code}`)}&color=ffffff&bgcolor=000000"
                        alt="QR Code for {link.short_code}"
                        class="w-64 h-64"
                    />
                </div>
                
                <p class="text-sm text-zinc-400 mt-4 text-center">
                    Scan to visit: <span class="text-zinc-200">www.shawty.app/{link.short_code}</span>
                </p>
            </div>
        </div>
    {/if}
{/if}
