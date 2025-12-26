<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-zinc-100">
	<!-- Navigation Bar -->
	<nav class="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
		<div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
			<a href="/" class="text-2xl font-bold tracking-tight hover:text-zinc-300 transition-colors">
				shawty
			</a>
			<div class="flex items-center gap-4">
				{#if data?.user}
					<a href="/dashboard" class="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition-colors">
						Dashboard
					</a>
					<a href="/auth/logout" class="px-4 py-2 rounded-lg bg-red-800/50 border-red-700 hover:border-red-600 hover:bg-red-700/50 text-sm transition-colors">
						Logout
					</a>
				{:else}
					<a href="/login" class="px-4 py-2 rounded-lg bg-white text-zinc-900 hover:bg-zinc-200 text-sm font-medium transition-colors">
						Log in
					</a>
				{/if}
			</div>
		</div>
	</nav>

	<!-- Page Content -->
	{@render children()}
</div>
