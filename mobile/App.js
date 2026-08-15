import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { I18nProvider } from './src/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            <AppNavigator />
          </NavigationContainer>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
