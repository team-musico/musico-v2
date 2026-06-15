# Legacy API Migration

## Source Repositories

- `team-musico/musico-web`: Vite React client using Express and FastAPI endpoints.
- `team-musico/musico-server`: Express, MongoDB/Mongoose, JWT auth.
- `team-musico/musico-youtube-api`: FastAPI wrapper around Innertube search.

## Migration Result

The custom Express and FastAPI APIs are now implemented as Next.js Route Handlers.
MongoDB user, queue, and playlist state is migrated to Supabase tables.

## Route Mapping

| Legacy API | New Route Handler | Notes |
| --- | --- | --- |
| `GET /songs/chart` | `GET /api/songs/chart` | VIBE chart proxy |
| `GET /songs/search?q=` | `GET /api/songs/search?q=` | VIBE search proxy |
| `GET /songs/new-songs` | `GET /api/songs/new-songs` | VIBE recent tracks proxy |
| `POST /` on FastAPI | `POST /api/youtube` | Returns top 3 video IDs |
| `POST /auth/signup` | `POST /api/auth/signup` | Stores user in Supabase |
| `POST /auth/login` | `POST /api/auth/login` | Returns legacy `accessToken`, `refreshToken` |
| `POST /auth/refresh` | `POST /api/auth/refresh` | Rotates refresh token |
| `GET /auth/me` | `GET /api/auth/me` | Bearer token required |
| `GET /playlist` | `GET /api/playlist` | Bearer token required |
| `GET /playlist/my?playlistId=` | `GET /api/playlist/my?playlistId=` | Compatibility alias |
| `POST /playlist` | `POST /api/playlist` | Create playlist |
| `PATCH /playlist?playlistId=` | `PATCH /api/playlist?playlistId=` | Rename playlist |
| `DELETE /playlist?playlistId=` | `DELETE /api/playlist?playlistId=` | Delete playlist |
| `POST /playlist/song?playlistId=` | `POST /api/playlist/song?playlistId=` | Add song |
| `DELETE /playlist/song?playlistId=&trackId=` | `DELETE /api/playlist/song?playlistId=&trackId=` | Remove song |
| `POST /queue` | `POST /api/queue` | Add and play song |
| `DELETE /queue?trackId=` | `DELETE /api/queue?trackId=` | Remove song |
| `POST /queue/add` | `POST /api/queue/add` | Add song to end |
| `POST /queue/copy?playlistId=` | `POST /api/queue/copy?playlistId=` | Copy playlist to queue |
| `GET /play/next` | `GET /api/play/next` | Move current index |
| `GET /play/previous` | `GET /api/play/previous` | Move current index |
| `PATCH /play/update-shuffle` | `PATCH /api/play/update-shuffle` | Toggle shuffle |

The new app should call the `/api/*` routes directly. Legacy path rewrites were intentionally not kept in this project.

## Supabase Schema

Run `supabase/migrations/0001_musico_legacy_api.sql` in Supabase.

The schema intentionally keeps queue and playlist songs as `jsonb` because the legacy Mongo models stored embedded song objects:

- `musico_users.queue`
- `musico_users.original_queue`
- `musico_playlists.songs`

This keeps the old client data contract stable while moving persistence to Supabase.

## Environment Variables

Required for server APIs:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
BETTER_AUTH_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-only. Do not expose it to client components.
