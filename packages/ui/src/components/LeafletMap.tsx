import { useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { leafletMapStyles as styles } from '../styles/styles';

type LeafletMapProps = {
  center?: {
    latitude: number;
    longitude: number;
  };
  markers?: LeafletMapMarker[];
  showCurrentLocationPinpoint?: boolean;
  zoom?: number;
};

type LeafletMapMarker = {
  id: string;
  label?: string;
  latitude: number;
  longitude: number;
};

const defaultCenter = {
  latitude: -6.1754,
  longitude: 106.8272
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function LeafletMap({ center = defaultCenter, markers = [], showCurrentLocationPinpoint = false, zoom = 13 }: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const html = useMemo(
    () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; background-color: #d7dbdc; }
          html, body, #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: false,
            attributionControl: true,
            center: [${center.latitude}, ${center.longitude}],
            zoom: ${zoom}
          });
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
          }).addTo(map);

          ${markers
            .map(
              (marker) => `
          L.circleMarker([${marker.latitude}, ${marker.longitude}], {
            color: '#ffffff',
            fillColor: '#007a80',
            fillOpacity: 1,
            radius: 10,
            weight: 3
          }).addTo(map).bindPopup(${JSON.stringify(marker.label ?? 'Selected station')});
          `
            )
            .join('')}
          
          var userMarker = null;
          window.setUserLocation = function(latitude, longitude) {
            var coordinates = [latitude, longitude];

            if (!userMarker) {
              userMarker = L.circleMarker(coordinates, {
                color: '#ffffff',
                fillColor: '#00E0EB',
                fillOpacity: 1,
                radius: 9,
                weight: 3
              }).addTo(map).bindPopup('Your current location');
            } else {
              userMarker.setLatLng(coordinates);
            }

            map.setView(coordinates, Math.max(${zoom}, 14));
          };
          
          // Re-center map when props change via reloading html
        </script>
      </body>
    </html>
  `,
    [center.latitude, center.longitude, markers, zoom]
  );

  useEffect(() => {
    if (!showCurrentLocationPinpoint) {
      return;
    }

    let mounted = true;

    async function requestLocation() {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!mounted || permission.status !== Location.PermissionStatus.GRANTED) {
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      if (mounted) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }
    }

    requestLocation();

    return () => {
      mounted = false;
    };
  }, [showCurrentLocationPinpoint]);

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    webViewRef.current?.injectJavaScript(`
      window.setUserLocation(${userLocation.latitude}, ${userLocation.longitude});
      true;
    `);
  }, [userLocation]);

  return (
    <View style={styles.container}>
      <WebView 
        ref={webViewRef}
        source={{ html }} 
        originWhitelist={['*']}
        style={styles.map} 
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
}
