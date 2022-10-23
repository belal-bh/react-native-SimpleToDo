import {configureStore} from '@reduxjs/toolkit';

import todosReducer from '../features/todos/todosSlice';
import userReducer from '../features/users/userSlice';

export default configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer,
  },
});
