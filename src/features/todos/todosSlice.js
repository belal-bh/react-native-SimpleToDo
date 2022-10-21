import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {API_URL, WAITING_TIME} from '../../config';
import {
  getToDoObjectList,
  getToDoObjectListSerializable,
  getToDoObjectSerializable,
} from '../../helpers/toDoHelpers';
import {wait} from '../../helpers/helpers';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  await wait(WAITING_TIME);
  const response = await fetch(`${API_URL}tasks/`, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Userid: 1,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return getToDoObjectListSerializable(json);
});

export const addNewTodo = createAsyncThunk('todos/addNewTodo', async data => {
  await wait(WAITING_TIME);
  const response = await fetch(`${API_URL}tasks/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Userid: 1,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return getToDoObjectSerializable(json);
});

const todosAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

export const {
  selectAll: selectAllTodos,
  selectIds: selectTodoIds,
  selectById: selectTodoById,
} = todosAdapter.getSelectors(state => state.todos);

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosAdapter.getInitialState({
    status: 'idle',
    error: null,
    extras: {
      add: {
        status: 'idle',
        error: null,
      },
      update: {
        status: 'idle',
        error: null,
      },
      delete: {
        status: 'idle',
        error: null,
      },
    },
  }),
  reducers: {
    resetAddTodoState(state, action) {
      console.log('resetAddTodoState');
      state.extras.add.status = 'idle';
      state.extras.add.error = null;
    },
    resetUpdateTodoState(state, action) {
      state.extras.update.status = 'idle';
      state.extras.update.error = null;
    },
    resetDeleteTodoState(state, action) {
      state.extras.delete.status = 'idle';
      state.extras.delete.error = null;
    },
    resetTodosExtras(state, action) {
      state.extras.add.status = 'idle';
      state.extras.add.error = null;
      state.extras.update.status = 'idle';
      state.extras.update.error = null;
      state.extras.delete.status = 'idle';
      state.extras.delete.error = null;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      if (state.status === 'loading') {
        todosAdapter.upsertMany(state, action);
        state.status = 'succeeded';
      }
    },
    [fetchTodos.rejected]: (state, action) => {
      if (state.status === 'loading') {
        state.status = 'failed';
        state.error = action.error.message;
        console.log(action);
      }
    },
    [addNewTodo.pending]: (state, action) => {
      state.extras.add.status = 'loading';
      state.extras.add.error = null;
    },
    [addNewTodo.fulfilled]: (state, action) => {
      if (state.extras.add.status === 'loading') {
        todosAdapter.addOne(state, action);
        state.extras.add.status = 'succeeded';
      }
    },
    [addNewTodo.rejected]: (state, action) => {
      if (state.extras.add.status === 'loading') {
        state.extras.add.status = 'failed';
        state.extras.add.error = action.error.message;
        console.log(action);
      }
    },
  },
});

export const selectTodosExtras = state => state.todos.extras;
export const selectTodosExtrasAddStatus = state =>
  state.todos.extras.add.status;
export const selectTodosExtrasAddError = state => state.todos.extras.add.error;
export const selectTodosExtrasUpdateStatus = state =>
  state.todos.extras.update.status;
export const selectTodosExtrasUpdateError = state =>
  state.todos.extras.update.error;
export const selectTodosExtrasDeleteStatus = state =>
  state.todos.extras.delete.status;
export const selectTodosExtrasDeleteError = state =>
  state.todos.extras.delete.error;
export const selectTodosExtrasCurrentError = state => {
  let error = state.todos.extras.add.error
    ? state.todos.extras.add.error
    : state.todos.extras.update.error
    ? state.todos.extras.update.error
    : state.todos.extras.delete.error;
  return error;
};

export const selectTodosExtrasCurrentStatusLoading = state => {
  return (
    Boolean(state.todos.extras.add.status === 'loading') ||
    Boolean(state.todos.extras.update.status === 'loading') ||
    Boolean(state.todos.extras.delete.status === 'loading')
  );
};

export const selectTodosExtrasCurrentStatusSucceeded = state => {
  return (
    Boolean(state.todos.extras.add.status === 'succeeded') ||
    Boolean(state.todos.extras.update.status === 'succeeded') ||
    Boolean(state.todos.extras.delete.status === 'succeeded')
  );
};

export const {resetAddTodoState, resetUpdateTodoState, resetDeleteTodoState} =
  todosSlice.actions;

export default todosSlice.reducer;
