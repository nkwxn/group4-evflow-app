import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation, PanResponder, Platform, Pressable, ScrollView, Text, TextInput, UIManager, View, type ViewStyle } from 'react-native';
import { driverMapStyles as styles, LeafletMap } from '@evflow/ui';
import { getUserLocation } from './utils/location';
import { FilterCategory } from './components/FilterCategory';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [expanded, setExpanded] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('results');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [connectorTypes, setConnectorTypes] = useState(['ccs2']);
  const [chargingSpeeds, setChargingSpeeds] = useState(['ultra']);
  const expandedRef = useRef(expanded);
  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  const isScrolledToTopRef = useRef(true);

  const handleScroll = (e: any) => {
    isScrolledToTopRef.current = e.nativeEvent.contentOffset.y <= 0;
  };

  const drawerPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isSwipingDown = gestureState.dy > 8;
          const isSwipingUp = gestureState.dy < -8;

          if (expandedRef.current) {
            if (isSwipingDown && isScrolledToTopRef.current) {
              return true;
            }
            return false;
          }

          return isSwipingDown || isSwipingUp;
        },
        onPanResponderRelease: (_, gestureState) => {
          updateSheetSizeFromDelta(gestureState.dy, setExpanded);
        }
      }),
    []
  );

  const animateNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  useEffect(() => {
    (async () => {
      const coords = await getUserLocation();
      if (coords) {
        console.log('User coordinates:', coords.latitude, coords.longitude);
        // TODO: API CALL HERE to load nearby SPKLU stations using the user's coordinates.
      }
    })();
  }, []);
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
            animateNext();
            setDrawerMode('filter');
            setExpanded(true);
          }}
          style={styles.filterIcon}
        >
          <Text style={styles.filterIconText}>#</Text>
        </Pressable>
      </View>

        <View style={[styles.sheet, getSheetStateStyle(drawerMode, expanded), { bottom: bottomOffset }]} {...drawerPanResponder.panHandlers}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            onPress={() => {
              animateNext();
              setExpanded((current) => !current);
            }}
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
                // TODO: API CALL HERE to refresh nearby SPKLU station list based on filters
                animateNext();
                setDrawerMode('results');
                setSelectedStation(null);
                setExpanded(true);
              }}
              onClose={() => {
                animateNext();
                setDrawerMode('results');
                setExpanded(false);
              }}
              onReset={() => resetFilters(setConnectorTypes, setChargingSpeeds)}
              onToggleChargingSpeed={(key) => toggleSelected(key, chargingSpeeds, setChargingSpeeds)}
              onToggleConnectorType={(key) => toggleSelected(key, connectorTypes, setConnectorTypes)}
              onScroll={handleScroll}
            />
          ) : null}

          {drawerMode === 'results' ? (
            <ResultsDrawer
              expanded={expanded}
              onFilter={() => {
                animateNext();
                setDrawerMode('filter');
                setExpanded(true);
              }}
              onSelectStation={(station) => {
                animateNext();
                setSelectedStation(station);
                setDrawerMode('detail');
                setExpanded(true);
              }}
              onScroll={handleScroll}
            />
          ) : null}

          {drawerMode === 'detail' && selectedStation ? (
            <StationDetailDrawer
              expanded={expanded}
              station={selectedStation}
              onClose={() => {
                animateNext();
                setDrawerMode('results');
                setExpanded(true);
              }}
            />
          ) : null}
        </View>
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
  onScroll?: (e: any) => void;
};

function FilterDrawer({
  chargingSpeeds,
  connectorTypes,
  expanded,
  onApply,
  onClose,
  onReset,
  onToggleChargingSpeed,
  onToggleConnectorType,
  onScroll
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
        <ScrollView
          contentContainerStyle={styles.filterContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
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
  onScroll?: (e: any) => void;
};

function ResultsDrawer({ expanded, onFilter, onSelectStation, onScroll }: ResultsDrawerProps) {
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
        <ScrollView
          contentContainerStyle={styles.stationList}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
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



function toggleSelected(key: string, selectedKeys: string[], setSelectedKeys: (keys: string[]) => void) {
  setSelectedKeys(selectedKeys.includes(key) ? selectedKeys.filter((selectedKey) => selectedKey !== key) : [...selectedKeys, key]);
}

function resetFilters(setConnectorTypes: (keys: string[]) => void, setChargingSpeeds: (keys: string[]) => void) {
  setConnectorTypes([]);
  setChargingSpeeds([]);
}

function updateSheetSizeFromDelta(deltaY: number, setExpanded: React.Dispatch<React.SetStateAction<boolean>>) {
  setExpanded(current => {
    if (deltaY > 18 && current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return false;
    }
    if (deltaY < -18 && !current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return true;
    }
    return current;
  });
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
