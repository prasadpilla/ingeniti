# inGeniti Mobile App

This is the mobile app for the inGeniti platform, built using React Native and Expo.

## Setup

#### 1. Ensure you have the required environment:

- Node.js v20.13.1
- pnpm v8.10.2

#### 2. Install dependencies:

From the root directory:

```sh
cd ..
pnpm install
```

#### 3. Start the development server:

```sh
   pnpm start
```

## Available Scripts

- `pnpm start`: Start the Expo development server
- `pnpm ios`: Run the app on iOS simulator
- `pnpm android`: Run the app on Android emulator
- `pnpm web`: Run the app in a web browser
- `pnpm lint`: Run ESLint
- `pnpm format`: Run Prettier to format code

## Building for Production

- iOS: `pnpm build:ios`
- Android: `pnpm build:android`

## Project Structure

- `App.tsx`: Main application component
- `screens/`: Individual screen components
- `components/`: Reusable UI components
- `context/`: React context providers

## Theming

The app uses a custom theme that combines React Navigation and React Native Paper themes. You can toggle between light and dark modes in the app.

## Navigation

The app uses React Navigation with a bottom tab navigator for main navigation.

## Styling

Styling is done using React Native Paper components and custom styles where needed.
