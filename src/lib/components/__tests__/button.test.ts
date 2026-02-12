import { describe, it, expect } from 'vitest';
import { buttonVariants } from '../../components/ui/button/button.svelte';
import type { ButtonVariant, ButtonSize } from '../../components/ui/button/button.svelte';

describe('Button Component', () => {
	it('exports buttonVariants function', () => {
		expect(buttonVariants).toBeDefined();
		expect(typeof buttonVariants).toBe('function');
	});

	it('accepts default variant', () => {
		const classes = buttonVariants({ variant: 'default' });
		expect(classes).toContain('bg-primary');
		expect(classes).toContain('text-primary-foreground');
	});

	it('accepts secondary variant', () => {
		const classes = buttonVariants({ variant: 'secondary' });
		expect(classes).toContain('secondary');
	});

	it('accepts destructive variant', () => {
		const classes = buttonVariants({ variant: 'destructive' });
		expect(classes).toContain('destructive');
	});

	it('accepts outline variant', () => {
		const classes = buttonVariants({ variant: 'outline' });
		expect(classes).toContain('outline');
	});

	it('accepts ghost variant', () => {
		const classes = buttonVariants({ variant: 'ghost' });
		expect(classes).toContain('hover:bg-accent');
	});

	it('accepts link variant', () => {
		const classes = buttonVariants({ variant: 'link' });
		expect(classes).toContain('underline');
	});

	it('applies default size', () => {
		const classes = buttonVariants({ size: 'default' });
		expect(classes).toContain('h-9');
	});

	it('applies small size', () => {
		const classes = buttonVariants({ size: 'sm' });
		expect(classes).toContain('h-8');
	});

	it('applies large size', () => {
		const classes = buttonVariants({ size: 'lg' });
		expect(classes).toContain('h-10');
	});

	it('applies icon size', () => {
		const classes = buttonVariants({ size: 'icon' });
		expect(classes).toContain('size-9');
	});

	it('applies icon-sm size', () => {
		const classes = buttonVariants({ size: 'icon-sm' });
		expect(classes).toContain('size-8');
	});

	it('applies icon-lg size', () => {
		const classes = buttonVariants({ size: 'icon-lg' });
		expect(classes).toContain('size-10');
	});

	it('combines variant and size', () => {
		const classes = buttonVariants({ variant: 'outline', size: 'lg' });
		expect(classes).toContain('outline');
		expect(classes).toContain('h-10');
	});

	it('includes focus-visible styles', () => {
		const classes = buttonVariants({});
		expect(classes).toContain('focus-visible');
	});

	it('includes disabled styles', () => {
		const classes = buttonVariants({});
		expect(classes).toContain('disabled:');
	});

	it('includes transition styles', () => {
		const classes = buttonVariants({});
		expect(classes).toContain('transition');
	});

	it('includes proper spacing by default', () => {
		const classes = buttonVariants({ size: 'default' });
		expect(classes).toContain('px-4');
	});
});
