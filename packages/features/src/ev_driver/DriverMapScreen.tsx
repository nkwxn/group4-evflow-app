import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation, PanResponder, Platform, Pressable, ScrollView, Text, TextInput, UIManager, View, useWindowDimensions, type ViewStyle } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, driverMapStyles as styles, LeafletMap } from '@evflow/ui';
import { fetchConnectorTypes, fetchNearbyStations, fetchSpeedTiers, fetchStations, type ConnectorTypeApiItem, type SpeedTierApiItem, type StationApiItem } from '@evflow/shared';
import { getUserLocation } from './utils/location';
import { FilterCategory, type FilterOption } from './components/FilterCategory';
import { locationPinSvg } from './components/locationPinSvg';
import { PlatformSlider } from '../shared/PlatformSlider';
import searchIcon from '../assets/images/search-icon.svg?raw';
import lightningIcon from '../assets/images/lightning-icon.svg?raw';
import filterSettingIcon from '../assets/images/filter-setting.svg?raw';
import closeButtonIcon from '../assets/images/close-button-icon.svg?raw';
import { SvgAssetIcon } from '../shared/SvgAssetIcon';

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
  distanceKm?: number;
  latitude: number;
  longitude: number;
  name: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type MapViewState = {
  center: Coordinates;
  zoom: number;
};

const defaultStationLimit = 1000;
const defaultDistanceKm = 8;
const distanceOptions = [3, 5, 8, 10] as const;
const defaultMapView: MapViewState = {
  center: {
    latitude: -6.1754,
    longitude: 106.8272
  },
  zoom: 13
};
export function DriverMapScreen({ bottomOffset = 0, topInset = 0 }: DriverMapScreenProps) {
  const { height, width } = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('results');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [connectorTypes, setConnectorTypes] = useState<string[]>([]);
  const [chargingSpeeds, setChargingSpeeds] = useState<string[]>([]);
  const [appliedConnectorTypes, setAppliedConnectorTypes] = useState<ConnectorTypeApiItem[]>([]);
  const [appliedChargingSpeeds, setAppliedChargingSpeeds] = useState<SpeedTierApiItem[]>([]);
  const [distanceKm, setDistanceKm] = useState(defaultDistanceKm);
  const [appliedDistanceKm, setAppliedDistanceKm] = useState(defaultDistanceKm);
  const [connectorTypeOptions, setConnectorTypeOptions] = useState<ConnectorTypeApiItem[]>([]);
  const [speedTierOptions, setSpeedTierOptions] = useState<SpeedTierApiItem[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [stationsError, setStationsError] = useState<string | null>(null);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationResolved, setLocationResolved] = useState(false);
  const [mapView, setMapView] = useState<MapViewState>(defaultMapView);
  const previousMapViewRef = useRef<MapViewState>(defaultMapView);
  const previousResultsExpandedRef = useRef(false);
  const selectedStationRef = useRef<Station | null>(selectedStation);
  const expandedRef = useRef(expanded);
  useEffect(() => {
    selectedStationRef.current = selectedStation;
  }, [selectedStation]);

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
    let mounted = true;

    (async () => {
      const coords = await getUserLocation();
      if (!mounted) {
        return;
      }

      setUserLocation(coords);
      if (coords && !selectedStationRef.current) {
        const userMapView = {
          center: coords,
          zoom: 14
        };
        setMapView(userMapView);
        previousMapViewRef.current = userMapView;
      }
      setLocationResolved(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadFilters() {
      try {
        const [nextConnectorTypes, nextSpeedTiers] = await Promise.all([
          fetchConnectorTypes(),
          fetchSpeedTiers()
        ]);
        if (mounted) {
          setConnectorTypeOptions(nextConnectorTypes);
          setSpeedTierOptions(nextSpeedTiers);
        }
      } catch (error) {
        // ignore filter errors or handle if needed
      }
    }

    loadFilters();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!locationResolved) {
      return;
    }

    let mounted = true;

    async function loadStations() {
      setStationsLoading(true);
      setStationsError(null);

      try {
        const nextStations = await loadSpkluStations({
          chargingSpeeds: appliedChargingSpeeds,
          connectorTypes: appliedConnectorTypes,
          distanceKm: appliedDistanceKm,
          userLocation
        });

        if (mounted) {
          setStations(nextStations);
        }
      } catch (error) {
        if (mounted) {
          setStationsError(error instanceof Error ? error.message : 'Unable to load nearby SPKLU stations.');
        }
      } finally {
        if (mounted) {
          setStationsLoading(false);
        }
      }
    }

    loadStations();

    return () => {
      mounted = false;
    };
  }, [appliedChargingSpeeds, appliedConnectorTypes, appliedDistanceKm, locationResolved, userLocation]);

  const connectorFilterOptions = useMemo<FilterOption[]>(
    () =>
      connectorTypeOptions.map((connector) => ({
        key: connector.name,
        label: connector.name
      })),
    [connectorTypeOptions]
  );
  const speedFilterOptions = useMemo<FilterOption[]>(
    () =>
      speedTierOptions.map((speedTier) => ({
        key: speedTier.id,
        label: speedTier.label,
        description: `${formatPowerRange(speedTier)} - ${speedTier.count} stations`
      })),
    [speedTierOptions]
  );

  const stationMarkers = useMemo(
    () =>
      stations.map((station) => ({
        id: station.id,
        label: station.name,
        latitude: station.latitude,
        longitude: station.longitude
      })),
    [stations]
  );
  const stationMarkerIcon = useMemo(() => colorSvg(locationPinSvg, colors.text), []);
  const detailSheetHeight = width < 768 ? Math.floor((height - bottomOffset) / 2) : undefined;
  const filterSheetHeight = width < 768 ? getMobileFilterSheetHeight(height, topInset, bottomOffset) : undefined;
  const openStationDetail = (station: Station) => {
    if (!selectedStation) {
      previousMapViewRef.current = mapView;
      previousResultsExpandedRef.current = expanded;
    }

    animateNext();
    setSelectedStation(station);
    const latOffset = width < 768 ? 0.008 : 0;

    setMapView({
      center: {
        latitude: station.latitude - latOffset,
        longitude: station.longitude
      },
      zoom: 15
    });
    setDrawerMode('detail');
    setExpanded(true);
  };
  const closeStationDetail = () => {
    animateNext();
    setSelectedStation(null);
    setMapView(previousMapViewRef.current);
    setDrawerMode('results');
    setExpanded(previousResultsExpandedRef.current);
  };

  return (
    <View style={styles.page}>
      <LeafletMap
        center={mapView.center}
        currentLocation={userLocation}
        markerIconSvg={stationMarkerIcon}
        markers={stationMarkers}
        onMarkerPress={(stationId) => {
          const station = stations.find((currentStation) => currentStation.id === stationId);

          if (!station) {
            return;
          }

          openStationDetail(station);
        }}
        showCurrentLocationPinpoint
        zoom={mapView.zoom}
      />

      <View style={[styles.searchBar, { top: 24 + topInset }]}>
        <View style={styles.searchIcon}>
          <SvgAssetIcon color="#6B7A7B" height={18} name="search" svg={searchIcon} width={18} />
        </View>
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
          <SvgAssetIcon color="#005F64" height={18} svg={filterSettingIcon} width={18} />
        </Pressable>
      </View>

        <View style={[styles.sheet, getSheetStateStyle(drawerMode, expanded, detailSheetHeight, filterSheetHeight), { bottom: bottomOffset }]} {...drawerPanResponder.panHandlers}>
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
              chargingSpeedOptions={speedFilterOptions}
              connectorTypes={connectorTypes}
              connectorTypeOptions={connectorFilterOptions}
              distanceKm={distanceKm}
              expanded={expanded}
              onApply={() => {
                animateNext();
                setAppliedChargingSpeeds(getSelectedSpeedTiers(chargingSpeeds, speedTierOptions));
                setAppliedConnectorTypes(getSelectedConnectorTypes(connectorTypes, connectorTypeOptions));
                setAppliedDistanceKm(distanceKm);
                setDrawerMode('results');
                setSelectedStation(null);
                setExpanded(true);
              }}
              onClose={() => {
                animateNext();
                setDrawerMode('results');
                setExpanded(false);
              }}
              onReset={() => {
                resetFilters(setConnectorTypes, setChargingSpeeds, setDistanceKm);
                animateNext();
                setAppliedChargingSpeeds([]);
                setAppliedConnectorTypes([]);
                setAppliedDistanceKm(defaultDistanceKm);
                setDrawerMode('results');
                setSelectedStation(null);
                setExpanded(true);
              }}
              onSelectDistance={setDistanceKm}
              onToggleChargingSpeed={(key) => toggleSelected(key, chargingSpeeds, setChargingSpeeds)}
              onToggleConnectorType={(key) => toggleSelected(key, connectorTypes, setConnectorTypes)}
              onScroll={handleScroll}
            />
          ) : null}

          {drawerMode === 'results' ? (
            <ResultsDrawer
              expanded={expanded}
              loading={stationsLoading}
              onFilter={() => {
                animateNext();
                setDrawerMode('filter');
                setExpanded(true);
              }}
              onSelectStation={(station) => {
                openStationDetail(station);
              }}
              onScroll={handleScroll}
              stations={stations}
              stationsError={stationsError}
            />
          ) : null}

          {drawerMode === 'detail' && selectedStation ? (
            <StationDetailDrawer
              expanded={expanded}
              onScroll={handleScroll}
              station={selectedStation}
              onClose={closeStationDetail}
            />
          ) : null}
        </View>
    </View>
  );
}

type FilterDrawerProps = {
  chargingSpeeds: string[];
  chargingSpeedOptions: FilterOption[];
  connectorTypes: string[];
  connectorTypeOptions: FilterOption[];
  distanceKm: number;
  expanded: boolean;
  onApply: () => void;
  onClose: () => void;
  onReset: () => void;
  onSelectDistance: (distanceKm: number) => void;
  onToggleChargingSpeed: (key: string) => void;
  onToggleConnectorType: (key: string) => void;
  onScroll?: (e: any) => void;
};

function FilterDrawer({
  chargingSpeeds,
  chargingSpeedOptions,
  connectorTypes,
  connectorTypeOptions,
  distanceKm,
  expanded,
  onApply,
  onClose,
  onReset,
  onSelectDistance,
  onToggleChargingSpeed,
  onToggleConnectorType,
  onScroll
}: FilterDrawerProps) {
  return (
    <View style={styles.drawerBody}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Filter</Text>
        <Pressable accessibilityLabel="Close filter" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <SvgAssetIcon color="#191C1D" height={14} svg={closeButtonIcon} width={14} />
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
            options={connectorTypeOptions}
            selectedKeys={connectorTypes}
            onToggle={onToggleConnectorType}
          />

          <FilterCategory
            title="Charging Speed"
            variant="card"
            options={chargingSpeedOptions}
            selectedKeys={chargingSpeeds}
            onToggle={onToggleChargingSpeed}
          />

          <View style={styles.distanceSection}>
            <View style={styles.distanceHeader}>
              <Text style={styles.categoryTitle}>Distance</Text>
              <Text style={styles.distanceValue}>{distanceKm} km</Text>
            </View>
            <PlatformSlider
              style={{ width: '100%', height: 40, marginTop: 8 }}
              minimumValue={0}
              maximumValue={distanceOptions.length - 1}
              step={1}
              value={distanceOptions.indexOf(distanceKm as any) >= 0 ? distanceOptions.indexOf(distanceKm as any) : 0}
              onValueChange={(value) => onSelectDistance(distanceOptions[value])}
              minimumTrackTintColor="#0bb2b2"
              maximumTrackTintColor="#dde5e8"
              thumbTintColor="#0bb2b2"
            />
            <View style={styles.sliderLabels}>
              {distanceOptions.map((option) => (
                <Pressable accessibilityRole="button" key={option} onPress={() => onSelectDistance(option)}>
                  <Text style={[styles.sliderLabel, option === distanceKm && styles.sliderLabelSelected]}>{option} km</Text>
                </Pressable>
              ))}
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
  loading: boolean;
  onFilter: () => void;
  onSelectStation: (station: Station) => void;
  onScroll?: (e: any) => void;
  stations: Station[];
  stationsError: string | null;
};

function ResultsDrawer({ expanded, loading, onFilter, onSelectStation, onScroll, stations, stationsError }: ResultsDrawerProps) {
  return (
    <View style={styles.drawerBody}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Nearby SPKLU Stations</Text>
        <Pressable accessibilityRole="button" onPress={onFilter} style={styles.filterButton}>
          <SvgAssetIcon color="#4c5960" height={14} svg={filterSettingIcon} width={14} />
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
          {loading ? <Text style={styles.stationAddress}>Loading nearby SPKLU stations...</Text> : null}
          {!loading && stationsError ? <Text style={styles.stationAddress}>{stationsError}</Text> : null}
          {!loading && !stationsError && stations.length === 0 ? <Text style={styles.stationAddress}>No nearby SPKLU stations found.</Text> : null}
          {!loading && !stationsError
            ? stations.map((station) => <StationCard key={station.id} station={station} onPress={() => onSelectStation(station)} />)
            : null}
        </ScrollView>
      </View>
    </View>
  );
}

type StationDetailDrawerProps = {
  expanded: boolean;
  station: Station;
  onClose: () => void;
  onScroll?: (e: any) => void;
};

function StationDetailDrawer({ expanded, station, onClose, onScroll }: StationDetailDrawerProps) {
  return (
    <View style={styles.drawerBody}>
      <View style={styles.sheetHeader}>
        <Text numberOfLines={1} style={styles.detailTitle}>
          {station.name.replace(' Hub', '')}
        </Text>
        <Pressable accessibilityLabel="Close station detail" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <SvgAssetIcon color="#191C1D" height={14} svg={closeButtonIcon} width={14} />
        </Pressable>
      </View>

      <View style={[styles.expandedContent, getExpandedContentStateStyle(expanded)]}>
        <ScrollView
          contentContainerStyle={styles.stationDetailContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          <Text style={styles.stationAddress}>{station.address}</Text>
          <View style={styles.connectorList}>
            {station.connectors.map((connector) => (
              <ConnectorRow connector={connector} key={connector.label} />
            ))}
          </View>
        </ScrollView>
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
      {station.distanceKm !== undefined ? <Text style={styles.connectorSpeed}>{station.distanceKm.toFixed(1)} km away</Text> : null}
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
          <SvgAssetIcon color="#00696F" height={17} name="lightning" svg={lightningIcon} width={15} />
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

type LoadSpkluStationsOptions = {
  chargingSpeeds?: SpeedTierApiItem[];
  connectorTypes?: ConnectorTypeApiItem[];
  distanceKm?: number;
  userLocation?: Coordinates | null;
};

async function loadSpkluStations({
  chargingSpeeds = [],
  connectorTypes = [],
  distanceKm,
  userLocation
}: LoadSpkluStationsOptions = {}) {
  const connectorFilters = connectorTypes.filter((connector) => connector.name);
  const speedFilters = chargingSpeeds.filter((speedTier) => speedTier.id);
  const isReset = connectorFilters.length === 0 && speedFilters.length === 0 && distanceKm === defaultDistanceKm;

  if (isReset || !userLocation) {
    const response = await fetchStations({
      connectorType: connectorFilters,
      limit: defaultStationLimit,
      speedTier: speedFilters
    });
    const stationsById = new Map<string, Station>();
    response.items.forEach((item) => {
      const station = toStation(item);
      stationsById.set(station.id, station);
    });
    return Array.from(stationsById.values());
  }

  const response = await fetchNearbyStations({
    lat: userLocation.latitude,
    lon: userLocation.longitude,
    radius: distanceKm ?? defaultDistanceKm,
    connectorType: connectorFilters,
    speedTier: speedFilters,
    limit: 200
  });

  const stationsById = new Map<string, Station>();
  response.forEach((item) => {
    const station = toStation(item);
    stationsById.set(station.id, station);
  });
  return Array.from(stationsById.values()).sort((left, right) => (left.distanceKm ?? 0) - (right.distanceKm ?? 0));
}

function toStation(item: StationApiItem): Station {
  const addressParts = [item.address, item.city, item.province].filter(Boolean);
  const connectorLabels = item.connector_types.length ? item.connector_types : ['Unknown connector'];

  return {
    id: item.id,
    address: addressParts.join(', ') || 'Address not available',
    connectors: connectorLabels.map((label) => ({
      label,
      speed: formatSpeedTier(item.speed_tier),
      total: item.connectors ?? 1
    })),
    distanceKm: item.distance_km ?? undefined,
    latitude: item.latitude,
    longitude: item.longitude,
    name: item.name ?? 'Unnamed SPKLU Station'
  };
}

function formatSpeedTier(speedTier: string | null) {
  if (!speedTier) {
    return 'UNKNOWN';
  }

  return speedTier.replace(/_/g, '-').toUpperCase();
}

function formatPowerRange(speedTier: SpeedTierApiItem) {
  if (speedTier.max_kw === null) {
    return `Over ${formatKw(speedTier.min_kw)} kW`;
  }

  if (speedTier.min_kw === 0) {
    return `Up to ${formatKw(speedTier.max_kw)} kW`;
  }

  return `${formatKw(speedTier.min_kw)} - ${formatKw(speedTier.max_kw)} kW`;
}

function formatKw(value: number) {
  return Number.isInteger(value) ? String(value) : String(value);
}

function toBoundingBox(center: Coordinates, radiusKm: number) {
  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.cos((center.latitude * Math.PI) / 180));

  return [
    center.longitude - lonDelta,
    center.latitude - latDelta,
    center.longitude + lonDelta,
    center.latitude + latDelta
  ].join(',');
}

function colorSvg(svg: string, color: string) {
  return svg
    .replace(/<path /g, `<path fill="${color}" `)
    .replace('<svg ', '<svg width="30" height="34" style="display:block" ');
}

function getDistancePercent(distanceKm: number) {
  const index = distanceOptions.findIndex((option) => option === distanceKm);
  const fallbackIndex = distanceOptions.findIndex((option) => option === defaultDistanceKm);
  const safeIndex = index >= 0 ? index : fallbackIndex;

  return (safeIndex / (distanceOptions.length - 1)) * 100;
}

function getMobileFilterSheetHeight(screenHeight: number, topInset: number, bottomOffset: number) {
  const searchBarBottom = topInset + 24 + 66 + 12;
  const availableMapHeight = screenHeight - bottomOffset;
  const maxHeightWithSearchVisible = screenHeight - bottomOffset - searchBarBottom;
  const cappedHeight = Math.min(availableMapHeight * 0.95, maxHeightWithSearchVisible);

  return Math.max(104, Math.floor(cappedHeight));
}

function toggleSelected(key: string, selectedKeys: string[], setSelectedKeys: (keys: string[]) => void) {
  setSelectedKeys(selectedKeys.includes(key) ? selectedKeys.filter((selectedKey) => selectedKey !== key) : [...selectedKeys, key]);
}

function getSelectedConnectorTypes(selectedKeys: string[], options: ConnectorTypeApiItem[]) {
  const optionsByName = new Map(options.map((option) => [option.name, option]));

  return selectedKeys
    .map((key) => optionsByName.get(key))
    .filter((option): option is ConnectorTypeApiItem => Boolean(option));
}

function getSelectedSpeedTiers(selectedKeys: string[], options: SpeedTierApiItem[]) {
  const optionsById = new Map(options.map((option) => [option.id, option]));

  return selectedKeys
    .map((key) => optionsById.get(key))
    .filter((option): option is SpeedTierApiItem => Boolean(option));
}

function resetFilters(
  setConnectorTypes: (keys: string[]) => void,
  setChargingSpeeds: (keys: string[]) => void,
  setDistanceKm: (distanceKm: number) => void
) {
  setConnectorTypes([]);
  setChargingSpeeds([]);
  setDistanceKm(defaultDistanceKm);
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

function getSheetStateStyle(mode: DrawerMode, expanded: boolean, detailSheetHeight?: number, filterSheetHeight?: number): WebTransitionStyle {
  const expandedHeights: Record<DrawerMode, number> = {
    detail: detailSheetHeight ?? 254,
    filter: filterSheetHeight ?? 430,
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
