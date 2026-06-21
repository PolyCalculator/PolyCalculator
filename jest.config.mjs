// Native-ESM Jest config. The engine/ and tests/ subtrees are ESM
// (each has its own package.json with "type": "module"); the repo root stays
// CommonJS. Run with NODE_OPTIONS=--experimental-vm-modules (see package.json
// "test" script) so Jest loads the engine and tests as real ES modules — no
// Babel, no transform, single source shared with the Deno Edge Functions.
export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['<rootDir>/tests/**/*.test.js'],
}
