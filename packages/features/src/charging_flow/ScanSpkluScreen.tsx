import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigate } from 'react-router';
import { Html5Qrcode } from 'html5-qrcode';
import { chargingFlowStyles as styles } from '@evflow/ui';
import { ChargingFlowHeader } from './components/ChargingFlowHeader';

export function ScanSpkluScreen() {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionLoading, setPermissionLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const checkCameraPermission = () => {
    let mounted = true;
    setPermissionLoading(true);
    setPermissionError(null);
    
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        if (mounted) setHasPermission(true);
      } else {
        if (mounted) setHasPermission(false);
      }
    }).catch(err => {
      if (mounted) {
        setPermissionError(err instanceof Error ? err.message : 'Camera permission denied or camera not found.');
        setHasPermission(false);
      }
    }).finally(() => {
      if (mounted) {
        setPermissionLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    if (hasPermission) {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
          html5QrCode.stop().then(() => {
            navigate('/charging-flow/initialize');
          }).catch(console.error);
        },
        (errorMessage) => {
          // ignore scan errors (they happen every frame that no code is detected)
        }
      ).catch(err => {
        console.error("Error starting scanner", err);
      });

      return () => {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch(console.error);
        }
      };
    }
  }, [hasPermission, navigate]);

  return (
    <View style={styles.page}>
      <style>{`
        #reader {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
      <ChargingFlowHeader
        title="Scan SPKLU QR Code"
        onBack={() => navigate('/ev-driver/map')}
        rightIconName="flashlight"
        rightIconColor="#191C1D"
        rightIconSize={22}
      />

      <View style={styles.cameraContainer}>
        {hasPermission !== true ? (
          <View style={styles.permissionPrompt}>
            <Text style={styles.permissionPromptText}>
              Camera access is required to scan the SPKLU QR code in this web browser.
            </Text>
            {permissionError ? <Text style={styles.permissionPromptSubtext}>{permissionError}</Text> : null}
            <Pressable accessibilityRole="button" onPress={checkCameraPermission} style={styles.secondaryPermissionButton}>
              <Text style={styles.secondaryPermissionButtonText}>
                {permissionLoading ? 'Checking Camera...' : 'Allow Browser Camera Access'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ flex: 1, width: '100%', position: 'relative' }}>
            <div id="reader" style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
            <View style={[styles.cameraOverlay, { pointerEvents: 'box-none' } as any]}>
              <View style={styles.cameraCutout} />
              <Text style={styles.cameraInstructions}>
                Position the QR code or barcode found on the SPKLU connector inside the frame to initialize payment.
              </Text>
              <Text style={styles.manualEntryLink} onPress={() => {
                if (scannerRef.current?.isScanning) {
                  scannerRef.current.stop().catch(console.error);
                }
                navigate('/charging-flow/initialize');
              }}>
                Can't scan? Enter Station ID manually
              </Text>
              
              <View style={styles.cameraNoticeCard}>
                <Text style={{ fontSize: 24, color: '#01e0f0' }}>ⓘ</Text>
                <Text style={styles.cameraNoticeText}>Make sure you have selected the correct plug profile on the previous screen.</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
