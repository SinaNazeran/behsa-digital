# ── build ──
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── migrate ── one-off job; the runtime image has neither tsx nor scripts/
#   docker build --target migrate -t behsa-migrate .
#   docker run --rm -e DATABASE_URL=… behsa-migrate
FROM build AS migrate
CMD ["npm", "run", "db:migrate"]

# ── runtime ── (last stage, so a plain `docker build` still produces it)
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
