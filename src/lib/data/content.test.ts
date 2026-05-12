import { describe, it, expect } from 'vitest';
import { getContentData, getContentField } from './content';
import type { Json } from '@/lib/database.types';

describe('content helpers', () => {
    describe('getContentData', () => {
        it('should return the field value when it exists and content is a valid object', () => {
            const content = { title: 'Test Title', count: 42, isPublished: true } as Json;
            expect(getContentData(content, 'title')).toBe('Test Title');
            expect(getContentData(content, 'count')).toBe(42);
            expect(getContentData(content, 'isPublished')).toBe(true);
        });

        it('should return undefined when the field exists but its value is undefined', () => {
            // By JSON definition it shouldn't really have undefined, but testing the record typing
            const content = { title: undefined };
            expect(getContentData(content as Record<string, unknown>, 'title')).toBeUndefined();
        });

        it('should return null when the field exists but its value is null', () => {
            const content = { title: null } as Json;
            expect(getContentData(content, 'title')).toBeNull();
        });

        it('should return null when the field does not exist', () => {
            const content = { title: 'Test Title' } as Json;
            expect(getContentData(content, 'missing_field')).toBeNull();
        });

        it('should return null when content is null or undefined', () => {
            expect(getContentData(null, 'title')).toBeNull();
            expect(getContentData(undefined, 'title')).toBeNull();
        });

        it('should return null when content is an array', () => {
            const content = [{ title: 'Test Title' }] as unknown as Json;
            expect(getContentData(content, 'title')).toBeNull();
        });

        it('should return null when content is a primitive', () => {
            expect(getContentData('string value' as Json, 'title')).toBeNull();
            expect(getContentData(42 as Json, 'title')).toBeNull();
            expect(getContentData(true as Json, 'title')).toBeNull();
        });
    });

    describe('getContentField', () => {
        it('should return the string value when the field exists and is a string', () => {
            const content = { title: 'Test Title' } as Json;
            expect(getContentField(content, 'title')).toBe('Test Title');
        });

        it('should return an empty string when the field exists but is not a string', () => {
            const content = { count: 42, isPublished: true, nested: {} } as Json;
            expect(getContentField(content, 'count')).toBe('');
            expect(getContentField(content, 'isPublished')).toBe('');
            expect(getContentField(content, 'nested')).toBe('');
        });

        it('should return an empty string when the field does not exist', () => {
            const content = { title: 'Test Title' } as Json;
            expect(getContentField(content, 'missing_field')).toBe('');
        });

        it('should return an empty string when content is null or undefined', () => {
            expect(getContentField(null, 'title')).toBe('');
            expect(getContentField(undefined, 'title')).toBe('');
        });

        it('should return an empty string when content is an array', () => {
            const content = [{ title: 'Test Title' }] as unknown as Json;
            expect(getContentField(content, 'title')).toBe('');
        });

        it('should return an empty string when content is a primitive', () => {
            expect(getContentField('string value' as Json, 'title')).toBe('');
            expect(getContentField(42 as Json, 'title')).toBe('');
            expect(getContentField(true as Json, 'title')).toBe('');
        });
    });
});
