import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {store, persistor} from './src/app/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import HomeScreen from './src/screens/HomeScreen';
import ToDoScreen from './src/screens/ToDoScreen';
import CreateToDoScreen from './src/screens/CreateToDoScreen';
import UpdateToDoScreen from './src/screens/UpdateToDoScreen';

const Stack = createNativeStackNavigator();

export default App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};
