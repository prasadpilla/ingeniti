<div align="center" style="display: flex; align-items: center; justify-content: center; column-gap: 10px">
  <span style="font-size: 48px; font-weight: 700">inGeniti</span>
</div>

<h3 align="center">Energy Grid Optimization Platform</h3>

## Requirements

- node v20.13.1
- pnpm v8.10.2

## Structure

- [`apps`](./apps) - Apps that only use packages and aren't aware of other apps.
- [`packages`](./packages) - Packages that may use external and/or other monorepo packages.

### Apps

- [`apps/api`](./apps/api) - NodeJS backend in TypeScript.

- [`apps/mobile`](./apps/mobile) - React Native Expo app for iOS and Android.
- [`apps/web`](./apps/web) - ReactJS Web frontend app.

### Packages

- [`packages/eslint-config`](./packages/eslint-config) - Preconfigured ESLint configuration for each app or package.
- [`packages/shared`](./packages/shared) - Shared schemas and types for all our apps.

## How to use it

We use `.env` files to store environment variables. Ask a fellow dev for the env files and place them under `/apps/api` and `/apps/web` and `/apps/mobile`.

### Setup

To run the repository locally, run these two commands:

#### Build the shared package

Our apps are using a shared package for common types and functions. We need to build the shared package before installing the dependencies in the root directory.

```bash
cd shared; pnpm build
```

#### Install dependencies

Run the below command in the root directory to install dependencies for all apps and packages.

```bash
$ pnpm install
```

#### Start the development server

Run the below command to start the development servers for all **apps**.

```bash
$ pnpm dev
```

### Adding new dependencies

Web app:

```bash
pnpm add --filter ./apps/web <package_name>
```

Backend:

```bash
pnpm add --filter ./apps/api <package_name>
```

Mobile:

```bash
pnpm add --filter ./apps/mobile <package_name>
```

Shadcn package:

```bash
cd apps/web; pnpm dlx shadcn-ui@latest add <package_name>
```

## Backend API setup

### Database

Update the `.env` file in `/apps/api` with the correct credentials to your local postgres database if you want to use a local database.

Run `docker-compose up database` to run the database locally and use credentials from the `.env` file.

##### Run migrations

```bash
cd apps/api; pnpm db:migrate
```

#### Generating database migrations

When you make changes to the database schema, you need to generate a migration file.

```bash
cd apps/api; pnpm db:generate
```

## Mobile app setup

### Run the mobile app on iOS

```bash
cd apps/mobile; pnpm ios
```

### Run the mobile app on Android

```bash
cd apps/mobile; pnpm android
```

### Run the mobile app on Web

```bash
cd apps/mobile; pnpm web
```

### Build the mobile app

```bash
cd apps/mobile; eas build --platform ios --profile release --local
```

### Submit the mobile app to the app store

```bash
cd apps/mobile; eas submit --platform ios --path ./build/ios/ipa/Ingeniti.ipa
```
