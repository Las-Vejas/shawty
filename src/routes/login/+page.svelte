<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
  <div class="max-w-md w-full space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold dark:text-white">Welcome to Shawty</h1>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">Sign in to manage your short links</p>
    </div>

    <div class="flex flex-col gap-4">
      <a href="/auth/login">
        <Button class="w-full" variant="default">
          <svg class="w-5 h-5 mr-2" viewBox="0 0 96 161" fill="currentColor">
            <path d="M35.103 2.00043C35.103 0.762133 33.989 -0.178566 32.769 0.0287345L1.6652 5.30994C0.703599 5.47314 0 6.30633 0 7.28163V158.717C0 159.821 0.8954 160.717 2 160.717H33.103C34.208 160.717 35.103 159.821 35.103 158.717V102.029C35.103 84.7592 44.261 74.0612 51.892 74.0612C58.76 74.0612 60.744 80.9392 60.744 91.3312V158.717C60.744 159.821 61.639 160.717 62.744 160.717H94C95.105 160.717 96 159.821 96 158.717V86.2882C96 62.7522 87.148 47.6214 64.102 47.6214C54.852 47.6214 45.825 49.8485 38.633 54.7782C37.205 55.7572 35.103 54.7932 35.103 53.0606V2.00043Z"/>
          </svg>
          Continue with Hack Club
        </Button>
      </a>

      <a href="/auth/github">
        <Button class="w-full" variant="outline">
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </Button>
      </a>
    </div>

    <p class="text-center text-xs text-zinc-500 dark:text-zinc-400">
      By signing in, you agree to our Terms of Service
    </p>
  </div>
</div>