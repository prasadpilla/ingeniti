FROM node:20-slim AS base
RUN apt-get update && apt-get install -y python3 make g++
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
RUN rm -rf /app/api/dist
RUN pnpm --filter=shared build
RUN pnpm --filter=api build

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=api --prod --frozen-lockfile
RUN pnpm --filter=api deploy --prod /app/deploy

FROM node:20-slim AS app
WORKDIR /app
COPY --from=prod-deps /app/deploy/node_modules /app/node_modules
COPY --from=build /app/shared/dist /app/node_modules/shared/dist
COPY --from=build /app/api/dist /app/dist
COPY --from=base /app/api/drizzle /app/drizzle
EXPOSE 8080