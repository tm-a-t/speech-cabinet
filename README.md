# Speech Cabinet

<img alt="Dialogue example" src="readme-assets/february.gif" width="240" align="right">

_DOLORES DEI – Every combination of words has been played out. The atoms don't form us anymore: us, our love, our unborn daughters._

Create vertical videos in the style of Disco Elysium dialogues.

[speech-cabinet.com](https://speech-cabinet.com)


<br><br><br><br><br><br><br><br>



## Features

I aimed to make an intuitive UI, so when you are looking for a feature you will probably find it.
If you want to read what the app is capable of, check out the [Reddit post.](https://www.reddit.com/r/DiscoElysium/comments/1fs5gsk/i_made_a_site_that_animates_disco_elysium/)

## Development

### How the app works

This is a Next.js app.

Animation is made purely with CSS/JS, but the videos are rendered on server: a worker starts a browser instance and records a webpage.

### Running

1. Create a Postgres database.
2. Copy `.env.example` to `.env` and fill in the variables. (Auth settings are not used for now.)
3. If you want to enable background music for videos, save OST music files to `public/music`.
   They must have a name in form `Sea Power - Instrument of Surrender.m4a`.
   I don’t include the music in the repo to avoid copyright issues.
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

   (The worker requires maximum Node 20 because the library for rendering videos use a deprecated function.)

### Run with Docker

The Docker image should build normally&mdash;but not on macOS, apparently?
Downloading Chrome in Docker doesn’t work on my macOS for some reason.

## Contributions

Suggestions and contributions are welcome!
