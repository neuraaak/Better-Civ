import { describe, expect, it } from 'vitest';
import { cleanName, searchKey } from '@/utils/civName';

describe('civName', () => {
    it('keeps the singular form of API names', () => {
        expect(cleanName('Minuteman|Minutemen')).toBe('Minuteman');
        expect(cleanName('Rome')).toBe('Rome');
        expect(cleanName(undefined)).toBe('');
    });

    it('builds accent- and case-insensitive search keys', () => {
        expect(searchKey(' Égypte|Égyptiens ')).toBe('egypte');
        expect(searchKey('ÁRABIA')).toBe('arabia');
    });
});
