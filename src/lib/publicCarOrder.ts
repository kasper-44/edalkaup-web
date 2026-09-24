/**
 * Public inventory order: newest listing first.
 *
 * `created_at` is the listing clock. Inserts pick it up from the column
 * default (`now()`), manual creates set it explicitly, and publishing a car
 * (status → live) bumps it so a draft that just went live sorts above older
 * live cars. `last_seen_at` is only the Auto.dev sighting stamp from insert,
 * so it breaks ties inside one sync batch (those rows share one `created_at`).
 *
 * The Supabase query builder is typed as `any` here on purpose: threading it
 * through a generic makes `tsc` hit "type instantiation is excessively deep".
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function orderByNewestListing(query: any): any {
  return query
    .order('created_at', { ascending: false, nullsFirst: false })
    .order('last_seen_at', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false })
}
