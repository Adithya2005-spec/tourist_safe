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

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('Indian');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    setErrorMsg('');
    if (!fullName || !email || !username || !password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    const result = await register({
      full_name: fullName,
      email,
      username,
      password,
      phone_number: phone,
      nationality,
      role: 'TOURIST',
    });

    if (result.success) {
      navigation.replace('Main');
    } else {
      setErrorMsg(result.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Register Tourist ID</Text>
          <Text style={styles.subtitle}>Decentralized Digital Identity Credential</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mahalasa Rao"
            placeholderTextColor="#64748b"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="tourist@example.com"
            placeholderTextColor="#64748b"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Username *</Text>
          <TextInput
            style={styles.input}
            placeholder="username"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98765 43210"
            placeholderTextColor="#64748b"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerBtnText}>GENERATE DIGITAL CREDENTIAL</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>
            Already registered? <Text style={styles.loginLinkHighlight}>Sign In</Text>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 12,
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
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  registerBtn: {
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginLinkText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  loginLinkHighlight: {
    color: '#38bdf8',
    fontWeight: '700',
  },
});
