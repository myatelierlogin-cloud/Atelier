// Firebase migration utility — no longer applicable after moving to Cloudflare D1.
// Data migration is handled via schema.sql applied to D1.
export async function migrateLegacySpaces() {
  console.log("Migration not required — using Cloudflare D1.");
}
