import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#38bdf8" />
    </View>
  );
}

export default function AppNavigator() {
  const { token, isLoading, loadFromStorage } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadFromStorage();
      setInitializing(false);
    };
    init();
  }, []);

  if (initializing || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="MainNav" component={MainNavigator} />
      ) : (
        <Stack.Screen name="AuthNav" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
