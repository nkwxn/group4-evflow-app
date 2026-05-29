import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapView } from '@evflow/maps';
import { filterChargers, type Charger } from '@evflow/shared';
import { Button, Card, FilterPill, Screen } from '@evflow/ui';

const chargers: Charger[] = [
  {
    id: 'chg-001',
    name: 'Monash Caulfield Charging Hub',
    address: '900 Dandenong Road, Caulfield East',
    latitude: -37.877,
    longitude: 145.0443,
    status: 'available',
    connectorTypes: ['CCS2', 'Type 2'],
    maxPowerKw: 150
  },
  {
    id: 'chg-002',
    name: 'Clayton Library Fast Charger',
    address: '9 Cooke Street, Clayton',
    latitude: -37.9169,
    longitude: 145.1301,
    status: 'occupied',
    connectorTypes: ['CCS2'],
    maxPowerKw: 75
  }
];

export function HomeScreen() {
  const availableChargers = useMemo(
    () => filterChargers(chargers, { onlyAvailable: true, connectorTypes: ['CCS2'] }),
    []
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>EVFlow</Text>
        <Text style={styles.title}>Find reliable charging stops for your route.</Text>
        <Text style={styles.subtitle}>
          Shared TypeScript modules keep charger filtering, route planning, maps, and UI consistent across web, Android, and iOS.
        </Text>
      </View>

      <View style={styles.filters}>
        <FilterPill label="CCS2" selected />
        <FilterPill label="Available now" selected />
        <FilterPill label="150 kW+" />
      </View>

      <MapView
        markers={availableChargers.map((charger) => ({
          id: charger.id,
          title: charger.name,
          latitude: charger.latitude,
          longitude: charger.longitude
        }))}
      />

      <Card>
        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{availableChargers[0]?.name}</Text>
            <Text style={styles.cardBody}>{availableChargers[0]?.address}</Text>
          </View>
          <Button>Plan Route</Button>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8
  },
  kicker: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  title: {
    color: '#0f172a',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    maxWidth: 720
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 720
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cardContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between'
  },
  cardText: {
    flex: 1,
    gap: 4
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700'
  },
  cardBody: {
    color: '#475569',
    fontSize: 14
  }
});

