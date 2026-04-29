# PolyCalculator

Discord bot and CLI calculator for The Battle of Polytopia combat.

## Commands

- `.c` (calc) — fixed-order combat calculation. Attackers fight in the order given.
- `.o` (optim) — optimizer. Tries all attacker permutations to find the best sequence.
- `.b` (bulk) — how many hits of one unit to kill another.
- `.e` (elim) — minimum attacker HP to kill, or max defender HP that dies.

## Architecture

- `bot/util/sequencer.js` — core `multicombat()` loop. Runs combat for each attacker in sequence, applies effects (poison, freeze, convert), then **resets defender state** so the next sequence evaluation starts clean.
- `bot/util/fightEngine.js` — `calc()` (single sequence) and `optim()` (all permutations). After finding the best solution, re-applies effects (poison, freeze) to the defender for display.
- `bot/util/util.js` — effect functions: `poison()`, `freeze()`, `convert()`, `boost()`. Each uses a guard flag (`poisoned`, `frozen`, `converted`) to prevent duplicate application within a single sequence.
- `bot/unit/unit.js` — unit factory with stats, modifiers, and methods.

## Testing changes

When modifying combat logic (sequencer, fightEngine, util), always verify against **both** `.c` and `.o` paths:

- `.c` calls `multicombat()` once with a fixed sequence
- `.o` calls `multicombat()` many times across all permutations with the same defender object — state leaks between calls will cause bugs (duplicate labels, wrong retaliation, corrupted bonuses)

Run the full test suite: `npm test`

Snapshot tests in `bot/tests/simpleCalc/` cover all unit matchups at every HP via `.c`.
Integration tests in `bot/tests/optim.test.js` cover `.o` scenarios.

To run locally: `npm run bot` (requires `.env` with bot token).

## Key invariant

In `multicombat()`, any defender state mutated during the attacker loop **must** be saved before the loop and restored after it. Currently saved/restored: `bonus`, `poisoned`, `retaliation`, `frozen`, `description`.
