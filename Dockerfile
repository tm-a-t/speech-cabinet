FROM node:20-slim AS base
RUN echo "it doesn't work" && exit 1
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update -y && apt-get install -y openssl wget gnupg dbus dbus-x11 ffmpeg && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock prisma/ ./
RUN --mount=type=cache,target=/root/.yarn \
    YARN_CACHE_FOLDER=/root/.yarn \
    yarn --frozen-lockfile \
    && rm -rf node_modules/{ffprobe-static,ffmpeg-static,@next/swc-linux-x64-musl,@next/swc-linux-x64-gnu}

RUN apt-get update -y \
    && apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libc6 libcairo2 libcups2 libcurl4 libdbus-1-3 libdrm2 libexpat1 libgbm1 libglib2.0-0 libgtk-3-0 libnss3 libpango-1.0-0 libudev1 libvulkan1 libx11-6 libxcb1 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxkbcommon0 libxrandr2 wget xdg-utils \
    && rm -rf /var/lib/apt/lists/*

COPY . .
RUN adduser --uid 1001 nextjs
RUN chown nextjs:nextjs . && chown -R nextjs:nextjs node_modules/.prisma

USER nextjs
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
EXPOSE 3000

ENV DBUS_SESSION_BUS_ADDRESS autolaunch:

ENTRYPOINT ["./entrypoint.sh"]
