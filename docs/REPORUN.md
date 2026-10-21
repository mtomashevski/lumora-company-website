# RepoRun deployment — original university website

This deployment builds the university React/Vite SPA in `src/`.
No database, CMS, booking backend or payment service is needed.

## What runs

The multi-stage Dockerfile uses Node 24 and the project's pinned pnpm 11.25.0 to
install the lockfile and run the existing `pnpm build`. The final image contains
only the static `dist/` output and unprivileged Nginx. Nginx listens on **8080**,
uses one worker, and has an HTTP `/healthz` check. Node and development tools are
not part of the runtime image. Base images track Node 24 and stable Alpine Nginx;
lock their tested image digests if the assessment requires immutable image builds.

`docker-compose.yml` has one service, `web`, with **0.50 CPU / 128 MiB RAM** runtime
limits. Image-building resource needs are separate and controlled by RepoRun.
There are no host port mappings, environment files, labels, restart policies,
custom networks, privileged containers, socket mounts or host volumes.

`stack.yml` exposes `web:8080` through RepoRun's primary `app` ingress. Its access
policy is **`cas`**, following the professor's supplied example. Visitors must
use RepoRun's CAS access flow. Confirm that the professor's assessment account
has access; do not replace the access policy with an invented public-policy value.

## Routing and existing GitHub Pages deployment

Docker builds explicitly use `VITE_BASE_PATH=/`. Both the router and all public
assets already use this base-aware configuration. The existing build generates
HTML for Home, Experiences, all five tour pages, Destinations, About, Contact and
Privacy. Nginx serves those indexes on direct navigation/refresh. Unknown routes
serve the existing branded `404.html` with HTTP 404; client navigation still uses
the existing React Router not-found component. Existing EN/MK switching,
localStorage preference, form behavior and external links are unchanged.

The GitHub Pages workflow and default build base `/lumora-company-website/` are
unchanged. An explicitly blank `VITE_SITE_URL` now means “origin not configured”,
instead of falling back to GitHub Pages. An absent variable still preserves the
existing Pages default; its workflow supplies the actual Pages origin explicitly.
RepoRun's image initially omits canonical/absolute OG URLs and sitemap generation
because its actual endpoint is unknown. Existing public robots instructions remain.

RepoRun does not support Compose `build.args`. The Dockerfile directly sets
`VITE_BASE_PATH=/` and `VITE_SITE_URL=""`, so no Compose build arguments are needed.
After RepoRun provides the real public HTTP(S) origin, optionally update
`ENV VITE_SITE_URL=""` in the Dockerfile to that public origin and rebuild. Use an
origin only, with no path, credentials or trailing slash. Never put secrets in
public Vite configuration. This configuration assumes RepoRun gives the app its own
origin/root path. If it uses a subdirectory prefix, obtain the exact prefix first;
the Docker base path and Nginx routing must then be adapted together.

## Validation with Docker available

From this repository's root:

```sh
docker compose -f docker-compose.yml config --quiet
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml run --rm --no-deps web nginx -t
docker compose -f docker-compose.yml up -d
docker compose -f docker-compose.yml exec -T web wget -q -O - http://127.0.0.1:8080/healthz
docker compose -f docker-compose.yml down
```

No host port is published by Compose. For local browser testing only, use
`docker build -t lumora-university-reporun .` and
`docker run --rm -p 127.0.0.1:8080:8080 lumora-university-reporun`, then open
`http://127.0.0.1:8080/`. That optional local-only command is not part of RepoRun
configuration; never add `ports` to the deployment Compose file.

Local application checks are `pnpm typecheck`, `pnpm lint` and `pnpm build`.
To reproduce the RepoRun build outside Docker, set `VITE_BASE_PATH=/` and
`VITE_SITE_URL` to an explicit empty string in the process environment before
running the build. Rebuild without those overrides to restore the Pages output.
`dist/` is generated and must not be committed.

## Manual RepoRun steps

1. Review these changes, then separately approve committing/pushing them. No commit,
   push or deployment is performed by this setup task. The current checkout may
   be a development branch; select the approved branch/ref deliberately.
2. Use the repository's Git-over-SSH URL:
   `git@github.com:mtomashevski/lumora-company-website.git`.
3. Configure RepoRun's repository path as the **repository root**, where both
   `docker-compose.yml` and `stack.yml` reside. Use the actual platform UI/path
   convention rather than assuming whether its root value is `.` or `/`.
4. If RepoRun cannot read the repository, add its generated **public** SSH deploy
   key to GitHub Repository Settings → Deploy keys, with **Allow write access off**.
   Keep the private key on RepoRun; never paste it into chat or commit it.
5. Confirm CAS access with the professor, then trigger the approved deployment.
6. Verify the assigned endpoint, every route/refresh, all five experiences,
   EN/MK persistence, mobile menu, form, logo/images, Instagram/GetYourGuide links,
   and unknown-route 404. Configure the real origin only after it is supplied.

Actual RepoRun execution, SSH access, CAS authentication and container runtime
validation require the professor's platform or a working Docker installation.
Do not claim these passed based solely on a local Vite build.

## Security and privacy

The runtime explicitly uses UID/GID `101:101`. Served files are read-only and
directory listing is disabled. Only compiled assets enter the served directory;
Nginx additionally denies dotfiles, private-key/backup/source-map extensions and
source/configuration paths. `/healthz` contains no application or personal data.

`scripts/security-headers.mjs` generates the Nginx header include during the Docker
build. It hashes the build's inline JSON-LD rather than allowing arbitrary inline
JavaScript. CSP allows local assets, local connections and image-cropping style
attributes. It blocks framing and object embeds; `nosniff`, a referrer policy and
`X-Frame-Options: DENY` also apply to cached assets, HTML, health and error responses.
An external inquiry endpoint or new embeds require reviewing this policy first.
The browser audit simulates these headers; it does not replace `nginx -t` and
actual HTTP header tests in the container. GitHub Pages does not use this Nginx
configuration and cannot be assumed to have these custom headers.

RepoRun handles ingress, HTTPS certificates and CAS authentication. Confirm HTTPS
and the university's authentication/logging/privacy policy with the operator.
No HSTS is assumed before the actual HTTPS endpoint is known. A framing restriction
means the application is opened directly, not embedded in the university portal.
The application has no HTTP cookies or optional tracking. Its persistent browser
values are the privacy preference record and, when enabled, the EN/MK language
preference, both in localStorage. Footer Cookie Settings reopens preferences.
Inquiry details stay in memory until the visitor copies
and sends them externally. CAS cookies belong to the university's access layer.

Before deployment, check `id`, `/healthz`, generated-route refreshes, custom 404,
headers on HTML/assets/errors, blocked sensitive paths and memory use under the
128 MiB limit in the real runtime. Container capability restrictions and any
read-only-root-filesystem policy are platform decisions; the current Compose file
does not assume unsupported RepoRun properties.
