# inGeniti: Energy grid optimization platform

It's a monorepo with three separate apps: `api`, `web` and `mobile` and a `shared` package.

## Requirements

- node v20.13.1
- pnpm v8.10.2

## Setup

We use `.env` files to store environment variables. Ask a fellow dev for the env files and place them under `/api` and `/web` and `/mobile`.

#### Build the shared package

Our apps are using a shared package for common types and functions. We need to build the shared package before installing the dependencies in the root directory.

```bash
cd shared; pnpm build
```

#### Install dependencies

Run this in the root directory to install dependencies for all apps.

```bash
pnpm install
```

#### Setup the database

Update the `.env` file in `/api` with the correct credentials to your local postgres database if you want to use a local database.

Run `docker-compose up database` to run the database locally and use credentials from the `.env` file.

###### Run migrations

```bash
cd api; pnpm db:migrate
```

#### Run the apps

To run the web app, run below

```bash
cd web; pnpm dev
```

To run the api, run below

```bash
cd api; pnpm dev
```

## Adding new dependencies

Web app:

```bash
pnpm add --filter ./web <package_name>
```

Backend:

```bash
pnpm add --filter ./api <package_name>
```

Shadcn package:

```
cd web; pnpm dlx shadcn-ui@latest add <package_name>
```

## Generating database migrations

When you make changes to the database schema, you need to generate a migration file.

```bash
cd api; pnpm db:generate
```

### Docker compose - !! Ignore this for now, there are issues with it

Building the stack

```bash
docker-compose up build

```

Running the stack

```
docker-compose up
```

Migrate the database

```
cd api; pnpm db:migrate
```
