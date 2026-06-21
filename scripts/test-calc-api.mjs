// Local test for the calc-api handler (pure engine routes + CORS). The
// units-list route needs a DB and is verified after deploy; here we cover the
// calculator routes that replace server/api/command.js.
//
// Run: deno run --allow-read --allow-env --allow-net scripts/test-calc-api.mjs

Deno.env.set('SUPABASE_URL', 'http://127.0.0.1:54321')
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'test')
Deno.env.set('SUPABASE_ANON_KEY', 'test')

const { handler } = await import('../supabase/functions/calc-api/index.ts')

let failures = 0
function check(cond, label, detail) {
    if (cond) console.log(`ok   ${label}`)
    else {
        console.error(`FAIL ${label}${detail ? '\n     ' + detail : ''}`)
        failures++
    }
}

function get(path) {
    return handler(
        new Request(`http://localhost/functions/v1/calc-api/${path}`),
    )
}

// CORS preflight
{
    const res = await handler(
        new Request('http://localhost/functions/v1/calc-api/calc', {
            method: 'OPTIONS',
        }),
    )
    check(
        res.headers.get('Access-Control-Allow-Origin') === '*',
        'OPTIONS preflight returns CORS',
        res.headers.get('Access-Control-Allow-Origin') ?? 'none',
    )
}

// calc?a=wa,ri -> outcome with the right defender
{
    const res = await get('calc?a=' + encodeURIComponent('wa, ri'))
    const j = await res.json()
    check(res.status === 200, 'GET /calc 200', String(res.status))
    check(
        j?.defender?.name === 'Rider',
        'calc outcome.defender.name',
        JSON.stringify(j?.defender),
    )
    check(
        j?.defender?.afterhp === 4,
        'calc outcome.defender.afterhp',
        String(j?.defender?.afterhp),
    )
}

// alias c?a=...
{
    const res = await get('c?a=' + encodeURIComponent('wa, ri'))
    const j = await res.json()
    check(
        j?.defender?.name === 'Rider',
        'alias /c works',
        JSON.stringify(j?.defender),
    )
}

// bulk
{
    const res = await get('bulk?a=' + encodeURIComponent('wa, de d'))
    const j = await res.json()
    check(
        typeof j?.response === 'number',
        'bulk outcome.response is a number',
        JSON.stringify(j)?.slice(0, 80),
    )
}

// unknown command -> 404
{
    const res = await get('nonsense?a=x')
    check(res.status === 404, 'unknown command -> 404', String(res.status))
}

console.log(
    failures === 0
        ? '\nALL CALC-API CHECKS PASSED'
        : `\n${failures} CHECK(S) FAILED`,
)
Deno.exit(failures === 0 ? 0 : 1)
