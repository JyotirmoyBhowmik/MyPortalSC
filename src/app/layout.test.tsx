import { describe, it, expect } from 'vitest';
import serialize from 'serialize-javascript';

describe('Layout JSON-LD Serialization', () => {
  it('should safely escape < characters in JSON-LD to prevent XSS', () => {
    const maliciousData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jyotirmoy Bhowmik</script><script>alert(1)</script>",
    };

    const serialized = serialize(maliciousData, { isJSON: true });

    // Check if the original unescaped malicious strings are present
    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<script>');

    // Verify that it correctly uses unicode escapes
    expect(serialized).toContain('\\u003C\\u002Fscript\\u003E\\u003Cscript\\u003E');
  });
});
