import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

function getGitCommitHash(): string {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (error) {
        console.warn('Could not get git commit hash:', error);
        return 'unknown';
    }
}

export default defineConfig({
    plugins: [sveltekit()],
    define: {
        __GIT_COMMIT_HASH__: JSON.stringify(getGitCommitHash()),
        __GITHUB_REPO_URL__: JSON.stringify('shawty.app/a4eke8')
    },
    build: {
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Vendor chunks for better caching
                    if (id.includes('node_modules')) {
                        if (id.includes('@supabase')) {
                            return 'supabase';
                        }
                        if (id.includes('@vercel/analytics')) {
                            return 'analytics';
                        }
                        if (id.includes('@lucide/svelte')) {
                            return 'lucide';
                        }
                        if (id.includes('bits-ui')) {
                            return 'bits-ui';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    }
});
