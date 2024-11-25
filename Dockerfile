FROM node:20-slim AS base
COPY pnpm-*.yaml package.json /app/
COPY api/package.json /app/api/
COPY shared/package.json /app/shared/
COPY api/drizzle /app/api/drizzle
WORKDIR /app
RUN npm install -g pnpm

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=api --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=shared --frozen-lockfile
COPY . .
RUN pnpm --filter=shared build
RUN pnpm --filter=api build

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=api --prod --frozen-lockfile
RUN pnpm --filter=api deploy --prod /app/deploy

FROM gcr.io/distroless/nodejs20-debian11 AS migrate
WORKDIR /app
COPY --from=prod-deps /app/deploy/node_modules /app/node_modules
COPY --from=build /app/api/dist /app/dist 
COPY --from=base /app/api/drizzle /app/drizzle
CMD ["dist/src/db/migrate.js"]

FROM gcr.io/distroless/nodejs20-debian11 AS server
COPY --from=prod-deps /app/deploy/node_modules /app/node_modules
COPY --from=build /app/shared/dist /app/node_modules/shared/dist
COPY --from=build /app/api/dist /app/dist
COPY --from=base /app/api/drizzle /app/drizzle
EXPOSE 8080
CMD ["/app/dist/src/server.js"]

FROM gcr.io/distroless/nodejs20-debian11 AS task-worker
COPY --from=prod-deps /app/deploy/node_modules /app/node_modules
COPY --from=build /app/shared/dist /app/node_modules/shared/dist
COPY --from=build /app/api/dist /app/dist
EXPOSE 8080
CMD ["/app/dist/src/taskWorker.js"]