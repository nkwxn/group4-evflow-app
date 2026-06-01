import { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, Platform } from 'react-native';
import { useLocation, useNavigate } from 'react-router';
import { BottomNavigation, colors, SideMenu, type NavigationItem } from '@evflow/ui';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { DriverAssetIcon } from './components/DriverAssetIcon';
import { DriverMapScreen } from './DriverMapScreen';
import { MockDriverScreen } from './MockDriverScreen';
import type { DriverTabKey } from './types';

export function EVDriverContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const insets = useAppSafeAreaInsets();
  const desktop = width >= 768;
  const bottomNavOffset = desktop ? 0 : 84 + insets.bottom;
  const topInset = insets.top;
  const items = useDriverNavigationItems();
  const activeTab = getActiveDriverTab(location.pathname);

  return (
    <View style={styles.shell}>
      {desktop ? (
        <View style={[styles.sidebarWrap, { paddingTop: topInset }]}>
          <SideMenu
            activeKey={activeTab}
            bottomContent={<Text style={styles.sidebarNote}>EV Driver Mode</Text>}
            items={items}
            onItemPress={(key) => navigate(getDriverTabPath(key as DriverTabKey))}
            subtitle="Driver"
            title="EV-FLOW"
          />
        </View>
      ) : null}

      <View style={[styles.content, activeTab === 'map' && Platform.OS === 'web' && { touchAction: 'none' } as any]}>
        {activeTab === 'map' ? (
          <DriverMapScreen bottomOffset={bottomNavOffset} topInset={topInset} />
        ) : (
          <MockDriverScreen tabKey={activeTab} topInset={topInset} />
        )}

        {!desktop ? (
          <View style={[styles.bottomNavWrap, { paddingBottom: insets.bottom }]}>
            <BottomNavigation activeKey={activeTab} items={items} onItemPress={(key) => navigate(getDriverTabPath(key as DriverTabKey))} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function getActiveDriverTab(pathname: string): DriverTabKey {
  const tab = pathname.split('/')[2];

  if (tab === 'map' || tab === 'wallet' || tab === 'scan' || tab === 'plan_route' || tab === 'profile') {
    return tab;
  }

  return 'map';
}

function getDriverTabPath(tab: DriverTabKey) {
  return `/ev-driver/${tab}`;
}

function useDriverNavigationItems(): NavigationItem[] {
  return useMemo(
    () => [
      {
        key: 'map',
        label: 'Map',
        icon: ({ color }) => <DriverAssetIcon color={color} name="map" />
      },
      {
        key: 'wallet',
        label: 'Wallet',
        icon: ({ color }) => <DriverAssetIcon color={color} name="wallet" />
      },
      {
        key: 'scan',
        label: 'Scan',
        prominent: true,
        icon: ({ color }) => <DriverAssetIcon color={color} name="scan" />
      },
      {
        key: 'plan_route',
        label: 'Plan Route',
        icon: ({ color }) => <DriverAssetIcon color={color} name="plan_route" />
      },
      {
        key: 'profile',
        label: 'Profile',
        icon: ({ color }) => <DriverAssetIcon color={color} name="profile" />
      }
    ],
    []
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: 'row',
    minHeight: '100%'
  },
  content: {
    flex: 1,
    position: 'relative'
  },
  sidebarWrap: {
    backgroundColor: colors.background,
    flexBasis: 256,
    flexGrow: 0,
    flexShrink: 0,
    width: 256
  },
  bottomNavWrap: {
    backgroundColor: colors.background,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0
  },
  sidebarNote: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18
  }
});
