> Every combination of words has been played out. The atoms don't form us anymore: us, our love, our unborn daughters.

# Speech Cabinet

Build your dialogues and animate them in the style of Disco Elysium.

Site: https://speech-cabinet.com

Announcement: [Reddit post](https://www.reddit.com/r/DiscoElysium/comments/1fs5gsk/i_made_a_site_that_animates_disco_elysium/)


<img alt="Dialogue example" src="readme-assets/february.gif" width="240">

## Development

### How the app works

The dialogue is simply a CSS/JS animation, so the "Play" button
shows the actual animation. 
To generate a video, the server worker starts the browser on server
and records the page.

### Run with Docker

The Docker image should build normally&mdash;but not on macOS, apparently? 
I didn't manage to set up the Dockerfile so that downloading Chrome works on my macOS.

### Run without Docker

1. Create a Postgres database.
2. Copy `.env.example` to `.env` and fill in the variables. (Auth settings are not used for now.)
3. Run:
    ```shell
    yarn dev
    ```
4. Run the worker separately:
    ```shell
    yarn dev:work
    ```