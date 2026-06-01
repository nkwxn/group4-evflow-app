import { createElement, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@evflow/ui';
import { FilterCategory } from './components/FilterCategory';

type DriverMapScreenProps = {
  bottomOffset?: number;
  topInset?: number;
};

export function DriverMapScreen({ bottomOffset = 0, topInset = 0 }: DriverMapScreenProps) {
  const [expanded, setExpanded] = useState(true);
  const sheetProgress = useRef(new Animated.Value(1)).current;
  const [connectorTypes, setConnectorTypes] = useState(['ccs2']);
  const [operators, setOperators] = useState(['all', 'terra', 'stroom']);
  const [chargingSpeeds, setChargingSpeeds] = useState(['ultra']);
  const drawerPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 8,
        onPanResponderRelease: (_, gestureState) => {
          updateSheetSizeFromDelta(gestureState.dy, setExpanded);
        }
      }),
    []
  );
  const sheetHeight = sheetProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [136, 560]
  });
  const sheetBodyOpacity = sheetProgress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0, 1]
  });
  const sheetBodyTranslateY = sheetProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0]
  });

  useEffect(() => {
    Animated.timing(sheetProgress, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
      toValue: expanded ? 1 : 0,
      useNativeDriver: false
    }).start();
  }, [expanded, sheetProgress]);

  const filterSheet = (
    <Animated.View style={[styles.filterSheet, { bottom: bottomOffset, height: sheetHeight }]} {...drawerPanResponder.panHandlers}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((current) => !current)}
        style={styles.drawerHandleWrap}
      >
        <View style={styles.drawerHandle} />
      </Pressable>

      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filter</Text>
        <Pressable accessibilityRole="button" onPress={() => resetFilters(setConnectorTypes, setOperators, setChargingSpeeds)}>
          <Text style={styles.resetText}>RESET ALL</Text>
        </Pressable>
      </View>

      <Animated.View
        pointerEvents={expanded ? 'auto' : 'none'}
        style={[styles.expandedContent, { opacity: sheetBodyOpacity, transform: [{ translateY: sheetBodyTranslateY }] }]}
      >
        <ScrollView contentContainerStyle={styles.filterContent} showsVerticalScrollIndicator={false}>
          <FilterCategory
            title="Connector Type"
            options={[
              { key: 'ccs2', label: 'CCS 2' },
              { key: 'sae', label: 'SAE J1772' },
              { key: 'ac_type_2', label: 'AC Type 2' },
              { key: 'chademo', label: 'CHAdeMO' }
            ]}
            selectedKeys={connectorTypes}
            onToggle={(key) => toggleSelected(key, connectorTypes, setConnectorTypes)}
          />
          <FilterCategory
            title="Charging Operator"
            options={[
              { key: 'all', label: 'ALL' },
              { key: 'voltron', label: 'Voltron' },
              { key: 'starvo', label: 'Starvo' },
              { key: 'casion', label: 'Casion' },
              { key: 'terra', label: 'Terra' },
              { key: 'stroom', label: 'STROOM' },
              { key: 'shell', label: 'Shell Recharge' },
              { key: 'pln', label: 'PLN' }
            ]}
            selectedKeys={operators}
            onToggle={(key) => toggleSelected(key, operators, setOperators)}
          />
          <FilterCategory
            title="Charging Speed"
            variant="card"
            options={[
              { key: 'standard', label: 'Standard', description: 'Up to 7 kW' },
              { key: 'medium', label: 'Medium', description: '7 - 22 kW' },
              { key: 'fast', label: 'Fast', description: '22 - 50 kW' },
              { key: 'ultra', label: 'Ultra', description: 'Over 50 kW' }
            ]}
            selectedKeys={chargingSpeeds}
            onToggle={(key) => toggleSelected(key, chargingSpeeds, setChargingSpeeds)}
          />
        </ScrollView>

        <Pressable accessibilityRole="button" style={styles.showStationsButton}>
          <Text style={styles.showStationsText}>Show 14 Stations</Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        pointerEvents={expanded ? 'none' : 'auto'}
        style={[styles.collapsedContent, { opacity: sheetProgress.interpolate({ inputRange: [0, 0.45], outputRange: [1, 0] }) }]}
      >
        <Pressable accessibilityRole="button" onPress={() => setExpanded(true)} style={styles.collapsedButton}>
          <Text style={styles.collapsedText}>Show filters</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );

  return (
    <View style={styles.page}>
      <MockMap />

      <View style={[styles.searchBar, { top: 24 + topInset }]}>
        <Text style={styles.searchIcon}>Q</Text>
        <TextInput
          accessibilityLabel="Search location"
          placeholder="Search location..."
          placeholderTextColor="#819097"
          style={styles.searchInput}
        />
        <Pressable accessibilityLabel="Open filters" accessibilityRole="button" style={styles.filterIcon}>
          <Text style={styles.filterIconText}>#</Text>
        </Pressable>
      </View>

      <WheelResizableSheet onResize={(deltaY) => updateSheetSizeFromDelta(deltaY, setExpanded)}>{filterSheet}</WheelResizableSheet>
    </View>
  );
}

type WheelResizableSheetProps = {
  children: React.ReactNode;
  onResize: (deltaY: number) => void;
};

function WheelResizableSheet({ children, onResize }: WheelResizableSheetProps) {
  if (Platform.OS !== 'web') {
    return <Fragment>{children}</Fragment>;
  }

  return createElement(
    'div',
    {
      onWheel: (event: WheelEvent) => {
        onResize(event.deltaY);
      },
      style: {
        display: 'contents'
      }
    },
    children
  );
}

function MockMap() {
  return (
    <View style={styles.map}>
      <Text style={styles.city}>Jakarta</Text>
    </View>
  );
}

function toggleSelected(key: string, selectedKeys: string[], setSelectedKeys: (keys: string[]) => void) {
  setSelectedKeys(selectedKeys.includes(key) ? selectedKeys.filter((selectedKey) => selectedKey !== key) : [...selectedKeys, key]);
}

function resetFilters(
  setConnectorTypes: (keys: string[]) => void,
  setOperators: (keys: string[]) => void,
  setChargingSpeeds: (keys: string[]) => void
) {
  setConnectorTypes([]);
  setOperators([]);
  setChargingSpeeds([]);
}

function updateSheetSizeFromDelta(deltaY: number, setExpanded: (expanded: boolean) => void) {
  if (deltaY > 18) {
    setExpanded(false);
  }

  if (deltaY < -18) {
    setExpanded(true);
  }
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flex: 1,
    overflow: 'hidden'
  },
  map: {
    backgroundColor: '#d7dbdc',
    flex: 1,
    position: 'relative'
  },
  mapShade: {
    backgroundColor: 'rgba(248, 249, 251, 0.26)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  road: {
    backgroundColor: '#aeb7ba',
    borderRadius: 999,
    height: 4,
    left: -20,
    position: 'absolute',
    width: 520
  },
  roadOne: {
    top: 102,
    transform: [{ rotate: '-16deg' }]
  },
  roadTwo: {
    top: 210,
    transform: [{ rotate: '22deg' }]
  },
  roadThree: {
    top: 330,
    transform: [{ rotate: '-34deg' }]
  },
  roadFour: {
    top: 430,
    transform: [{ rotate: '8deg' }]
  },
  landmark: {
    color: '#4d5558',
    fontSize: 22,
    fontWeight: '700',
    left: 132,
    position: 'absolute',
    top: 206
  },
  city: {
    color: '#2b3033',
    fontSize: 40,
    fontWeight: '900',
    left: 138,
    position: 'absolute',
    top: 282
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    left: 22,
    minHeight: 66,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 22,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  searchIcon: {
    color: '#64757c',
    fontSize: 18,
    fontWeight: '800'
  },
  searchInput: {
    color: '#1f2529',
    flex: 1,
    fontSize: 15,
    minHeight: 40
  },
  filterIcon: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  filterIconText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900'
  },
  filterSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    left: 0,
    overflow: 'hidden',
    paddingBottom: 20,
    paddingHorizontal: 22,
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 14
  },
  drawerHandleWrap: {
    alignItems: 'center',
    minHeight: 24,
    justifyContent: 'center'
  },
  drawerHandle: {
    backgroundColor: '#b7c9cc',
    borderRadius: 999,
    height: 4,
    width: 48
  },
  filterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  filterTitle: {
    color: '#1f2529',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32
  },
  resetText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14
  },
  expandedContent: {
    flex: 1,
    gap: 12
  },
  filterContent: {
    gap: 18,
    paddingBottom: 16
  },
  showStationsButton: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10
  },
  showStationsText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900'
  },
  collapsedContent: {
    left: 22,
    position: 'absolute',
    right: 22,
    top: 70
  },
  collapsedButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48
  },
  collapsedText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  }
});
