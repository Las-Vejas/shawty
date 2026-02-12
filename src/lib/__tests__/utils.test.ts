import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (classname utility)', () => {
	it('should combine a single class string', () => {
		expect(cn('px-2')).toBe('px-2');
	});

	it('should combine multiple class strings', () => {
		const result = cn('px-2', 'py-3', 'bg-blue-500');
		expect(result).toContain('px-2');
		expect(result).toContain('py-3');
		expect(result).toContain('bg-blue-500');
	});

	it('should handle objects with boolean values', () => {
		const result = cn({
			'px-2': true,
			'py-3': false,
			'bg-blue-500': true
		});
		expect(result).toContain('px-2');
		expect(result).toContain('bg-blue-500');
		expect(result).not.toContain('py-3');
	});

	it('should merge tailwind classes correctly', () => {
		const result = cn('px-2 py-1', 'px-8');
		expect(result).toBe('py-1 px-8');
	});

	it('should handle null and undefined', () => {
		const result = cn('px-2', null, undefined, 'py-3');
		expect(result).toContain('px-2');
		expect(result).toContain('py-3');
	});

	it('should handle empty strings', () => {
		const result = cn('px-2', '', 'py-3');
		expect(result).toContain('px-2');
		expect(result).toContain('py-3');
	});

	it('should handle arrays', () => {
		const result = cn(['px-2', 'py-3'], 'bg-blue-500');
		expect(result).toContain('px-2');
		expect(result).toContain('py-3');
		expect(result).toContain('bg-blue-500');
	});

	it('should handle conflicting Tailwind utility classes', () => {
		const result = cn('text-red-500 text-blue-500');
		expect(result).toBe('text-blue-500');
	});

	it('should handle responsive classes with conflicts', () => {
		const result = cn('md:px-2 md:px-8');
		expect(result).toBe('md:px-8');
	});
});
