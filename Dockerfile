FROM node:20-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update -y && apt-get install -y openssl wget gnupg dbus dbus-x11 ffmpeg && rm -rf /var/lib/apt/lists/*
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | tee /etc/apt/trusted.gpg.d/google.asc \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update && apt-get -y install google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock prisma/ ./
RUN --mount=type=cache,target=/root/.yarn \
    YARN_CACHE_FOLDER=/root/.yarn \
    yarn --frozen-lockfile


COPY . .
RUN adduser --uid 1001 nextjs
RUN chown nextjs:nextjs . && chown -R nextjs:nextjs node_modules/.prisma

USER nextjs
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV CHROME_PATH=/usr/bin/google-chrome-stable
EXPOSE 3000

RUN yarn build

VOLUME /app/temp
RUN mkdir /app/temp

ENTRYPOINT ["./entrypoint.sh"]
