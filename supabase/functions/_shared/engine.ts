// Single import surface for the pure combat engine. The engine lives at the
// repo root in engine/ as plain ESM .js (shared with the Jest test suite);
// Deno imports it directly with explicit extensions.
//
// Each command's `execute(message, argsStr, replyData, dbData[, targetStr])`
// returns the mutated replyData. We pass `{}` for `message` (the engine
// commands ignore it — it was the discord.js Message in the old bot).

export * as calc from '../../../engine/commands/calc.js'
export * as optim from '../../../engine/commands/optim.js'
export * as bulk from '../../../engine/commands/bulk.js'
export * as elim from '../../../engine/commands/elim.js'
export * as units from '../../../engine/commands/units.js'

export function makeReplyData() {
    return {
        content: [] as [string, unknown][],
        deleteContent: false,
        discord: {
            title: undefined as string | undefined,
            description: undefined as string | undefined,
            fields: [] as { name: string; value: string | string[] }[],
            footer: undefined as string | undefined,
        },
        outcome: {
            attackers: [] as unknown[],
            defender: {} as Record<string, unknown>,
        },
    }
}
