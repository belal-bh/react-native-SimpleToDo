import {configureStore, combineReducers} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';

import todosReducer from '../features/todos/todosSlice';
import userReducer from '../features/users/userSlice';

const rootReducer = combineReducers({
  todos: persistReducer(
    {
      key: 'todos',
      storage: AsyncStorage,
      blacklist: ['status', 'error', 'extras'],
    },
    todosReducer,
  ),
  user: persistReducer(
    {
      key: 'user',
      storage: AsyncStorage,
      blacklist: ['status', 'error', 'user.loggedIn'],
    },
    userReducer,
  ),
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
    console.error(e);
  }

  console.log('Done clearAsyncStorage.');
};
