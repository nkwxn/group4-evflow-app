import { Pressable, StyleSheet, Text } from 'react-native';

type FilterPillProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function FilterPill({ label, selected = false, onPress }: FilterPillProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.pill, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderColor: '#94a3b8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  selected: {
    backgroundColor: '#0f766e',
    borderColor: '#0f766e'
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600'
  },
  selectedLabel: {
    color: '#ffffff'
  }
});

