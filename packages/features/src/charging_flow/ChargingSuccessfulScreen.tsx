import { View, Text, Pressable, ScrollView, Image, type ImageSourcePropType } from 'react-native';
import { useNavigate } from 'react-router';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { ChargingFlowIcon } from './components/ChargingFlowIcon';
import chargingCompleteTickPng from '../assets/images/charging-complete-tick.png';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { ChargingFlowHeader } from './components/ChargingFlowHeader';

export function ChargingSuccessfulScreen() {
  const navigate = useNavigate();
  const insets = useAppSafeAreaInsets();

  return (
    <View style={styles.page}>
      <ChargingFlowHeader
        title="Charging Successful"
        onBack={() => navigate(-1)}
        rightIconName="help"
        rightIconColor="#00696F"
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}>
        <View style={styles.successIconWrap}>
          <Image source={chargingCompleteTickPng as unknown as ImageSourcePropType} style={{ width: 80, height: 80 }} />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.successTitle}>Charging Successful</Text>
          <Text style={styles.successSubtitle}>Session ended securely • Station: SPKLU PLN Sukses</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TOTAL ENERGY DELIVERED</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>16.50</Text>
              <Text style={{ fontSize: 14, color: '#465359', fontWeight: '700', marginTop: 4 }}>kWh</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>CHARGING DURATION</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricValue}>22</Text>
              <Text style={{ fontSize: 14, color: '#465359', fontWeight: '700', marginTop: 4, marginRight: 4 }}>m</Text>
              <Text style={styles.metricValue}>14</Text>
              <Text style={{ fontSize: 14, color: '#465359', fontWeight: '700', marginTop: 4 }}>s</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.metricValueRow, { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#dee4e6', paddingBottom: 16, gap: 6 }]}>
            <ChargingFlowIcon name="receipt" size={16} />
            <Text style={styles.metricLabel}>TRANSACTION SETTLEMENT</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Initial Deposit (for 20.00 kWh)</Text>
            <Text style={styles.summaryLabel}>Rp 51,820</Text>
          </View>
          
          <View style={styles.totalAmountRow}>
            <Text style={styles.summaryLabel}>Actual Cost (for 16.50 kWh)</Text>
            <Text style={styles.totalLabel}>Rp 43,189</Text>
          </View>

          <View style={styles.refundCard}>
            <ChargingFlowIcon name="piggy" size={24} />
            <Text style={styles.refundCardText}>Refund Amount Rp 8,631</Text>
          </View>
        </View>

        <View style={styles.walletUpdateCard}>
          <View style={styles.walletIconBadge}>
            <ChargingFlowIcon name="wallet_bg" size={16} color="#ffffff" />
          </View>
          <View style={styles.walletUpdateTextWrap}>
            <Text style={styles.walletUpdateText}>
              Unused kWh balance has been instantly credited back to your <Text style={{ fontWeight: '800' }}>EV-Wallet</Text>.
            </Text>
            <Text style={styles.metricLabel}>
              <Text style={{ color: '#955a15' }}>UPDATED BALANCE:</Text> <Text style={{ color: '#955a15', fontSize: 16 }}>Rp 206,811</Text>
            </Text>
          </View>
        </View>

        <View style={styles.footerSpacer} />

        <View style={styles.footerAction}>
          <Pressable style={styles.primaryButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Text style={styles.primaryButtonText}>VIEW CONSOLIDATED RECEIPT</Text>
              <ChargingFlowIcon name="download" size={16} color="#004a4f" />
            </View>
          </Pressable>
          <Pressable onPress={() => navigate('/ev-driver/map')}>
            <Text style={styles.backLink}>BACK TO MAP DISCOVERY</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
