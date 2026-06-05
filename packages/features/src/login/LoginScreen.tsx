import { Image, Pressable, ScrollView, Text, TextInput, View, type ImageSourcePropType } from 'react-native';
import { loginScreenStyles as styles } from '@evflow/ui';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import evflowIcon from '../assets/images/evflow-icon.png';

const evflowIconSource = evflowIcon as unknown as ImageSourcePropType;

type LoginScreenProps = {
  onLogin: () => void;
  onRegister: () => void;
};

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const insets = useAppSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        {
          paddingBottom: 36 + insets.bottom,
          paddingTop: 36 + insets.top
        }
      ]}
      keyboardShouldPersistTaps="handled"
    >

      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Image source={evflowIconSource} style={styles.logoImage} />
        </View>

        <Text style={styles.appTitle}>EV-FLOW</Text>
        <Text style={styles.appSubtitle}>Electric Vehicle Forecasting & Location Optimization Wayfinder</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            accessibilityLabel="Username"
            autoCapitalize="none"
            keyboardType="default"
            placeholder="Enter your username"
            placeholderTextColor="#7c858b"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.inputLabel}>Password</Text>
            <Text style={styles.forgotText}>Forgot?</Text>
          </View>
          <TextInput
            accessibilityLabel="Password"
            placeholder="Minimum 8 characters"
            placeholderTextColor="#69777c"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable accessibilityRole="button" onPress={onLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </Pressable>

        <View style={styles.signupSeparator} />

        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text onPress={onRegister} style={styles.signupLink}>
            Register Now
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
