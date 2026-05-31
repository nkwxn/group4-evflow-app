import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@evflow/ui';
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

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34
  },
  body: {
    color: '#4a555a',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center'
  }
});
