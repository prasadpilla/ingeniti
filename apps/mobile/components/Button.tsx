import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

interface ButtonProps extends React.ComponentProps<typeof PaperButton> {}

const Button: React.FC<ButtonProps> = ({ mode, style, buttonContentStyles, children, ...props }) => {
  const theme = useTheme();

  return (
    <PaperButton
      style={[style, styles.button, mode === 'outlined' && { backgroundColor: theme.colors.surface }]}
      labelStyle={styles.text}
      mode={mode}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 26,
  },
});

export default Button;
