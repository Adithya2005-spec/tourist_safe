import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function DigitalIdentityScreen({ navigation }) {
  const { user, touristProfile } = useAuthStore();
  const [showQR, setShowQR] = useState(false);

  const did = touristProfile?.did_identifier || 'did:sih:tourist-1024:aadhaar-verified';
  const code = touristProfile?.tourist_code || 'TOURIST-1024';
  const name = touristProfile?.full_name || user?.username || 'Tourist';

  const CREDENTIALS = [
    { type: 'Aadhaar Verification', status: 'VERIFIED', emoji: '🆔', issuer: 'SIH Identity Authority', date: '2024-01-15', color: '#22c55e' },
    { type: 'Tourist Registration', status: 'ACTIVE', emoji: '🎫', issuer: 'Tourism Board of India', date: '2024-01-16', color: '#38bdf8' },
    { type: 'Blockchain Anchor', status: 'ON-CHAIN', emoji: '⛓️', issuer: 'Ethereum Testnet', date: '2024-01-16', color: '#a78bfa' },
    { type: 'Emergency Profile', status: 'ENABLED', emoji: '🚨', issuer: 'Emergency Services India', date: '2024-01-16', color: '#f97316' },
  ];

  const DID_PARTS = did.split(':');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>DIGITAL IDENTITY</Text>
        </View>

        {/* Main DID Card */}
        <View style={styles.didCard}>
          <View style={styles.didCardTop}>
            <View style={styles.didAvatar}>
              <Text style={styles.didAvatarText}>{name[0].toUpperCase()}</Text>
            </View>
            <View style={styles.didCardInfo}>
              <Text style={styles.didName}>{name}</Text>
              <Text style={styles.didCode}>{code}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>✅ AADHAAR VERIFIED</Text>
              </View>
            </View>
          </View>

          <View style={styles.didDivider} />

          {/* DID Breakdown */}
          <Text style={styles.didLabel}>DECENTRALIZED IDENTIFIER (DID)</Text>
          <View style={styles.didBreakdown}>
            {DID_PARTS.map((part, i) => (
              <React.Fragment key={i}>
                <View style={styles.didPartBadge}>
                  <Text style={styles.didPartLabel}>
                    {i === 0 ? 'METHOD' : i === 1 ? 'SCHEMA' : i === 2 ? 'ID' : 'CREDENTIAL'}
                  </Text>
                  <Text style={styles.didPartValue}>{part}</Text>
                </View>
                {i < DID_PARTS.length - 1 && <Text style={styles.didColon}>:</Text>}
              </React.Fragment>
            ))}
          </View>
          <Text style={styles.didFull}>{did}</Text>
        </View>

        {/* QR Toggle */}
        <TouchableOpacity style={styles.qrToggleBtn} onPress={() => setShowQR(!showQR)}>
          <Text style={styles.qrToggleText}>
            {showQR ? '🔒 Hide QR Code' : '📱 Show QR Code for Identity Verification'}
          </Text>
        </TouchableOpacity>

        {/* Simulated QR Card */}
        {showQR && (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>IDENTITY QR CODE</Text>
            {/* Simulated QR Grid */}
            <View style={styles.qrGrid}>
              {Array.from({ length: 10 }).map((_, row) =>
                Array.from({ length: 10 }).map((_, col) => {
                  const hash = (row * 10 + col + row * col) % 3;
                  return (
                    <View
                      key={`${row}-${col}`}
                      style={[styles.qrCell, { backgroundColor: hash === 0 ? '#f8fafc' : '#020617' }]}
                    />
                  );
                })
              )}
            </View>
            <Text style={styles.qrSubtext}>Present to authorities for instant verification</Text>
          </View>
        )}

        {/* Verifiable Credentials */}
        <Text style={styles.sectionTitle}>VERIFIABLE CREDENTIALS</Text>
        {CREDENTIALS.map(c => (
          <View key={c.type} style={[styles.credCard, { borderColor: c.color + '44' }]}>
            <View style={styles.credHeader}>
              <View style={[styles.credIconWrap, { backgroundColor: c.color + '20' }]}>
                <Text style={styles.credEmoji}>{c.emoji}</Text>
              </View>
              <View style={styles.credInfo}>
                <Text style={styles.credType}>{c.type}</Text>
                <Text style={styles.credIssuer}>Issued by: {c.issuer}</Text>
                <Text style={styles.credDate}>{c.date}</Text>
              </View>
              <View style={[styles.credStatusPill, { backgroundColor: c.color + '20' }]}>
                <Text style={[styles.credStatusText, { color: c.color }]}>{c.status}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Blockchain Anchor */}
        <Text style={styles.sectionTitle}>BLOCKCHAIN ANCHOR</Text>
        <View style={styles.chainCard}>
          <Text style={styles.chainTitle}>⛓️ Identity Hash (SHA-256)</Text>
          <Text style={styles.chainHash}>
            {Array.from({ length: 64 }, (_, i) =>
              ((i * 37 + 13) % 16).toString(16)
            ).join('')}
          </Text>
          <Text style={styles.chainDesc}>
            Your identity metadata hash is permanently anchored on Ethereum Testnet.
            No personal information is stored on-chain — only a cryptographic proof.
          </Text>
        </View>

        {/* How DID Works */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ How Your DID Works</Text>
          <Text style={styles.infoText}>
            1. Your Aadhaar identity is verified offline by the backend.{'\n'}
            2. A unique DID is generated and stored in your profile.{'\n'}
            3. A SHA-256 hash of your DID is anchored on Ethereum Testnet.{'\n'}
            4. Authorities can verify you instantly using the QR code — no database lookup required.{'\n'}
            5. Zero personally identifiable information (PII) is ever stored on-chain.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  backText: { color: '#38bdf8', fontSize: 13, fontWeight: '700' },
  title: { fontSize: 14, fontWeight: '900', color: '#f8fafc', letterSpacing: 1 },
  didCard: { backgroundColor: '#0f172a', borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: '#a78bfa44', marginBottom: 12 },
  didCardTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  didAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#a78bfa', justifyContent: 'center', alignItems: 'center' },
  didAvatarText: { color: '#fff', fontSize: 26, fontWeight: '900' },
  didCardInfo: {},
  didName: { color: '#f8fafc', fontSize: 16, fontWeight: '800', marginBottom: 2 },
  didCode: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  verifiedBadge: { backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  verifiedBadgeText: { color: '#22c55e', fontSize: 9, fontWeight: '900' },
  didDivider: { height: 1, backgroundColor: 'rgba(167,139,250,0.15)', marginBottom: 14 },
  didLabel: { color: '#64748b', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  didBreakdown: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4, marginBottom: 8 },
  didPartBadge: { backgroundColor: '#1e293b', borderRadius: 6, padding: 6 },
  didPartLabel: { color: '#475569', fontSize: 7, fontWeight: '800', letterSpacing: 0.5 },
  didPartValue: { color: '#a78bfa', fontSize: 10, fontWeight: '700' },
  didColon: { color: '#475569', fontSize: 14, fontWeight: '900' },
  didFull: { color: '#334155', fontSize: 9, fontFamily: 'System', marginTop: 4 },
  qrToggleBtn: { backgroundColor: 'rgba(167,139,250,0.1)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)', alignItems: 'center', marginBottom: 12 },
  qrToggleText: { color: '#a78bfa', fontSize: 13, fontWeight: '700' },
  qrCard: { backgroundColor: '#0f172a', borderRadius: 14, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', marginBottom: 16 },
  qrTitle: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 12 },
  qrGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 150, height: 150, marginBottom: 12 },
  qrCell: { width: 15, height: 15 },
  qrSubtext: { color: '#475569', fontSize: 10 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1, marginBottom: 10, marginTop: 16 },
  credCard: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 8 },
  credHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  credIconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  credEmoji: { fontSize: 20 },
  credInfo: { flex: 1 },
  credType: { color: '#e2e8f0', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  credIssuer: { color: '#64748b', fontSize: 10, marginBottom: 1 },
  credDate: { color: '#475569', fontSize: 10 },
  credStatusPill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  credStatusText: { fontSize: 9, fontWeight: '900' },
  chainCard: { backgroundColor: '#0a0f1e', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(167,139,250,0.25)', marginBottom: 16 },
  chainTitle: { color: '#a78bfa', fontSize: 11, fontWeight: '800', marginBottom: 8 },
  chainHash: { color: '#334155', fontSize: 8, fontFamily: 'System', letterSpacing: 0.5, lineHeight: 13, marginBottom: 10 },
  chainDesc: { color: '#64748b', fontSize: 11, lineHeight: 15 },
  infoCard: { backgroundColor: 'rgba(56,189,248,0.06)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(56,189,248,0.15)', marginBottom: 16 },
  infoTitle: { color: '#38bdf8', fontSize: 12, fontWeight: '800', marginBottom: 8 },
  infoText: { color: '#64748b', fontSize: 11, lineHeight: 18 },
});
