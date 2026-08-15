import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('tourist');
  const [password, setPassword] = useState('tourist123');
  const [errorMsg, setErrorMsg] = useState('');

  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setErrorMsg('');
    if (!username || !password) {
      setErrorMsg('Please enter username and password');
      return;
    }
    const result = await login(username, password);
    if (result.success) {
      navigation.replace('Main');
    } else {
      setErrorMsg(result.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>RakshaSetu Login</Text>
          <Text style={styles.subtitle}>Smart Incident Response & Digital ID</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. tourist or tourist@example.com"
            placeholderTextColor="#64748b"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginBtnText}>SIGN IN AS TOURIST</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Quick Account Helper */}
        <View style={styles.demoHelper}>
          <Text style={styles.demoHelperTitle}>Default SIH Demo Account:</Text>
          <Text style={styles.demoHelperText}>Username: <Text style={styles.bold}>tourist</Text> | Password: <Text style={styles.bold}>tourist123</Text></Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
        >
          <Text style={styles.registerLinkText}>
            New Tourist? <Text style={styles.registerLinkHighlight}>Create Digital ID</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 44,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  label: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  demoHelper: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  demoHelperTitle: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '700',
  },
  demoHelperText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  bold: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  registerLinkText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  registerLinkHighlight: {
    color: '#38bdf8',
    fontWeight: '700',
  },
});
