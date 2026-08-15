import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { useTranslation } from '../i18n';

export default function EmergencyContactsScreen({ navigation }) {
  const { t } = useTranslation();

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mom (Radha Rao)', phone: '+91 98450 11223', relationship: 'Parent', email: 'radha@example.com', is_primary: 1 },
    { id: 2, name: 'Rahul Rao', phone: '+91 98450 44556', relationship: 'Sibling', email: 'rahul@example.com', is_primary: 0 },
    { id: 3, name: 'Dr. Suresh Kumar', phone: '+91 98450 99887', relationship: 'Doctor', email: 'dr.suresh@example.com', is_primary: 0 }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRelationship, setFormRelationship] = useState('Family');
  const [formIsPrimary, setFormIsPrimary] = useState(false);

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormName('');
    setFormPhone('');
    setFormRelationship('Family');
    setFormIsPrimary(contacts.length === 0);
    setModalVisible(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormRelationship(contact.relationship);
    setFormIsPrimary(contact.is_primary === 1);
    setModalVisible(true);
  };

  const handleSaveContact = () => {
    if (!formName.trim() || !formPhone.trim()) {
      Alert.alert(t('common.status'), 'Please enter both Name and Phone number.');
      return;
    }

    if (editingContact) {
      setContacts(prev => prev.map(c => {
        if (c.id === editingContact.id) {
          return {
            ...c,
            name: formName.trim(),
            phone: formPhone.trim(),
            relationship: formRelationship,
            is_primary: formIsPrimary ? 1 : 0
          };
        }
        return formIsPrimary ? { ...c, is_primary: 0 } : c;
      }));
    } else {
      const newContact = {
        id: Date.now(),
        name: formName.trim(),
        phone: formPhone.trim(),
        relationship: formRelationship,
        is_primary: formIsPrimary ? 1 : 0
      };
      setContacts(prev => {
        const updated = formIsPrimary ? prev.map(c => ({ ...c, is_primary: 0 })) : [...prev];
        return [newContact, ...updated];
      });
    }
    setModalVisible(false);
  };

  const handleDeleteContact = (id) => {
    Alert.alert(
      t('emergencyContacts.deleteContact'),
      t('emergencyContacts.confirmDelete'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('emergencyContacts.deleteContact'),
          style: 'destructive',
          onPress: () => setContacts(prev => prev.filter(c => c.id !== id))
        }
      ]
    );
  };

  const handleSetPrimary = (id) => {
    setContacts(prev => prev.map(c => ({
      ...c,
      is_primary: c.id === id ? 1 : 0
    })));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('emergencyContacts.title')}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAdd}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionNotice}>
          Designate your primary emergency contact. In case of SOS, an instant encrypted SMS & GPS dispatch beacon will alert them.
        </Text>

        {contacts.map(c => (
          <View key={c.id} style={[styles.contactCard, c.is_primary === 1 && styles.primaryCard]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  {c.is_primary === 1 && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>★ {t('emergencyContacts.primary')}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.contactPhone}>{c.phone}</Text>
                <Text style={styles.contactRel}>{c.relationship}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              {c.is_primary !== 1 && (
                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={() => handleSetPrimary(c.id)}
                >
                  <Text style={styles.actionTextSecondary}>{t('emergencyContacts.setPrimary')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleOpenEdit(c)}
              >
                <Text style={styles.actionText}>{t('emergencyContacts.editContact')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtnDelete}
                onPress={() => handleDeleteContact(c.id)}
              >
                <Text style={styles.actionTextDelete}>{t('emergencyContacts.deleteContact')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Modal for Add / Edit */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                {editingContact ? t('emergencyContacts.editContact') : t('emergencyContacts.addContact')}
              </Text>

              <Text style={styles.inputLabel}>{t('emergencyContacts.name')}</Text>
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
                placeholder="e.g. Radha Rao"
                placeholderTextColor="#64748b"
              />

              <Text style={styles.inputLabel}>{t('emergencyContacts.phone')}</Text>
              <TextInput
                style={styles.input}
                value={formPhone}
                onChangeText={setFormPhone}
                placeholder="+91 98450 11223"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>{t('emergencyContacts.relationship')}</Text>
              <View style={styles.relRow}>
                {['Parent', 'Spouse', 'Friend', 'Sibling', 'Doctor'].map(rel => (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.relPill, formRelationship === rel && styles.relPillSelected]}
                    onPress={() => setFormRelationship(rel)}
                  >
                    <Text style={[styles.relText, formRelationship === rel && styles.relTextSelected]}>
                      {rel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.primaryToggle}
                onPress={() => setFormIsPrimary(!formIsPrimary)}
              >
                <View style={[styles.checkbox, formIsPrimary && styles.checkboxChecked]}>
                  {formIsPrimary && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.primaryToggleText}>{t('emergencyContacts.setPrimary')}</Text>
              </TouchableOpacity>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveContact}
                >
                  <Text style={styles.saveBtnText}>{t('emergencyContacts.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#0a0f1e',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#020617',
    fontSize: 22,
    fontWeight: '900',
  },
  content: {
    padding: 20,
  },
  sectionNotice: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 18,
  },
  contactCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  primaryCard: {
    borderColor: 'rgba(56,189,248,0.4)',
    backgroundColor: 'rgba(56,189,248,0.04)',
  },
  cardHeader: {
    flexDirection: 'row',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  primaryBadge: {
    backgroundColor: 'rgba(56,189,248,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.4)',
  },
  primaryBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
  },
  contactPhone: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Courier',
  },
  contactRel: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    backgroundColor: 'rgba(56,189,248,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionTextSecondary: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnDelete: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionTextDelete: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    padding: 12,
    fontSize: 14,
  },
  relRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relPill: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  relPillSelected: {
    backgroundColor: '#38bdf8',
    borderColor: '#38bdf8',
  },
  relText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  relTextSelected: {
    color: '#020617',
    fontWeight: '800',
  },
  primaryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#38bdf8',
  },
  checkmark: {
    color: '#020617',
    fontWeight: 'bold',
    fontSize: 12,
  },
  primaryToggleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#020617',
    fontSize: 13,
    fontWeight: '900',
  },
});
