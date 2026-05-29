import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

type ScreenProps = {
  children: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>;
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    marginHorizontal: 'auto',
    maxWidth: 960,
    padding: 20,
    width: '100%'
  }
});

