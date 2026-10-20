// Names of the hidden spam-protection fields, shared by the form (browser)
// and the server checks in lib/booking/spam.ts.

/** Hidden field that people never see; bots tend to fill it in. */
export const HONEYPOT_FIELD = "website";
/** Hidden field holding when the form was shown (ms since epoch, set in the browser). */
export const STARTED_AT_FIELD = "startedAt";
