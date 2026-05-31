import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { renderIcon, type NavigationItem } from './BottomNavigation';

type SideMenuProps = {
  items: NavigationItem[];
  activeKey: string;
  onItemPress?: (key: string) => void;
  title?: string;
  subtitle?: string;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
};

export function SideMenu({
  items,
  activeKey,
  onItemPress,
  title,
  subtitle,
  topContent,
  bottomContent
}: SideMenuProps) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        {(title || subtitle) && (
          <View style={styles.brand}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        )}

        {topContent ? <View style={styles.customContainer}>{topContent}</View> : null}

        <View style={styles.items}>
          {items.map((item) => {
            const active = item.key === activeKey;
            const icon = renderIcon(item, active);

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
      </View>

      {bottomContent ? <View style={styles.bottom}>{bottomContent}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRightColor: colors.border,
    borderRightWidth: 1,
    flexBasis: 256,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'space-between',
    minHeight: '100%',
    padding: 18,
    width: 256
  },
  top: {
    gap: 28
  },
  brand: {
    gap: 2,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 18
  },
  customContainer: {
    paddingHorizontal: 8
  },
  items: {
    gap: 8
  },
  item: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  activeItem: {
    backgroundColor: colors.primary
  },
  icon: {
    alignItems: 'center',
    height: 22,
    justifyContent: 'center',
    width: 22
  },
  label: {
    color: colors.mutedText,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 18
  },
  activeLabel: {
    color: colors.text
  },
  bottom: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 18
  }
});
