import React, { useEffect } from 'react'
import ChatList from './screens/ChatList';
import Settings from './screens/Settings';
import Chat from './screens/Chat';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';

import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Button, DefaultTheme, Provider } from 'react-native-paper';
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from './firebase/firebase-config';

const Stack = createNativeStackNavigator();

const Tabs = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation()
  useEffect(() => {
    onAuthStateChanged(authentication, user => {
      if (!user) {
        navigation.navigate('SignUp')
      }
    })
  }, []);
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        return <Ionicons name={route.name === "ChatList" ? "chatbubbles" : "settings"} color={color} size={size} />
      }
    })}>
      <Tabs.Screen name="ChatList" component={ChatList} />
      <Tabs.Screen name="Settings" component={Settings} />
    </Tabs.Navigator>
  )
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196f3',
    accent: '#e91e63',
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Provider theme={theme}>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Group screenOptions={{ presentation: 'fullScreenModal', }}>
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Group>
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  )
}

export default App;