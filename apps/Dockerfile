FROM node:20-slim AS base
COPY pnpm-*.yaml package.json /ingeniti/
COPY apps/api/package.json /ingeniti/apps/api/
COPY packages/shared/package.json /ingeniti/packages/shared/
COPY apps/api/drizzle /ingeniti/apps/api/drizzle
WORKDIR /ingeniti
RUN npm install -g pnpm

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=@ingeniti/app-api --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=@ingeniti/shared --frozen-lockfile
COPY . .
RUN rm -rf /ingeniti/apps/api/dist
RUN pnpm --filter=@ingeniti/shared build
RUN pnpm --filter=@ingeniti/app-api build

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=@ingeniti/app-api --prod --frozen-lockfile
RUN pnpm --filter=@ingeniti/app-api deploy --prod /ingeniti/apps/api/deploy

FROM gcr.io/distroless/nodejs20-debian11 AS migrate
ENV NODE_ENV=production
WORKDIR /ingeniti
COPY --from=prod-deps /ingeniti/apps/api/deploy/node_modules /ingeniti/apps/api/node_modules
COPY --from=build /ingeniti/apps/api/dist /ingeniti/apps/api/dist 
COPY --from=base /ingeniti/apps/api/drizzle /ingeniti/apps/api/drizzle
CMD ["dist/src/db/migrate.js"]

FROM gcr.io/distroless/nodejs20-debian11 AS server
ENV NODE_ENV=production
WORKDIR /ingeniti
COPY --from=prod-deps /ingeniti/apps/api/deploy/node_modules /ingeniti/node_modules
COPY --from=build /ingeniti/packages/shared/dist /ingeniti/node_modules/@ingeniti/shared/dist
COPY --from=build /ingeniti/apps/api/dist /ingeniti/dist
EXPOSE 8080
CMD ["/ingeniti/dist/src/server.js"]

FROM gcr.io/distroless/nodejs20-debian11 AS task-worker
ENV NODE_ENV=production
WORKDIR /ingeniti
COPY --from=prod-deps /ingeniti/apps/api/deploy/node_modules /ingeniti/node_modules
COPY --from=build /ingeniti/packages/shared/dist /ingeniti/node_modules/@ingeniti/shared/dist
COPY --from=build /ingeniti/apps/api/dist /ingeniti/dist
EXPOSE 8080
CMD ["/ingeniti/dist/src/taskWorker.js"]