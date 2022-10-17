import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import ToDoScreen from './src/screens/ToDoScreen';
import CreateToDoScreen from './src/screens/CreateToDoScreen';
import UpdateToDoScreen from './src/screens/UpdateToDoScreen';

import {CommonContextProvider} from './src/contexts/CommonContext';

const Stack = createNativeStackNavigator();

export default App = () => {
  return (
    <CommonContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="App_to_Home">
          <Stack.Screen
            name="App_to_Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home_to_ToDo"
            component={ToDoScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ToDo_to_CreateToDo"
            component={CreateToDoScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ToDo_to_UpdateToDo"
            component={UpdateToDoScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CommonContextProvider>
  );
};
