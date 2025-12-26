<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div style="background: #4CAF50; color: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; text-align: center;">
	<h1 style="margin: 0; font-size: 2em;">🎉 You're logged in!</h1>
	<p style="margin: 10px 0 0 0;">Welcome to your dashboard</p>
</div>

<h2>Create a short link</h2>

<form method="POST">
	<input name="url" placeholder="https://example.com" required style="padding: 10px; width: 300px; margin-right: 10px;" />
	<button style="padding: 10px 20px; background: #2196F3; color: white; border: none; cursor: pointer;">Create</button>
</form>

{#if form?.error}
	<p style="color: red; margin-top: 10px;">{form.error}</p>
{/if}

{#if form?.success && form?.shortCode}
	<div style="background: #4CAF50; color: white; padding: 15px; margin-top: 10px; border-radius: 5px;">
		✅ Short link created: <strong><a href="/{form.shortCode}" style="color: white;">{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/{form.shortCode}</a></strong>
	</div>
{/if}

<hr style="margin: 30px 0;" />

<h2>Your links</h2>

{#if data.links && data.links.length > 0}
	<ul>
		{#each data.links as link}
			<li>
				<strong>/{link.short_code}</strong> → {link.long_url} 
				<small>({link.clicks} clicks)</small>
			</li>
		{/each}
	</ul>
{:else}
	<p>No links yet. Create one above!</p>
{/if}

<style>
	ul {
		list-style: none;
		padding: 0;
	}
	
	li {
		padding: 0.5rem;
		border-bottom: 1px solid #eee;
	}
</style>
