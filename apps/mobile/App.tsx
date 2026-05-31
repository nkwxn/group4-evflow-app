import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@evflow/features';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <HomeScreen />
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
