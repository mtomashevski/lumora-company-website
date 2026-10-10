# Build the university React/Vite SPA.
FROM node:24-alpine AS build
WORKDIR /app
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public
COPY scripts/generate-seo.mjs ./scripts/generate-seo.mjs
COPY scripts/security-headers.mjs ./scripts/security-headers.mjs
# RepoRun supplies an endpoint, not a GitHub Pages subdirectory.
# A blank origin deliberately omits canonical URLs until the real endpoint is known.
ARG VITE_SITE_URL=""
ENV VITE_BASE_PATH=/
ENV VITE_SITE_URL=${VITE_SITE_URL}
RUN pnpm build && node scripts/security-headers.mjs /app/security-headers.conf

FROM nginxinc/nginx-unprivileged:stable-alpine AS runtime
COPY docker/nginx-main.conf /etc/nginx/nginx.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/security-headers.conf /etc/nginx/security-headers.conf
USER root
RUN find /usr/share/nginx/html -type d -exec chmod 0555 {} + \
  && find /usr/share/nginx/html -type f -exec chmod 0444 {} +
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
# The base image runs as an unprivileged user; no Node process is needed at runtime.
