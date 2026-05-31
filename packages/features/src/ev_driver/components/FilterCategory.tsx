import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@evflow/ui';

export type FilterOption = {
  key: string;
  label: string;
  description?: string;
};

type FilterCategoryProps = {
  title: string;
  options: FilterOption[];
  selectedKeys: string[];
  variant?: 'pill' | 'card';
  onToggle: (key: string) => void;
};

export function FilterCategory({ title, options, selectedKeys, variant = 'pill', onToggle }: FilterCategoryProps) {
  return (
    <View style={styles.category}>
      <Text style={styles.title}>{title}</Text>
      <View style={variant === 'card' ? styles.cardOptions : styles.pillOptions}>
        {options.map((option) => {
          const selected = selectedKeys.includes(option.key);

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={option.key}
              onPress={() => onToggle(option.key)}
              style={[variant === 'card' ? styles.cardOption : styles.pillOption, selected && styles.selectedOption]}
            >
              <Text style={[variant === 'card' ? styles.cardLabel : styles.pillLabel, selected && styles.selectedLabel]}>
                {option.label}
              </Text>
              {option.description ? (
                <Text style={[styles.description, selected && styles.selectedDescription]}>{option.description}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    gap: 9
  },
  title: {
    color: '#4c5960',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 13,
    textTransform: 'uppercase'
  },
  pillOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  pillOption: {
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderColor: '#cad2d7',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 28,
    paddingHorizontal: 15
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  pillLabel: {
    color: '#1f2529',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16
  },
  selectedLabel: {
    color: colors.text
  },
  cardOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cardOption: {
    backgroundColor: '#e9ecef',
    borderColor: '#cad2d7',
    borderRadius: 9,
    borderWidth: 1,
    minHeight: 60,
    paddingHorizontal: 13,
    paddingVertical: 12,
    width: '48%'
  },
  cardLabel: {
    color: '#1f2529',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18
  },
  description: {
    color: '#718087',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2
  },
  selectedDescription: {
    color: colors.text
  }
});
