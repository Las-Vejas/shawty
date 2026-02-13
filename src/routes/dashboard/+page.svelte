<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import type { Link } from '$lib/database';
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Button from "$lib/components/ui/button/button.svelte";
    import { invalidateAll } from '$app/navigation';
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
    
    // Track delete confirmation modal
    let deleteModal = $state<{ linkId: string; shortCode: string } | null>(null);
    
    // Show advanced options
    let showAdvanced = $state<boolean>(false);
    
    function getQrUrl(linkId: string): string {
        const link = data.links?.find(l => l.id === linkId);
        if (link) {
            const qrData = `https://shawty.app/${link.short_code}`;
            return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&color=000000&bgcolor=ffffff`;
        }
        return '';
    }
    
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
    
    function openDeleteModal(linkId: string, shortCode: string) {
        deleteModal = { linkId, shortCode };
    }
    
    function closeDeleteModal() {
        deleteModal = null;
    }
    
    async function confirmDelete() {
        if (deleteModal) {
            try {
                const response = await fetch('?/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ linkId: deleteModal.linkId }).toString()
                });
                
                if (response.ok) {
                    await invalidateAll();
                } else {
                    apiMessage = { type: 'error', text: 'Failed to delete link' };
                }
            } catch (error) {
                console.error('Delete error:', error);
                apiMessage = { type: 'error', text: 'An error occurred while deleting' };
            }
            closeDeleteModal();
        }
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
                await invalidateAll();
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

    // Calculate stats
    const stats = $derived.by(() => {
        const links = data.links || [];
        const totalLinks = links.length;
        const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
        const topLink = links.reduce((max, link) => 
            (link.clicks || 0) > (max?.clicks || 0) ? link : max
        , null as Link | null);
        return { totalLinks, totalClicks, topLink };
    });
</script>

<section class="max-w-6xl mx-auto px-6 py-10 space-y-8">
  <!-- Header -->
  <header class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
        Manage and track all your shortened links in one place.
      </p>
    </div>

    <div class="flex gap-3">
      <Button variant="outline" href="/leaderboard">
        Leaderboard
      </Button>
    </div>
  </header>

  <!-- Shorten Card -->
  <section class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background/60 shadow-sm p-6 space-y-3">
    <h2 class="text-lg font-semibold">Shorten a link</h2>
    <div class="space-y-3">
      <div class="flex gap-3">
        <input
          bind:value={urlInput}
          placeholder="example.com or https://example.com"
          required
          disabled={isCreatingLink}
          class="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <Button type="button" onclick={handleCreateLink} variant="default" class="px-6 rounded-lg font-medium h-11" disabled={isCreatingLink}>
          {isCreatingLink ? 'Creating...' : 'Shorten'}
        </Button>
      </div>
      
      <!-- Advanced Options Toggle -->
      <button 
        type="button"
        onclick={() => showAdvanced = !showAdvanced}
        disabled={isCreatingLink}
        class="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white flex items-center gap-2 disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform {showAdvanced ? 'rotate-180' : ''}">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        {showAdvanced ? 'Hide' : 'Show'} advanced options
      </button>
      
      {#if showAdvanced}
        <div class="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <label for="customSlug" class="block text-sm font-medium mb-2 dark:text-zinc-300">
              Custom Slug (optional)
            </label>
            <div class="flex items-center gap-2">
              <span class="text-sm dark:text-zinc-400">shawty.app/</span>
              <input
                id="customSlug"
                bind:value={customSlugInput}
                type="text"
                placeholder="my-custom-link"
                class="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />  
            </div>
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
              class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Visitors will need this password to access the link</p>
          </div>
        </div>
      {/if}

      <!-- Messages -->
      {#if apiMessage}
        <div class="rounded-lg p-4 text-sm {apiMessage.type === 'success' 
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
          : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'}">
          {#if apiMessage.type === 'success'}
            ✅ {apiMessage.text} 
            {#if apiMessage.shortCode}
              <code class="font-mono ml-1">shawty.app/{apiMessage.shortCode}</code>
            {/if}
          {:else}
            ❌ {apiMessage.text}
          {/if}
        </div>
      {/if}
    </div>
  </section>

  <!-- Stats row -->
  <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background/60 p-4 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Total links
      </p>
      <p class="mt-2 text-2xl font-semibold">
        {stats.totalLinks}
      </p>
      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {#if stats.totalLinks === 0}
          Create your first link above
        {:else}
          Links created and ready to share
        {/if}
      </p>
    </div>

    <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background/60 p-4 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Total clicks
      </p>
      <p class="mt-2 text-2xl font-semibold">
        {stats.totalClicks.toLocaleString()}
      </p>
      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {#if stats.totalClicks === 0}
          Track clicks as people use your links
        {:else}
          Across all your links
        {/if}
      </p>
    </div>

    <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background/60 p-4 shadow-sm">
      <p class="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Most popular link
      </p>
      <p class="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
        {#if stats.topLink}
          <a href={"https://shawty.app/" + stats.topLink.short_code} target="_blank" rel="noreferrer">
            shawty.app/{stats.topLink.short_code}
          </a>
        {:else}
          —
        {/if}
      </p>
      <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {#if stats.topLink}
          {stats.topLink.clicks} {stats.topLink.clicks === 1 ? 'click' : 'clicks'}
        {:else}
          Your top link will appear once you get traffic
        {/if}
      </p>
    </div>
  </section>

  <!-- Links Heading -->
  <div>
    <h2 class="text-2xl font-semibold tracking-tight">Your links</h2>
    <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
      Create, edit, and manage your shortened links
    </p>
  </div>

  <!-- Links table / list -->
  <section class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background/60 shadow-sm overflow-hidden">
    {#if data.links && data.links.length === 0}
      <!-- Empty state -->
      <div class="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p class="mb-3 font-medium text-zinc-800 dark:text-zinc-100">
          You don't have any links yet.
        </p>
        <p class="mb-6 text-xs">
          Create one using the form above to get started.
        </p>
      </div>
    {:else}
      <!-- List of links -->
      <div class="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
        {#each data.links as link}
          <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex-1 space-y-1 min-w-0">
              <div class="flex items-center gap-2">
                <a
                  class="font-medium text-zinc-900 dark:text-zinc-50 hover:text-primary dark:hover:text-primary transition-colors"
                  href={"https://shawty.app/" + link.short_code}
                  target="_blank"
                  rel="noreferrer"
                >
                  shawty.app/{link.short_code}
                </a>
                {#if link.custom_slug}
                  <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    ✨ Custom
                  </span>
                {/if}
                {#if link.on_leaderboard}
                    <span class="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        🏆 On leaderboard
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
                <p class="text-xs text-zinc-500 dark:text-zinc-400 break-all">
                  {link.long_url}
                </p>
              {/if}
            </div>

            <div class="flex items-center gap-3 sm:flex-none sm:justify-end">
              <div class="flex flex-col items-end gap-0.5">
                <span class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {link.clicks ?? 0} {(link.clicks ?? 0) === 1 ? 'click' : 'clicks'}
                </span>
                <span class="text-[11px] text-zinc-400">
                  {new Date(link.created_at).toLocaleDateString()}
                </span>
              </div>

              <Button variant="outline" size="sm" href={"https://shawty.app/" + link.short_code} target="_blank">
                Open
              </Button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger class="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-200 dark:border-zinc-800 dark:bg-zinc-700/50 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors">
                  <Ellipsis class="h-4 w-4" />
                  <span class="sr-only">More actions</span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end" class="w-48">
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
                        <div class="flex items-center">
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
                  <form method="POST" action="?/delete" class="contents" data-delete-link-id={link.id}>
                    <input type="hidden" name="linkId" value={link.id} />
                    <button
                      type="button"
                      class="contents"
                      onclick={() => openDeleteModal(link.id, link.short_code)}
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
    {/if}
  </section>
</section>

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
                
                <div class="bg-white p-6 rounded-xl flex items-center justify-center">
                    <img 
                        src={getQrUrl(link.id)}
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

<!-- Delete Confirmation Modal -->
{#if deleteModal}
    <div 
        role="button"
        tabindex="0"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onclick={closeDeleteModal}
        onkeydown={(e) => e.key === 'Escape' && closeDeleteModal()}
    >
        <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            tabindex="-1"
            class="dark:bg-zinc-900 bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
        >
            <h3 id="delete-modal-title" class="text-xl font-semibold mb-2">Delete link?</h3>
            <p class="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Are you sure you want to delete <span class="font-mono font-medium text-zinc-900 dark:text-zinc-100">shawty.app/{deleteModal.shortCode}</span>? This cannot be undone.
            </p>
            
            <div class="flex gap-3 justify-end">
                <button
                    type="button"
                    onclick={closeDeleteModal}
                    class="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onclick={confirmDelete}
                    class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}
