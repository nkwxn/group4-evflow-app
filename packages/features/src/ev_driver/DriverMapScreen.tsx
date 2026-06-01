import { createElement, Fragment, useMemo, useState } from 'react';
import { PanResponder, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';
import { colors, LeafletMap } from '@evflow/ui';
import { FilterCategory } from './components/FilterCategory';

type DriverMapScreenProps = {
  bottomOffset?: number;
  topInset?: number;
};

type DrawerMode = 'filter' | 'results' | 'detail';

type ConnectorInfo = {
  label: string;
  speed: string;
  total: number;
};

type Station = {
  id: string;
  address: string;
  connectors: ConnectorInfo[];
  latitude: number;
  longitude: number;
  name: string;
};

const stations: Station[] = [
  {
    id: 'pln-thamrin',
    address: 'Jl. M.H. Thamrin No. 8, Jakarta Pusat',
    connectors: [
      { label: 'CCS 2', speed: 'ULTRA-FAST', total: 2 },
      { label: 'Type 2', speed: 'SLOW', total: 1 },
      { label: 'CHAdeMO', speed: 'FAST', total: 1 }
    ],
    latitude: -6.1841,
    longitude: 106.8236,
    name: 'SPKLU PLN Sukses Thamrin Hub'
  },
  {
    id: 'voltron-mampang',
    address: 'Jl. Mampang Prpt. Raya No.16',
    connectors: [{ label: 'Type 2', speed: 'SLOW', total: 1 }],
    latitude: -6.2417,
    longitude: 106.8258,
    name: 'SPKLU Voltron'
  },
  {
    id: 'charge-tb-simatupang',
    address: 'Jl. TB Simatupang No.41',
    connectors: [{ label: 'CCS 2', speed: 'ULTRA-FAST', total: 2 }],
    latitude: -6.2918,
    longitude: 106.8054,
    name: 'SPKLU Charge +'
  },
  {
    id: 'pln-kuningan',
    address: 'Jl. HR Rasuna Said, Jakarta Selatan',
    connectors: [
      { label: 'CCS 2', speed: 'ULTRA-FAST', total: 2 },
      { label: 'Type 2', speed: 'SLOW', total: 1 }
    ],
    latitude: -6.2206,
    longitude: 106.8326,
    name: 'SPKLU PLN Sukses Thamrin Hub'
  }
];

export function DriverMapScreen({ bottomOffset = 0, topInset = 0 }: DriverMapScreenProps) {
  const [expanded, setExpanded] = useState(true);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('filter');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [connectorTypes, setConnectorTypes] = useState(['ccs2']);
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
  const selectedMarker = useMemo(
    () =>
      selectedStation
        ? [
            {
              id: selectedStation.id,
              label: selectedStation.name,
              latitude: selectedStation.latitude,
              longitude: selectedStation.longitude
            }
          ]
        : [],
    [selectedStation]
  );

  return (
    <View style={styles.page}>
      <LeafletMap
        center={selectedStation ? { latitude: selectedStation.latitude, longitude: selectedStation.longitude } : undefined}
        markers={selectedMarker}
        showCurrentLocationPinpoint
        zoom={selectedStation ? 15 : 13}
      />

      <View style={[styles.searchBar, { top: 24 + topInset }]}>
        <Text style={styles.searchIcon}>Q</Text>
        <TextInput
          accessibilityLabel="Search location"
          placeholder="Search location..."
          placeholderTextColor="#819097"
          style={styles.searchInput}
        />
        <Pressable
          accessibilityLabel="Open filters"
          accessibilityRole="button"
          onPress={() => {
            setDrawerMode('filter');
            setExpanded(true);
          }}
          style={styles.filterIcon}
        >
          <Text style={styles.filterIconText}>#</Text>
        </Pressable>
      </View>

      <WheelResizableSheet onResize={(deltaY) => updateSheetSizeFromDelta(deltaY, setExpanded)}>
        <View style={[styles.sheet, getSheetStateStyle(drawerMode, expanded), { bottom: bottomOffset }]} {...drawerPanResponder.panHandlers}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            onPress={() => setExpanded((current) => !current)}
            style={styles.drawerHandleWrap}
          >
            <View style={styles.drawerHandle} />
          </Pressable>

          {drawerMode === 'filter' ? (
            <FilterDrawer
              chargingSpeeds={chargingSpeeds}
              connectorTypes={connectorTypes}
              expanded={expanded}
              onApply={() => {
                setDrawerMode('results');
                setSelectedStation(null);
                setExpanded(true);
              }}
              onClose={() => {
                setDrawerMode('results');
                setExpanded(false);
              }}
              onReset={() => resetFilters(setConnectorTypes, setChargingSpeeds)}
              onToggleChargingSpeed={(key) => toggleSelected(key, chargingSpeeds, setChargingSpeeds)}
              onToggleConnectorType={(key) => toggleSelected(key, connectorTypes, setConnectorTypes)}
            />
          ) : null}

          {drawerMode === 'results' ? (
            <ResultsDrawer
              expanded={expanded}
              onFilter={() => {
                setDrawerMode('filter');
                setExpanded(true);
              }}
              onSelectStation={(station) => {
                setSelectedStation(station);
                setDrawerMode('detail');
                setExpanded(true);
              }}
            />
          ) : null}

          {drawerMode === 'detail' && selectedStation ? (
            <StationDetailDrawer
              expanded={expanded}
              station={selectedStation}
              onClose={() => {
                setDrawerMode('results');
                setExpanded(true);
              }}
            />
          ) : null}
        </View>
      </WheelResizableSheet>
    </View>
  );
}

type FilterDrawerProps = {
  chargingSpeeds: string[];
  connectorTypes: string[];
  expanded: boolean;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
  onToggleChargingSpeed: (key: string) => void;
  onToggleConnectorType: (key: string) => void;
};

function FilterDrawer({
  chargingSpeeds,
  connectorTypes,
  expanded,
  onApply,
  onClose,
  onReset,
  onToggleChargingSpeed,
  onToggleConnectorType
}: FilterDrawerProps) {
  return (
    <View style={styles.drawerBody}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filter</Text>
        <Pressable accessibilityLabel="Close filter" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </Pressable>
      </View>

      <View style={[styles.expandedContent, getExpandedContentStateStyle(expanded)]}>
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
            onToggle={onToggleConnectorType}
          />

          <FilterCategory
            title="Charging Speed"
            variant="card"
            options={[
              { key: 'slow', label: 'Slow', description: 'Up to 7 kW' },
              { key: 'fast', label: 'Fast', description: '22 - 50 kW' },
              { key: 'ultra', label: 'Ultra', description: 'Over 50 kW' }
            ]}
            selectedKeys={chargingSpeeds}
            onToggle={onToggleChargingSpeed}
          />

          <View style={styles.distanceSection}>
            <View style={styles.distanceHeader}>
              <Text style={styles.categoryTitle}>Distance</Text>
              <Text style={styles.distanceValue}>8 km</Text>
            </View>
            <View style={styles.sliderTrack}>
              <View style={styles.sliderFill} />
              <View style={styles.sliderThumb} />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>3 km</Text>
              <Text style={styles.sliderLabel}>5 km</Text>
              <Text style={styles.sliderLabel}>8 km</Text>
              <Text style={styles.sliderLabel}>10 km</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionRow}>
          <Pressable accessibilityRole="button" onPress={onReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onApply} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type ResultsDrawerProps = {
  expanded: boolean;
  onFilter: () => void;
  onSelectStation: (station: Station) => void;
};

function ResultsDrawer({ expanded, onFilter, onSelectStation }: ResultsDrawerProps) {
  return (
    <View style={styles.drawerBody}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Nearby SPKLU Stations</Text>
        <Pressable accessibilityRole="button" onPress={onFilter} style={styles.filterButton}>
          <Text style={styles.filterButtonIcon}>#</Text>
          <Text style={styles.filterButtonText}>Filter</Text>
        </Pressable>
      </View>

      <View style={[styles.expandedContent, getExpandedContentStateStyle(expanded)]}>
        <ScrollView contentContainerStyle={styles.stationList} showsVerticalScrollIndicator={false}>
          {stations.map((station) => (
            <StationCard key={station.id} station={station} onPress={() => onSelectStation(station)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

type StationDetailDrawerProps = {
  expanded: boolean;
  station: Station;
  onClose: () => void;
};

function StationDetailDrawer({ expanded, station, onClose }: StationDetailDrawerProps) {
  return (
    <View style={styles.drawerBody}>
      <View style={styles.sheetHeader}>
        <Text numberOfLines={1} style={styles.detailTitle}>
          {station.name.replace(' Hub', '')}
        </Text>
        <Pressable accessibilityLabel="Close station detail" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </Pressable>
      </View>

      <View style={[styles.expandedContent, getExpandedContentStateStyle(expanded)]}>
        <Text style={styles.stationAddress}>{station.address}</Text>
        <View style={styles.connectorList}>
          {station.connectors.map((connector) => (
            <ConnectorRow connector={connector} key={connector.label} />
          ))}
        </View>
      </View>
    </View>
  );
}

type StationCardProps = {
  station: Station;
  onPress: () => void;
};

function StationCard({ station, onPress }: StationCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.stationCard}>
      <Text style={styles.stationName}>{station.name}</Text>
      <Text style={styles.stationAddress}>{station.address}</Text>
      <View style={styles.connectorList}>
        {station.connectors.map((connector) => (
          <ConnectorRow connector={connector} key={connector.label} />
        ))}
      </View>
    </Pressable>
  );
}

type ConnectorRowProps = {
  connector: ConnectorInfo;
};

function ConnectorRow({ connector }: ConnectorRowProps) {
  return (
    <View style={styles.connectorRow}>
      <View style={styles.connectorLeft}>
        <View style={styles.connectorIcon}>
          <Text style={styles.connectorIconText}>⚡</Text>
        </View>
        <Text style={styles.connectorName}>{connector.label}</Text>
      </View>
      <View style={styles.connectorMeta}>
        <Text style={styles.connectorSpeed}>{connector.speed}</Text>
        <View style={styles.connectorDivider} />
        <Text style={styles.connectorTotal}>Total {connector.total}</Text>
      </View>
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

function toggleSelected(key: string, selectedKeys: string[], setSelectedKeys: (keys: string[]) => void) {
  setSelectedKeys(selectedKeys.includes(key) ? selectedKeys.filter((selectedKey) => selectedKey !== key) : [...selectedKeys, key]);
}

function resetFilters(setConnectorTypes: (keys: string[]) => void, setChargingSpeeds: (keys: string[]) => void) {
  setConnectorTypes([]);
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

type WebTransitionStyle = ViewStyle & {
  boxShadow?: string;
  transitionDuration?: string;
  transitionProperty?: string;
  transitionTimingFunction?: string;
};

function getSheetStateStyle(mode: DrawerMode, expanded: boolean): WebTransitionStyle {
  const expandedHeights: Record<DrawerMode, number> = {
    detail: 254,
    filter: 430,
    results: 650
  };

  return {
    height: expanded ? expandedHeights[mode] : 104,
    ...getWebTransition('height', '240ms', 'cubic-bezier(0.22, 1, 0.36, 1)')
  };
}

function getExpandedContentStateStyle(expanded: boolean): WebTransitionStyle {
  return {
    opacity: expanded ? 1 : 0,
    pointerEvents: expanded ? 'auto' : 'none',
    transform: [{ translateY: expanded ? 0 : 16 }],
    ...getWebTransition('opacity, transform', '180ms', 'ease-out')
  };
}

function getWebTransition(property: string, duration: string, timingFunction: string): WebTransitionStyle {
  if (Platform.OS !== 'web') {
    return {};
  }

  return {
    transitionDuration: duration,
    transitionProperty: property,
    transitionTimingFunction: timingFunction
  };
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flex: 1,
    overflow: 'hidden'
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    flexDirection: 'row',
    gap: 12,
    left: 22,
    minHeight: 66,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 22,
    zIndex: 9999
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
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0 -4px 14px rgba(0, 0, 0, 0.12)',
    left: 0,
    overflow: 'hidden',
    paddingBottom: 20,
    paddingHorizontal: 22,
    position: 'absolute',
    right: 0,
    zIndex: 9999
  },
  drawerHandleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24
  },
  drawerHandle: {
    backgroundColor: '#b7c9cc',
    borderRadius: 999,
    height: 4,
    width: 48
  },
  drawerBody: {
    flex: 1
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  sheetTitle: {
    color: '#1f2529',
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 30
  },
  closeButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  closeText: {
    color: '#11181c',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24
  },
  expandedContent: {
    flex: 1,
    gap: 12
  },
  filterContent: {
    gap: 24,
    paddingBottom: 14
  },
  categoryTitle: {
    color: '#4c5960',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 13,
    textTransform: 'uppercase'
  },
  distanceSection: {
    gap: 11
  },
  distanceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  distanceValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900'
  },
  sliderTrack: {
    backgroundColor: '#c8d5d8',
    borderRadius: 999,
    height: 4,
    justifyContent: 'center',
    marginHorizontal: 8
  },
  sliderFill: {
    backgroundColor: colors.text,
    borderRadius: 999,
    height: 4,
    width: '66%'
  },
  sliderThumb: {
    backgroundColor: colors.text,
    borderColor: '#ffffff',
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    left: '64%',
    position: 'absolute',
    width: 18
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  sliderLabel: {
    color: '#4c5960',
    fontSize: 10,
    lineHeight: 14
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: '#c8f7fa',
    borderColor: colors.primary,
    borderRadius: 9,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: 9,
    flex: 1,
    justifyContent: 'center',
    minHeight: 46
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  resultsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  resultsTitle: {
    color: '#1f2529',
    flex: 1,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 27
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: '#eceeef',
    borderColor: '#d8dee1',
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 13
  },
  filterButtonIcon: {
    color: '#4c5960',
    fontSize: 14,
    fontWeight: '900'
  },
  filterButtonText: {
    color: '#2b3337',
    fontSize: 13,
    fontWeight: '700'
  },
  stationList: {
    gap: 12,
    paddingBottom: 24
  },
  stationCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dce4e7',
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 20
  },
  stationName: {
    color: '#25292d',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 26
  },
  stationAddress: {
    color: '#6b767b',
    fontSize: 16,
    lineHeight: 22
  },
  connectorList: {
    gap: 6,
    marginTop: 4
  },
  connectorRow: {
    alignItems: 'center',
    backgroundColor: '#f8f8f9',
    borderColor: '#eceff1',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 33,
    paddingLeft: 10,
    paddingRight: 14
  },
  connectorLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9
  },
  connectorIcon: {
    alignItems: 'center',
    backgroundColor: '#e9fbfc',
    borderRadius: 14,
    height: 27,
    justifyContent: 'center',
    width: 27
  },
  connectorIconText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900'
  },
  connectorName: {
    color: '#2b3337',
    fontSize: 12,
    fontWeight: '900'
  },
  connectorMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  connectorSpeed: {
    color: '#4e5d63',
    fontSize: 8,
    lineHeight: 11
  },
  connectorDivider: {
    backgroundColor: '#cdd6da',
    height: 14,
    width: 1
  },
  connectorTotal: {
    color: '#4e5d63',
    fontSize: 12,
    lineHeight: 16
  },
  detailTitle: {
    color: '#1f2529',
    flex: 1,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 27,
    paddingRight: 8
  }
});
