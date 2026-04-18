
https://github.com/user-attachments/assets/305be07d-7696-4c65-95c5-b936a079bb02

<div align="center">

# Speech Cabinet

Create vertical videos in the style of Disco Elysium dialogues.
<br>
[speech-cabinet.com](https://speech-cabinet.com)

</div>

<br>

`Speech Cabinet is an unofficial fan project inspired by Disco Elysium. I am not affiliated with ZA/UM. Disco Elysium© and all related characters, artwork, and audio are property of ZA/UM. These assets are used here for non-commercial, fan purposes only. The code for this app is open-source (AGPL-3.0), but Disco Elysium assets remain under their original copyright. Generated videos are likewise fan-made and not for commercial use.`

## Tips

- Put quotes when characters speak out loud, like the game does.
- Choose an OST for the right vibes.
- You won’t lose your dialogue if you close the page, but you can always download the file to share or open it later.
- Add custom characters and skills; choose portraits for Harry and custom characters.
- You can self-host via Docker; see Development > Using Docker.
- You should build Communism -- precisely \*because\* it's impossible.

<details>
<summary><h2>Development</h2></summary>

### How it works

This is a Next.js app.

Animation is made purely with CSS/JS, but the videos are rendered on server: a worker starts a browser instance and records a webpage.

### Running

1. Create a Postgres database.
2. Copy `.env.example` to `.env` and fill in the variables. (Auth settings are not used for now.)
3. If you want to enable background music for videos, save OST music files to `public/music`.
   They must have a name in form `Sea Power - Instrument of Surrender.m4a`.
4. Install dependencies:
   ```shell
   yarn
   ```
5. Run:
    ```shell
    yarn dev
    ```
6. Run the video rendering worker separately:
    ```shell
    yarn dev:work
    ```

   (The worker requires maximum Node 20 because the library for rendering videos uses a deprecated function.)

### Using Docker

Requires Docker Desktop (or any Docker Engine + Compose v2). Tested on Apple Silicon via `linux/amd64` emulation and on linux/amd64 hosts.

1. `cp .env.example .env` and fill in `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`). `DATABASE_URL` is already wired to the compose `db` service.
2. (Optional) drop `.m4a` files into `public/music/` if you want music in the rendered video. They must be named exactly as listed in `src/lib/music.ts`. Missing files are greyed out in the Music menu.
3. Build and start web + worker + postgres:
   ```shell
   DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose up -d --build
   ```
4. Open <http://localhost:3000>.
5. To tear down: `docker compose down`, or `down -v` to also wipe the DB and rendered videos.

#### Troubleshooting

- **macOS `Unable to locate package google-chrome-stable`**: the Chrome apt repo has no arm64 binary. Use `DOCKER_DEFAULT_PLATFORM=linux/amd64` as shown above to build for amd64 under Rosetta / QEMU.
- **First web request is slow**: `entrypoint.sh` runs `yarn db:push` on first boot to create the schema.
- **Render gets stuck at "Rendering..."** on a fresh install: that was issue #20. The worker tried to fetch a gitignored music track and silently 404’d. From this version on, the default is `No music` and the Music menu disables tracks whose files are not installed. If a render still finishes without music (e.g. the file was removed between selection and render), the UI tells you so.

</details>

## Contributions

Suggestions and contributions are welcome!
