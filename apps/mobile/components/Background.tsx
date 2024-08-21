import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

const Background = ({ children }: Props) => <View style={styles.container}>{children}</View>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Background;
