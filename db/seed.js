import db from "#db/client";

import { createUser } from "#db/queries/users";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  /* ---------- 1. 20 tracks (keep your old loop) ---------- */
  for (let i = 1; i <= 20; i++) {
    await createTrack(`Track ${i}`, i * 50_000);
  }

  /* ---------- 2. 2 users ---------- */
  const [user1, user2] = await Promise.all([
    createUser("alice", "password123"),
    createUser("bob", "password456"),
  ]);

  /* ---------- 3. 2 playlists (one per user) ---------- */
  const [pl1, pl2] = await Promise.all([
    createPlaylist("Alice Mix", "Alice personal playlist", user1.id),
    createPlaylist("Bob  Hits", "Bob personal playlist", user2.id),
  ]);

  /* ---------- 4. 5 tracks per playlist ---------- */
  const trackIds = Array.from({ length: 20 }, (_, i) => i + 1); // 1..20

  await Promise.all(trackIds.slice(0, 5).map((tId) => createPlaylistTrack(pl1.id, tId)));
  await Promise.all(trackIds.slice(5, 10).map((tId) => createPlaylistTrack(pl2.id, tId)));
}
