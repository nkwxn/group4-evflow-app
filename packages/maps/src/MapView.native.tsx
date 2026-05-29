import { StyleSheet, Text, View } from 'react-native';
import type { MapMarker } from './types';

type MapViewProps = {
  markers: MapMarker[];
};

export function MapView({ markers }: MapViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native map placeholder</Text>
      <Text style={styles.body}>{markers.length} chargers ready for native map integration.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 220,
    padding: 16
  },
  title: {
    color: '#1e3a8a',
    fontSize: 18,
    fontWeight: '700'
  },
  body: {
    color: '#1e40af',
    marginTop: 8
  }
});

