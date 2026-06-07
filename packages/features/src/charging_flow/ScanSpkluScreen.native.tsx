import { useState } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { useNavigate } from 'react-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { ChargingFlowHeader } from './components/ChargingFlowHeader';

export function ScanSpkluScreen() {
  const navigate = useNavigate();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    const handlePermissionPress = () => {
      if (permission.canAskAgain) {
        requestPermission();
        return;
      }

      Linking.openSettings().catch(() => undefined);
    };

    return (
      <View style={styles.page}>
        <ChargingFlowHeader title="Scan SPKLU QR Code" onBack={() => navigate('/ev-driver/map')} />

        <View style={styles.cameraContainer}>
          <View style={styles.permissionPrompt}>
            <Text style={styles.permissionPromptText}>
              Camera access is required to scan the SPKLU QR code in the native app.
            </Text>
            <Pressable accessibilityRole="button" onPress={handlePermissionPress} style={styles.secondaryPermissionButton}>
              <Text style={styles.secondaryPermissionButtonText}>
                {permission.canAskAgain ? 'Allow Camera Access' : 'Open Camera Settings'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // Move to next screen after scanning successfully
    navigate('/charging-flow/initialize');
  };

  return (
    <View style={styles.page}>
      <ChargingFlowHeader
        title="Scan SPKLU QR Code"
        onBack={() => navigate('/ev-driver/map')}
        rightIconName="flashlight"
        rightIconColor="#191C1D"
        rightIconSize={22}
      />

      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraCutout} />
            <Text style={styles.cameraInstructions}>
              Position the QR code or barcode found on the SPKLU connector inside the frame to initialize payment.
            </Text>
            <Text style={styles.manualEntryLink} onPress={() => navigate('/charging-flow/initialize')}>
              Can't scan? Enter Station ID manually
            </Text>
          </View>
        </CameraView>
      </View>
    </View>
  );
}
