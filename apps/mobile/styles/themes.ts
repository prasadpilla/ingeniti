import { DefaultTheme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

import Colors from './colors';

// export const Themes = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//   },
// };

export const LightTheme = {
  ...DefaultTheme,
  ...MD3LightTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.light,
  },
};

export const DarkTheme = {
  ...DefaultTheme,
  ...MD3DarkTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors.dark,
  },
};
