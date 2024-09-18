import { DefaultTheme } from 'react-native-paper';

export const Themes = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0891b2',
    secondary: '#414757',
    error: '#f13a59',
  },
};

// import {
//   DarkTheme as NavigationDarkTheme,
//   DefaultTheme as NavigationDefaultTheme,
// } from '@react-navigation/native';
// import {
//   adaptNavigationTheme,
//   MD3LightTheme,
//   MD3DarkTheme,
//   configureFonts,
// } from 'react-native-paper';

// import Colors from './colors';

// const { LightTheme, DarkTheme } = adaptNavigationTheme({
//   reactNavigationLight: NavigationDefaultTheme,
//   reactNavigationDark: NavigationDarkTheme,
// });

// const fonts = configureFonts({ config: { fontFamily: 'NotoSans_400Regular' } });

// const BaseLightTheme = {
//   ...LightTheme,
//   ...MD3LightTheme,
//   fonts,
// };

// const BaseDarkTheme = {
//   ...DarkTheme,
//   ...MD3DarkTheme,
//   fonts,
// };

// const Themes = {
//   light: {
//     default: {
//       ...BaseLightTheme,
//       colors: {
//         ...BaseLightTheme.colors,
//         ...Colors.light.default,
//       },
//     },
//     blue: {
//       ...BaseLightTheme,
//       colors: {
//         ...BaseLightTheme.colors,
//         ...Colors.light.blue,
//       },
//     },
//   },
//   dark: {
//     default: {
//       ...BaseDarkTheme,
//       colors: {
//         ...BaseDarkTheme.colors,
//         ...Colors.dark.default,
//       },
//     },
//     blue: {
//       ...BaseDarkTheme,
//       colors: {
//         ...BaseDarkTheme.colors,
//         ...Colors.dark.blue,
//       },
//     },
//   },
// };

// export default Themes;
