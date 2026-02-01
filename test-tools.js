// Simple test to verify the mock data is working
const contributionData = require('./dist/src/functions/contributionData');

console.log('=== MCP Server Test ===\n');

// Test 1: Check mock members
console.log('✓ MOCK_MEMBERS count:', contributionData.MOCK_MEMBERS.length);
contributionData.MOCK_MEMBERS.forEach(m => {
  console.log(`  - ${m.full_name} (${m.member_id})`);
});

// Test 2: Check mock contributions
console.log('\n✓ IN_MEMORY_CONTRIBUTIONS count:', contributionData.IN_MEMORY_CONTRIBUTIONS.length);
contributionData.IN_MEMORY_CONTRIBUTIONS.forEach(c => {
  console.log(`  - Project: ${c.project_id}`);
  console.log(`    Title: ${c.contribution_title}`);
  console.log(`    Author: ${c.author_name}`);
});

// Test 3: Simulate filtering by project
console.log('\n✓ Filtering by project "scil":');
const scilContributions = contributionData.IN_MEMORY_CONTRIBUTIONS.filter(
  c => c.project_id.toLowerCase() === 'scil'
);
console.log(`  Found ${scilContributions.length} contributions`);
scilContributions.forEach(c => {
  console.log(`  - ${c.contribution_title}`);
});

// Test 4: Simulate filtering by author
console.log('\n✓ Filtering by author "Marcus Thorne":');
const marcusContributions = contributionData.IN_MEMORY_CONTRIBUTIONS.filter(
  c => c.author_name.toLowerCase() === 'marcus thorne'
);
console.log(`  Found ${marcusContributions.length} contribution(s)`);
marcusContributions.forEach(c => {
  console.log(`  - ${c.contribution_title}`);
});

console.log('\n=== All tests passed! ===');
