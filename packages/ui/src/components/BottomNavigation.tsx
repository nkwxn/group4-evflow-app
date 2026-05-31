import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type NavigationIconOptions = {
  active: boolean;
  color: string;
};

type NavigationIcon = ReactNode | ((options: NavigationIconOptions) => ReactNode);

export type NavigationItem = {
  key: string;
  label: string;
  icon: NavigationIcon;
  activeIcon?: NavigationIcon;
  accessibilityLabel?: string;
  prominent?: boolean;
};

type BottomNavigationProps = {
  items: NavigationItem[];
  activeKey: string;
  onItemPress?: (key: string) => void;
};

export function BottomNavigation({ items, activeKey, onItemPress }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => {
        const active = item.key === activeKey;
        const icon = renderIcon(item, active);

        if (item.prominent) {
          return (
            <Pressable
              accessibilityLabel={item.accessibilityLabel ?? item.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              key={item.key}
              onPress={() => onItemPress?.(item.key)}
              style={styles.prominentItem}
            >
              <View style={styles.prominentIcon}>{icon}</View>
              <Text style={[styles.label, active && styles.activeLabel]} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            key={item.key}
            onPress={() => onItemPress?.(item.key)}
            style={[styles.item, active && styles.activeItem]}
          >
            <View style={styles.icon}>{icon}</View>
            <Text style={[styles.label, active && styles.activeLabel]} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function renderIcon(item: NavigationItem, active: boolean) {
  const icon = active && item.activeIcon ? item.activeIcon : item.icon;
  const color = active ? colors.text : colors.mutedText;

  return typeof icon === 'function' ? icon({ active, color }) : icon;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 84,
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 8
  },
  item: {
    alignItems: 'center',
    borderRadius: 24,
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 8
  },
  activeItem: {
    backgroundColor: colors.primary
  },
  prominentItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    justifyContent: 'center',
    minHeight: 56
  },
  prominentIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.background,
    borderRadius: 30,
    borderWidth: 4,
    height: 60,
    justifyContent: 'center',
    marginTop: -34,
    width: 60
  },
  icon: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    width: 22
  },
  label: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center'
  },
  activeLabel: {
    color: colors.text
  }
});
