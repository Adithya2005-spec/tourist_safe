import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import SafetyMapScreen from '../screens/SafetyMapScreen';
import IncidentsScreen from '../screens/IncidentsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import SOSScreen from '../screens/SOSScreen';
import RiskDetailsScreen from '../screens/RiskDetailsScreen';
import IncidentReportScreen from '../screens/IncidentReportScreen';
import IncidentStatusScreen from '../screens/IncidentStatusScreen';
import DigitalIdentityScreen from '../screens/DigitalIdentityScreen';
import EmergencyContactsScreen from '../screens/EmergencyContactsScreen';
import LiveLocationSharingScreen from '../screens/LiveLocationSharingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OfflineSyncScreen from '../screens/OfflineSyncScreen';
import { useTranslation } from '../i18n';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const { t } = useTranslation();

  const tabLabels = {
    Home: { icon: '🏠', label: t('nav.home') },
    SafetyMap: { icon: '🗺️', label: t('nav.map') },
    Incidents: { icon: '📋', label: t('nav.incidents') },
    Notifications: { icon: '🔔', label: t('nav.notifications') },
    Profile: { icon: '👤', label: t('nav.profile') },
  };

  return (
    <View style={tabStyles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const info = tabLabels[route.name] || { icon: '📌', label: route.name };
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tabItem}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.tabIcon, isFocused && tabStyles.tabIconActive]}>
              {info.icon}
            </Text>
            <Text style={[tabStyles.tabLabel, isFocused && tabStyles.tabLabelActive]}>
              {info.label}
            </Text>
            {isFocused && <View style={tabStyles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0a0f1e',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.4,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 9,
    color: '#475569',
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#38bdf8',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 2,
    backgroundColor: '#38bdf8',
    borderRadius: 2,
  },
});

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="SafetyMap" component={SafetyMapScreen} />
      <Tab.Screen name="Incidents" component={IncidentsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#020617' },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="SOS" component={SOSScreen} />
      <Stack.Screen name="RiskDetails" component={RiskDetailsScreen} />
      <Stack.Screen name="IncidentReport" component={IncidentReportScreen} />
      <Stack.Screen name="IncidentStatus" component={IncidentStatusScreen} />
      <Stack.Screen name="DigitalIdentity" component={DigitalIdentityScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="LiveLocationSharing" component={LiveLocationSharingScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="OfflineSync" component={OfflineSyncScreen} />
    </Stack.Navigator>
  );
}
