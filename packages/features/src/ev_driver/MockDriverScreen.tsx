import { Text, View } from 'react-native';
import { mockDriverScreenStyles as styles } from '@evflow/ui';
import type { DriverTabKey } from './types';

type MockDriverScreenProps = {
  tabKey: Exclude<DriverTabKey, 'map'>;
  topInset?: number;
};

const labels: Record<Exclude<DriverTabKey, 'map'>, string> = {
  wallet: 'Wallet',
  scan: 'Scan',
  plan_route: 'Plan Route',
  profile: 'Profile'
};

export function MockDriverScreen({ tabKey, topInset = 0 }: MockDriverScreenProps) {
  return (
    <View style={[styles.page, { paddingTop: 24 + topInset }]}>
      <Text style={styles.title}>{labels[tabKey]}</Text>
      <Text style={styles.body}>This is a sandbox screen. The production UI for this menu has not been defined yet.</Text>
    </View>
  );
}
