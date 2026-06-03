import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigate } from 'react-router';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { ChargingFlowIcon } from './components/ChargingFlowIcon';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';

export function ChargingStatusScreen() {
  const navigate = useNavigate();
  const insets = useAppSafeAreaInsets();

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => navigate(-1)} style={styles.backButton}>
          <ChargingFlowIcon name="leftArrow" size={24} color="#005F64" />
        </Pressable>
        <Text style={styles.headerTitle}>Charging Status</Text>
        <View style={styles.headerRight}>
          <ChargingFlowIcon name="help" size={20} color="#00696F" />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}>
        <View style={styles.chargingActiveHeader}>
          <Text style={styles.chargingActiveText}>● CHARGING SESSION ACTIVE</Text>
          <Text style={styles.chargingStationName}>Station: SPKLU PLN Sukses - Thamrin • Connector 02</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>65%</Text>
            <Text style={styles.progressLabel}>CHARGED</Text>
            <View style={styles.progressSublabel}>
              <Text style={styles.progressSublabelText}>13.00 / 20.00 kWh purchased</Text>
            </View>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="wallet" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>AMOUNT UTILIZED</Text>
            </View>
            <Text style={styles.metricValue}>Rp 33,683</Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="timer" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>EST. TIME LEFT</Text>
            </View>
            <Text style={[styles.metricValue, { lineHeight: 28 }]}>14 mins remaining</Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="lightning" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>DELIVERY POWER</Text>
            </View>
            <Text style={styles.metricValue}>142 kW</Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="connector" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>OUTPUT RATE</Text>
            </View>
            <Text style={[styles.metricValue, { lineHeight: 28 }]}>400V / 355A</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={{ fontSize: 20, color: '#019495', marginTop: 2 }}>ⓘ</Text>
          <Text style={styles.infoCardText}>
            Your charging session will automatically pause once it hits your purchased target of 20.00 kWh to protect battery health.
          </Text>
        </View>

        <View style={styles.footerSpacer} />

        <View style={styles.footerAction}>
          <Pressable style={styles.dangerButton} onPress={() => navigate('/charging-flow/successful')}>
            <ChargingFlowIcon name="stop" size={20} color="#ffffff" />
            <Text style={styles.dangerButtonText}>STOP CHARGING SESSION</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
