<script lang="ts">
	export let data;
</script>

<h1>Shawty</h1>
<p>Short links for Hack Club members.</p>

{#if data?.user}
	<div style="background: #4CAF50; color: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
		<h2 style="margin: 0;">✅ You're logged in as {data.user.email}!</h2>
		<a href="/dashboard" style="color: white; font-size: 1.2em; text-decoration: underline;">Go to Dashboard →</a>
	</div>
{:else}
	<a href="/login">
		<button style="padding: 15px 30px; font-size: 1.2em; background: #2196F3; color: white; border: none; cursor: pointer; border-radius: 5px;">
			Log in with Hack Club
		</button>
	</a>
{/if}
