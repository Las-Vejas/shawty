<script>
    import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center text-center">
    <div>
        <h1 class="text-4xl">{$page.status}</h1>
        <p class="text-2xl">{$page.error?.message || 'Error'}</p>
    </div>
</div>
