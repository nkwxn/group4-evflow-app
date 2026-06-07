import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useNavigate } from 'react-router';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { useState } from 'react';
import { ChargingFlowIcon } from './components/ChargingFlowIcon';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { ChargingFlowHeader } from './components/ChargingFlowHeader';

export function InitializeChargingScreen() {
  const navigate = useNavigate();
  const insets = useAppSafeAreaInsets();
  const [energy, setEnergy] = useState('20');

  return (
    <View style={styles.page}>
      <ChargingFlowHeader
        title="Initialize Charging"
        onBack={() => navigate(-1)}
        rightIconName="close"
        rightIconColor="#191C1D"
        rightIconSize={18}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}>
        <View style={styles.stationInfoCard}>
          <Text style={styles.stationName}>SPKLU PLN Sukses - Thamrin</Text>
          <View style={[styles.stationBadge, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
            <ChargingFlowIcon name="lightning" size={12} color="#019495" />
            <Text style={styles.stationBadgeText}>ULTRA-FAST CHARGING (150 KW)</Text>
          </View>
          <View style={styles.stationAddressRow}>
            <ChargingFlowIcon name="location" size={16} color="#6B7A7B" />
            <Text style={styles.stationAddressText}>Jl. M.H. Thamrin No.1, Menteng, Kota Jakarta Pusat</Text>
          </View>
          <View style={styles.stationAddressRow}>
            <ChargingFlowIcon name="shield" size={16} color="#6B7A7B" />
            <Text style={styles.stationAddressText}>Owned & Operated by PLN</Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={styles.sectionTitle}>ENTER REQUIRED ENERGY</Text>
          <View style={styles.inputWrap}>
            <View style={styles.inputBox}>
              <TextInput
                value={energy}
                onChangeText={setEnergy}
                keyboardType="numeric"
                style={styles.inputValue}
              />
              <Text style={styles.inputUnit}>kWh</Text>
            </View>
            <Pressable style={styles.calculateButton}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Requested Energy</Text>
            <Text style={styles.summaryValue}>{energy}.00 kWh</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Rate</Text>
            <Text style={styles.summaryLabel}>Rp 2,466 / kWh</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Admin Fee</Text>
            <Text style={styles.summaryLabel}>Rp 2,500</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>TOTAL DUE</Text>
            <Text style={styles.totalValue}>Rp 51,820</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ fontSize: 16 }}>ⓘ</Text>
            <Text style={styles.summaryHelperText}>Estimated using current operator rates.</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>CONNECTOR</Text>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="connector" size={20} color="#00696F" />
              <Text style={styles.metricValue}>CCS Type 2</Text>
            </View>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>EST. TIME</Text>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="timer" size={20} color="#00696F" />
              <Text style={styles.metricValue}>12 Mins</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />

        <View style={styles.footerAction}>
          <Pressable style={styles.primaryButton} onPress={() => navigate('/charging-flow/success')}>
            <Text style={styles.primaryButtonText}>Confirm & Pay (Rp 51,820)</Text>
          </Pressable>
          <View style={styles.paymentMethodRow}>
            <ChargingFlowIcon name="wallet_bg" size={24} />
            <Text style={styles.paymentMethodText}>Paying via EV-Wallet • Balance: Rp 250,000</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
