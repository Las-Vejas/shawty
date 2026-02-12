<script lang="ts">
  import { enhance } from '$app/forms';
  import { parseDuration } from '@internationalized/date';
  import type { ActionData } from './$types';
  import gsap from 'gsap';
  import { onMount } from 'svelte';

  let { form }: { form: ActionData } = $props();
  
  let headingRef: HTMLHeadingElement;
  
  onMount(() => {
    const finalText = "Password Protected Link";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890±!@#$%^&*()_+";
    let frame = 0;
    
    const animate = () => {
      headingRef.innerText = finalText
        .split("")
        .map((char, i) => (i < frame ? char : chars[Math.floor(Math.random() * chars.length)]))
        .join("");
      
      frame += 1/3;
      if (frame < finalText.length) requestAnimationFrame(animate);
      else headingRef.innerText = finalText;
    };
    
    animate();
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
  <div class="max-w-md w-full space-y-8">
    <div class="text-center">
      <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 bind:this={headingRef} class="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Password Protected Link</h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-zinc-400">This link requires a password to access</p>
    </div>

    <form method="POST" use:enhance class="mt-8 space-y-6">
      {#if form?.error}
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {form.error}
        </div>
      {/if}

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autofocus
          class="block w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
          placeholder="Enter password"
        />
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Access Link
      </button>
    </form>

    <p class="text-center text-xs text-gray-500 dark:text-zinc-500">
      Don't have the password? Contact the link owner.
    </p>
  </div>
</div>
