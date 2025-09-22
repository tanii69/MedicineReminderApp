import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialIcons';
import SignUpScreen from '../Screen/SignUpScreen';

import {
  LoginScreen,
  DashBoardScreen,
  AddMedicineScreen,
  HistoryScreen,
  ReminderScreen,
} from '../Screen/index.js';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        headerTitleAlign: 'center',

        // 🔹 Gradient Header
        headerBackground: () => (
          <LinearGradient colors={['#69a5ff', '#14b5ff']} style={{ flex: 1 }} />
        ),

        // 🔹 Tab Bar Styling
        tabBarStyle: {
          backgroundColor: '#14b5ff',
          height: 60,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          overflow: 'hidden',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#e0f3ff',
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          marginBottom: 6,
        },

        // 🔹 Tab Icons
        tabBarIcon: ({ color, size }) => {
          let emoji;

          switch (route.name) {
            case 'Dashboard':
              emoji = '🏠';
              break;
            case 'Add Medicine':
              emoji = '💊';
              break;
            case 'History':
              emoji = '🕒';
              break;
            case 'Reminders':
              emoji = '⏰';
              break;
            default:
              emoji = '❓';
              break;
          }

          return <Text style={{ fontSize: 20, color }} >{emoji}</Text>;
        },
      })}
    >
      <Tabs.Screen name="Dashboard" component={DashBoardScreen} />
      <Tabs.Screen
        name="Add Medicine"
        component={AddMedicineScreen}
        options={{ title: 'Add Medicine' }}
      />
      <Tabs.Screen name="History" component={HistoryScreen} />
      <Tabs.Screen name="Reminders" component={ReminderScreen} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}