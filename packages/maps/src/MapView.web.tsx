import { StyleSheet, Text, View } from 'react-native';
import type { MapMarker } from './types';

type MapViewProps = {
  markers: MapMarker[];
};

export function MapView({ markers }: MapViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Web map placeholder</Text>
      {markers.map((marker) => (
        <Text key={marker.id} style={styles.marker}>
          {marker.title} ({marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)})
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecfeff',
    borderColor: '#67e8f9',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 220,
    padding: 16
  },
  title: {
    color: '#155e75',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  marker: {
    color: '#164e63',
    marginTop: 4
  }
});

