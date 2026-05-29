import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#dbe4ef',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  }
});

