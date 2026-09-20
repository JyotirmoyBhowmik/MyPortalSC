const fs = require('fs');

const content = fs.readFileSync('scripts/enrich_fy25.sql', 'utf8');

// We want to split the queries into 4 parts:
// Part 1: Reset initiatives image_url and Projects 1 to 5
// Part 2: Projects 6 to 10
// Part 3: Initiatives 89 to 108
// Part 4: Earlier initiatives defaults & KPI updates

const p1_5_end = content.indexOf("WHERE slug = 'enterprise-ai-copilot-manufacturing-25';") + "WHERE slug = 'enterprise-ai-copilot-manufacturing-25';".length;
const p6_10_end = content.indexOf("-- 3. Enrich 20 FY 2025-26 Initiatives");
const inits_end = content.indexOf("-- 4. Contextual defaults for earlier initiatives");

fs.writeFileSync('scripts/part1.sql', content.slice(0, p1_5_end).trim());
fs.writeFileSync('scripts/part2.sql', content.slice(p1_5_end, p6_10_end).trim());
fs.writeFileSync('scripts/part3.sql', content.slice(p6_10_end, inits_end).trim());
fs.writeFileSync('scripts/part4.sql', content.slice(inits_end).trim());

console.log('Successfully created part1.sql, part2.sql, part3.sql, part4.sql');
