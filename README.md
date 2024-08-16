<div align="center" style="display: flex; align-items: center; justify-content: center; column-gap: 10px">
  <img src="./apps/web/public/logo.png" alt="Ingeniti Logo" width="50" height="50">
  <span style="font-size: 48px; font-weight: 700">ingeniti</span>
</div>

<h3 align="center">Energy Grid Optimization Platform</h3>

## Requirements

- node v20.13.1
- pnpm v8.10.2

#### Note about Metro Cache

In **apps/mobile** we leverage the Metro cache to speed up building and publishing. We use Turborepo to restore or invalidate this cache. To populate this Metro cache, the **apps/mobile** has a [`$ pnpm build`](./apps/mobile/package.json#L9) script that exports React Native bundles. The resulting Metro cache is then reused when [publishing previews](./.github/workflows/preview.yml#L26-L28).

## 📁 Structure

- [`apps`](./apps) - Apps that only use packages and aren't aware of other apps.
- [`packages`](./packages) - Packages that may use external and/or other monorepo packages.

### Apps

- [`apps/api`](./apps/api) - NodeJS backend in TypeScript.

- [`apps/mobile`](./apps/mobile) - React Native Expo app for iOS and Android.
- [`apps/web`](./apps/web) - ReactJS Web frontend app.

### Packages

- [`packages/eslint-config`](./packages/eslint-config) - Preconfigured ESLint configuration for each app or package.
- [`packages/shared`](./packages/shared) - Shared schemas and types for all our apps.

## 🚀 How to use it

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

### Commands

Because this monorepo uses [Turborepo](https://turbo.build/repo), you don't need to run additional commands to set things up. Whenever you run `$ pnpm build`, it will build all **packages** if they aren't built yet. In this monorepo we use a few commands or pipelines:

- `$ pnpm dev` - Build and watch all **apps** and **packages** for development.
- `$ pnpm lint` - Analyze the source code of all **apps** and **packages** using ESLint.
- `$ pnpm test` - Run all tests for packages with Jest tests.
- `$ pnpm build` - Build all **apps** and **packages** for production or to publish them on npm.

When developing or deploying a single app, you might not need the development server for all apps. For example, if you need to make a fix in the mobile app, you don't need the web development server. Or when deploying a single app to production, you only need to build that single app with all dependencies.

This monorepo uses a simple npm script convention of `dev:<app-name>` and `build:<app-name>` to keep this process simple. Under the hood, it uses [Turborepo's workspace filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering), defined as an npm script in the root [**package.json**](./package.json).

- `$ pnpm dev:mobile` - Build and watch **app/mobile** and all **packages** used in mobile, for development.
- `$ pnpm dev:web` - Build and watch **app/web** and all **packages** used in web, for development.
- `$ pnpm build:mobile` - Build **apps/mobile** and all **packages** used in mobile, for production deployments
- `$ pnpm build:web` - Build **apps/web** and all **packages** used in web, for production deployments

## 👷 Workflows

- [`build`](./.github/workflows/build.yml) - Starts the EAS builds for **apps/mobile** using the given profile.
- [`preview`](./.github/workflows/preview.yml) - Publishes apps to a PR-specific release channel and adds a QR code to that PR.
- [`test`](./.github/workflows/test.yml) - Ensures that the apps and packages are healthy on multiple OSs.

### Composite workflows

- [`setup-monorepo`](./.github/actions/setup-monorepo/action.yml) - Reusable composite workflow to setup the monorepo in GitHub Actions.

## ⚠️ Caveats

### Installing multiple React Native versions

React Native is a complex library, split over multiple different packages. Unfortunately, React Native only supports a single version per monorepo. When using multiple different versions, things might break in unexpected ways without proper error reporting.

You can check if your monorepo is installing multiple versions of React Native with the `npm list` command, supported by all major package managers:

```bash
$ npm why react-native
$ yarn why react-native

# Bun doesn't have `bun why` (yet), but you can use `yarn why` instead
$ bun install --yarn && yarn why react-native

# pnpm needs `--recursive` to search in all workspaces within the monorepo
$ pnpm why --recursive react-native
```

If you are using multiple versions, try to update all **package.json** files, or use an [`overrides`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides)/[`resolutions`](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/) in the root **package.json** to force only one React Native version.

### Using environment variables in React Native

Reusing Metro caches can be dangerous if you use Babel plugins like [transform-inline-environment-variables](https://babeljs.io/docs/en/babel-plugin-transform-inline-environment-variables/). When using Babel plugins to swap out environment variables for their actual value, you are creating a dependency on environment variables. Because Metro is unaware of dependencies on environment variables, Metro might reuse an incorrect cached environment variable.

Since Turborepo handles the cache in this repository, we can leverage [caching based on environment variables](https://turbo.build/repo/docs/core-concepts/caching#altering-caching-based-on-environment-variables). This invalidates the Metro cache whenever certain environment variables are changed and avoid reusing incorrect cached code.

> [!TIP]
> Expo now supports `.env` files out-of-the-box. This also means that Metro is now smart enough to invalidate the cache whenever these variables change. There is no need to do this manually anymore.

### pnpm workarounds

In the current React Native ecosystem, there are a lot of implicit dependencies. These can be from the native code that is shipped within packages, or even implicit dependencies through installing a specific version of Expo or React Native. In the newer package managers like pnpm, you will run into issues due to these implicit dependencies. Besides that there are other issues like [Metro not following symlinks](https://github.com/facebook/metro/issues/1).

To workaround these issues, we have to change some config:

1. Let pnpm generate a flat **node_modules** folder, without symlinks. You can do that by creating a root [**.npmrc**](./.npmrc) file containing ([`node-linker=hoisted`](https://pnpm.io/npmrc#node-linker)). This works around two things; no Metro symlink support, and having a simple way to determine where the modules are installed (see point 3).

2. Either disable [`strict-peer-dependencies`](https://pnpm.io/npmrc#strict-peer-dependencies) or add [`peerDependencyRules.ignoreMissing`](./package.json#L14-L22) rules in the **package.json**. This disables some of the expected implicit peer dependencies issues. Without these changes, pnpm will fail on install asking you to install various peer dependencies.

3. Update the **metro.config.js** configuration for usage in monorepos. Full explanation per configuration option can be found in the [Expo docs](https://docs.expo.dev/guides/monorepos/#modify-the-metro-config). The only addition in this repository is the [`config.cacheStores`](./apps/mobile/metro.config.js#L22-L24). This change moves the Metro cache to a place which is accessible by Turborepo, our main cache handler (see [Why is it fast?](#-why-is-it-fast)).

### Precompile packages

EAS only sends the files which are committed to the repository. That means [the `packages/*/build` folders](.gitignore#L3) need to be generated before building our apps. To tell EAS how to compile our packages, we can [use the `postinstall` hook](https://docs.expo.dev/build-reference/how-tos/#how-to-set-up-eas-build-with).

### Running EAS from apps directories

As of writing, the `eas build` command needs to be executed from the package folder itself. EAS will still create a tarball with all files from your monorepo, but runs the build commands from this local folder. You can see this happening in the [build workflow](./.github/workflows/build.yml#L32).

### Using local credentials in CI

If you want to maintain the keystore or certificates yourself, you have to [configure EAS with local credentials](https://docs.expo.dev/app-signing/local-credentials/#credentialsjson). When your CI provider doesn't allow you to add "secret files", you can [encode these files to base64 strings](https://docs.expo.dev/app-signing/local-credentials/#using-local-credentials-on-builds-triggered-from) and decode whenever you need it.

> It's highly recommended to keep keystores and certificates out of your repository to avoid security issues.
