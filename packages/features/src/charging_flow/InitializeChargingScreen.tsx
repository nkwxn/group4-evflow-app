import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { useNavigate } from 'react-router';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { useState, useMemo } from 'react';
import { ChargingFlowIcon } from './components/ChargingFlowIcon';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { ChargingFlowHeader } from './components/ChargingFlowHeader';

const BASE_RATE = 2466;
const ADMIN_FEE = 2500;

function formatRupiah(value: number) {
  return value.toLocaleString('id-ID');
}

export function InitializeChargingScreen() {
  const navigate = useNavigate();
  const insets = useAppSafeAreaInsets();
  const [energy, setEnergy] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  const parsedEnergy = parseFloat(energy) || 0;
  const energyCost = parsedEnergy * BASE_RATE;
  const totalDue = energyCost + ADMIN_FEE;

  const estimatedMinutes = useMemo(() => {
    if (parsedEnergy <= 0) return 0;
    const chargingPowerKw = 150;
    return Math.ceil((parsedEnergy / chargingPowerKw) * 60);
  }, [parsedEnergy]);

  const handleCalculate = () => {
    if (parsedEnergy > 0) {
      setIsCalculated(true);
    }
  };

  const handleEnergyChange = (value: string) => {
    setEnergy(value);
    setIsCalculated(false);
  };

  const canConfirm = isCalculated && parsedEnergy > 0;

  return (
    <View style={styles.page}>
      <ChargingFlowHeader
        title="Initialize Charging"
        onBack={() => navigate('/charging-flow/scan')}
        rightIconName="close"
        rightIconColor="#191C1D"
        rightIconSize={18}
        onRightPress={() => navigate('/ev-driver/map')}
      />

      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom, paddingLeft: 24 + insets.left, paddingRight: 24 + insets.right }]}
        scrollIndicatorInsets={{ bottom: insets.bottom, left: insets.left, right: insets.right }}
      >
        <View style={styles.stationInfoCard}>
          <View style={styles.stationInfoCardHeader}>
            <View style={{ flex: 1, gap: 12 }}>
              <Text style={styles.stationName}>SPKLU PLN Sukses - Thamrin</Text>
              <View style={[styles.stationBadge, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
                <ChargingFlowIcon name="lightning" size={12} color="#019495" />
                <Text style={styles.stationBadgeText}>ULTRA-FAST CHARGING (150 KW)</Text>
              </View>
            </View>
            <View style={styles.stationInfoCardImage}>
              <ChargingFlowIcon name="lightning" size={24} color="#00696F" />
            </View>
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
                onChangeText={handleEnergyChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#b2bdc2"
                style={styles.inputValue}
              />
              <Text style={styles.inputUnit}>kWh</Text>
            </View>
            <Pressable style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Requested Energy</Text>
            <Text style={styles.summaryValue}>{isCalculated ? `${parsedEnergy.toFixed(2)} kWh` : '—'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Rate</Text>
            <Text style={styles.summaryLabel}>Rp {formatRupiah(BASE_RATE)} / kWh</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Admin Fee</Text>
            <Text style={styles.summaryLabel}>Rp {formatRupiah(ADMIN_FEE)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>TOTAL DUE</Text>
            <Text style={styles.totalValue}>{isCalculated ? `Rp ${formatRupiah(totalDue)}` : '—'}</Text>
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
              <Text style={styles.metricValue}>{isCalculated && estimatedMinutes > 0 ? `${estimatedMinutes} Mins` : '— Mins'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSpacer} />

        <View style={styles.footerAction}>
          <Pressable
            style={[styles.primaryButton, !canConfirm && styles.disabledPrimaryButton]}
            disabled={!canConfirm}
            onPress={() => navigate('/charging-flow/success')}
          >
            <Text style={styles.primaryButtonText}>
              {canConfirm ? `Confirm & Pay (Rp ${formatRupiah(totalDue)})` : 'Confirm & Pay'}
            </Text>
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
