import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { fetchEvModels, type EVModelApiItem } from '@evflow/shared';
import { registrationScreenStyles as styles } from '@evflow/ui';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { SvgAssetIcon } from '../shared/SvgAssetIcon';
import { PlatformSlider } from '../shared/PlatformSlider';
import { ModelPicker } from './components/ModelPicker';

type RegistrationScreenProps = {
  onBack: () => void;
  onLogin: () => void;
  onRegister: () => void;
};

const connectorTypes = ['CCS Type 2', 'AC Type 2', 'GB/T'];
const batteryThresholds = [10, 15, 20, 25, 30, 35, 40] as const;

export function RegistrationScreen({ onBack, onLogin, onRegister }: RegistrationScreenProps) {
  const insets = useAppSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [selectedConnectorType, setSelectedConnectorType] = useState(connectorTypes[0]);
  const [batteryThreshold, setBatteryThreshold] = useState(20);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [evModels, setEvModels] = useState<EVModelApiItem[]>([]);
  const [evModelsError, setEvModelsError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEvModels() {
      try {
        const response = await fetchEvModels({ limit: 500 });

        if (mounted) {
          setEvModels(response.items);
        }
      } catch (error) {
        if (mounted) {
          setEvModelsError(error instanceof Error ? error.message : 'Unable to load EV models.');
        }
      }
    }

    loadEvModels();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedCar = useMemo(
    () => evModels.find((model) => model.id === selectedCarId),
    [evModels, selectedCarId]
  );
  const evModelOptions = useMemo(
    () =>
      evModels.map((model) => ({
        label: `${model.name} (${[model.battery_kwh ? `${model.battery_kwh} kWh` : null, model.range_km ? `${model.range_km} km` : null].filter(Boolean).join(' - ')})`,
        value: model.id
      })),
    [evModels]
  );
  const selectedBatteryIndex = batteryThresholds.findIndex((threshold) => threshold === batteryThreshold);
  const batteryPercent = (selectedBatteryIndex / (batteryThresholds.length - 1)) * 100;

  return (
    <View style={styles.page}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable accessibilityLabel="Back" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <SvgAssetIcon color="#191C1D" height={12} name="leftChevron" width={8} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 28 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create New Account</Text>
        <Text style={styles.subtitle}>Join for access to EV-FLOW smart routing.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            accessibilityLabel="Username"
            autoCapitalize="none"
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#9aa4a9"
            style={styles.input}
            value={username}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            accessibilityLabel="Password"
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#9aa4a9"
            style={styles.input}
            value={password}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Car Brand & Model</Text>
          <View style={styles.select}>
            <ModelPicker
              selectedValue={selectedCarId}
              onValueChange={setSelectedCarId}
              options={evModelOptions}
              placeholderLabel={evModelsError ? 'EV models unavailable' : 'Select your car'}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Main Connector Type</Text>
          <View style={styles.connectorRow}>
            {connectorTypes.map((connectorType) => {
              const selected = connectorType === selectedConnectorType;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={connectorType}
                  onPress={() => setSelectedConnectorType(connectorType)}
                  style={[styles.connectorPill, selected && styles.selectedConnectorPill]}
                >
                  <Text style={[styles.connectorText, selected && styles.selectedConnectorText]}>{connectorType}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.thresholdHeader}>
            <Text style={styles.label}>Comfort Battery Threshold</Text>
            <Text style={styles.thresholdValue}>{batteryThreshold}%</Text>
          </View>
          <Text style={styles.helperText}>Set your minimum battery level for smart routing</Text>
          <PlatformSlider
            style={{ width: '100%', height: 40, marginTop: 8 }}
            minimumValue={10}
            maximumValue={40}
            step={5}
            value={batteryThreshold}
            onValueChange={setBatteryThreshold}
            minimumTrackTintColor="#0bb2b2"
            maximumTrackTintColor="#dde5e8"
            thumbTintColor="#0bb2b2"
          />
          <View style={styles.thresholdLabels}>
            {batteryThresholds.map((threshold) => (
              <Pressable accessibilityRole="button" key={threshold} onPress={() => setBatteryThreshold(threshold)}>
                <Text style={styles.thresholdLabel}>{threshold}%</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: permissionGranted }}
          onPress={() => setPermissionGranted((current) => !current)}
          style={styles.permissionCard}
        >
          <View style={[styles.checkbox, permissionGranted && styles.checkedBox]}>
            {permissionGranted ? <Text style={styles.checkText}>✓</Text> : null}
          </View>
          <View style={styles.permissionTextWrap}>
            <Text style={styles.permissionTitle}>Access Permission & Periodic Location Recording</Text>
            <Text style={styles.permissionBody}>
              Your journey coordinate data will be recorded anonymously to support Charging Station demand mapping by the 4JKT team. We respect your privacy in accordance with data protection mandates.
            </Text>
          </View>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={onRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </Pressable>

        <Text style={styles.loginPrompt}>
          Already have an account?{' '}
          <Text onPress={onLogin} style={styles.loginLink}>
            Log In
          </Text>
        </Text>

        <View style={styles.homeIndicator} />
        <Text style={styles.poweredBy}>POWERED BY EV-FLOW ECOSYSTEM</Text>
      </ScrollView>
    </View>
  );
}
