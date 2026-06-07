import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigate } from 'react-router';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { ChargingFlowIcon } from './components/ChargingFlowIcon';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { ChargingFlowHeader } from './components/ChargingFlowHeader';

const purchasedKwh = 20;
const fastChargeTarget = 80;
const fastChargeDurationMs = 6000;
const slowChargeDurationMs = 10000;
const simulationTickMs = 100;
const pricePerKwh = 2591;
const fastDeliveryPowerKw = 142;
const slowDeliveryPowerKw = 38;

export function ChargingStatusScreen() {
  const navigate = useNavigate();
  const insets = useAppSafeAreaInsets();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;

      if (elapsed <= fastChargeDurationMs) {
        setProgress((elapsed / fastChargeDurationMs) * fastChargeTarget);
        return;
      }

      const slowElapsed = elapsed - fastChargeDurationMs;
      const slowProgress = Math.min(slowElapsed / slowChargeDurationMs, 1);
      const nextProgress = fastChargeTarget + slowProgress * (100 - fastChargeTarget);

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
      }
    }, simulationTickMs);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) {
      return;
    }

    const timeout = setTimeout(() => {
      navigate('/charging-flow/successful', { replace: true });
    }, 500);

    return () => clearTimeout(timeout);
  }, [navigate, progress]);

  const chargingMetrics = useMemo(() => {
    const roundedProgress = Math.min(Math.round(progress), 100);
    const deliveredKwh = (purchasedKwh * progress) / 100;
    const amountUtilized = Math.round(deliveredKwh * pricePerKwh);
    const isTapering = progress >= fastChargeTarget;
    const deliveryPower = isTapering ? slowDeliveryPowerKw : fastDeliveryPowerKw;
    const remainingMs =
      progress < fastChargeTarget
        ? ((fastChargeTarget - progress) / fastChargeTarget) * fastChargeDurationMs + slowChargeDurationMs
        : ((100 - progress) / (100 - fastChargeTarget)) * slowChargeDurationMs;
    const remainingMinutes = Math.max(Math.ceil(remainingMs / 60000), 0);

    return {
      amountUtilized,
      deliveredKwh,
      deliveryPower,
      outputRate: isTapering ? '400V / 95A' : '400V / 355A',
      remainingMinutes,
      roundedProgress
    };
  }, [progress]);

  const ringStyle = {
    backgroundImage: `conic-gradient(#01e0f0 ${progress * 3.6}deg, #dce7eb 0deg)`
  } as unknown as View['props']['style'];

  return (
    <View style={styles.page}>
      <ChargingFlowHeader
        title="Charging Status"
        onBack={() => navigate(-1)}
        rightIconName="help"
        rightIconColor="#00696F"
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}>
        <View style={styles.chargingActiveHeader}>
          <Text style={styles.chargingActiveText}>● CHARGING SESSION ACTIVE</Text>
          <Text style={styles.chargingStationName}>Station: SPKLU PLN Sukses - Thamrin • Connector 02</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressRing, ringStyle]}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercent}>{chargingMetrics.roundedProgress}%</Text>
              <Text style={styles.progressLabel}>
                {progress >= fastChargeTarget ? 'TAPERING CHARGE' : 'FAST CHARGE'}
              </Text>
              <View style={styles.progressSublabel}>
                <Text style={styles.progressSublabelText}>
                  {chargingMetrics.deliveredKwh.toFixed(2)} / {purchasedKwh.toFixed(2)} kWh purchased
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="wallet" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>AMOUNT UTILIZED</Text>
            </View>
            <Text style={styles.metricValue}>Rp {chargingMetrics.amountUtilized.toLocaleString('id-ID')}</Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="timer" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>EST. TIME LEFT</Text>
            </View>
            <Text style={[styles.metricValue, { lineHeight: 28 }]}>
              {chargingMetrics.remainingMinutes} min{chargingMetrics.remainingMinutes === 1 ? '' : 's'} remaining
            </Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="lightning" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>DELIVERY POWER</Text>
            </View>
            <Text style={styles.metricValue}>{chargingMetrics.deliveryPower} kW</Text>
          </View>
          
          <View style={[styles.metricCard, styles.metricBlock]}>
            <View style={styles.metricValueRow}>
              <ChargingFlowIcon name="connector" size={16} color="#019495" />
              <Text style={[styles.metricLabel, { fontSize: 10 }]}>OUTPUT RATE</Text>
            </View>
            <Text style={[styles.metricValue, { lineHeight: 28 }]}>{chargingMetrics.outputRate}</Text>
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
