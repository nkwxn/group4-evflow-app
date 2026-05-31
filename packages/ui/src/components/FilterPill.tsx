import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

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
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  selectedLabel: {
    color: colors.text
  }
});
