import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function Button({ children, onPress }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  label: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700'
  }
});

