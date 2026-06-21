// Run a post-response task without blocking the HTTP reply.
//
// In the Supabase Edge runtime, EdgeRuntime.waitUntil keeps the worker alive
// until the promise settles. Outside it (local Deno tests, plain runtimes) we
// fall back to firing the promise and logging any failure — so importing a
// function module never throws on a missing EdgeRuntime global.
export function deferred(p: Promise<unknown>): void {
    // @ts-ignore EdgeRuntime is provided by the Supabase Edge runtime.
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime?.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(p)
    } else {
        p.catch((e) => console.error('deferred task failed:', e))
    }
}
