import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import {API_URL, WAITING_TIME} from '../../config';
import {
  getToDoObjectListSerializable,
  getToDoObjectSerializable,
} from '../../helpers/toDoHelpers';
import {wait} from '../../helpers/helpers';

import {selectUserId} from '../users/userSlice';
import {store} from '../../app/store';

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const userId = selectUserId(store.getState());
  console.log('userId:', userId);
  await wait(WAITING_TIME);
  const response = await fetch(`${API_URL}tasks/`, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Userid: userId,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return getToDoObjectListSerializable(json);
});

export const addNewTodo = createAsyncThunk('todos/addNewTodo', async data => {
  const userId = selectUserId(store.getState());
  console.log('userId:', userId);
  await wait(WAITING_TIME);
  const response = await fetch(`${API_URL}tasks/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Userid: userId,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return getToDoObjectSerializable(json);
});

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({id, data}) => {
    const userId = selectUserId(store.getState());
    console.log('userId:', userId);
    console.log(
      `id=${id}, data=${data?.title ? data.title : data?.is_completed}`,
    );
    await wait(WAITING_TIME);
    const response = await fetch(`${API_URL}tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Userid: userId,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return getToDoObjectSerializable(json);
  },
);

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async ({id}) => {
  const userId = selectUserId(store.getState());
  console.log('userId:', userId);
  console.log(`id=${id}`);
  await wait(WAITING_TIME);
  const response = await fetch(`${API_URL}tasks/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Userid: userId,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  // console.log(response);
});

const todosAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const {
  selectAll: selectAllTodos,
  selectIds: selectTodoIds,
  selectById: selectTodoById,
} = todosAdapter.getSelectors(state => state.todos);

export const selectTodoStatusById = (state, todoId) => {
  const todo = selectTodoById(state, todoId);
  return todo.status;
};

export const selectTodoErrorById = (state, todoId) => {
  const todo = selectTodoById(state, todoId);
  return todo.error;
};

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
    },
  }),
  reducers: {
    resetAddTodoState(state, action) {
      state.extras.add.status = 'idle';
      state.extras.add.error = null;
    },
    resetTodosExtras(state, action) {
      state.extras.add.status = 'idle';
      state.extras.add.error = null;
    },
    todosCleared: todosAdapter.removeAll,
    resetTodosState(state, action) {
      if (state.status !== 'idle') state.status = 'idle';
      if (state.error !== null) state.error = null;
    },
    resetTodoStateById(state, action) {
      const todoId = action.payload;
      todosAdapter.updateOne(state, {
        id: todoId,
        changes: {status: 'idle', error: null},
      });
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
      state.status = 'failed';
      state.error = action.error.message;
    },
    [addNewTodo.pending]: (state, action) => {
      state.extras.add.status = 'creating';
      state.extras.add.error = null;
    },
    [addNewTodo.fulfilled]: (state, action) => {
      todosAdapter.addOne(state, action.payload);
      state.extras.add.status = 'created';
    },
    [addNewTodo.rejected]: (state, action) => {
      state.extras.add.status = 'failed';
      state.extras.add.error = action.error.message;
    },
    [updateTodo.pending]: (state, action) => {
      const id = action.meta.arg.id;
      todosAdapter.updateOne(state, {
        id,
        changes: {
          status: 'loading',
          error: null,
        },
      });
    },
    [updateTodo.fulfilled]: (state, action) => {
      const {id, toDoTitle, toDoDescription, isCompleted} = action.payload;
      todosAdapter.updateOne(state, {
        id,
        changes: {
          toDoTitle,
          toDoDescription,
          isCompleted,
          status: 'succeeded',
          error: null,
        },
      });
    },
    [updateTodo.rejected]: (state, action) => {
      const id = action.meta.arg.id;
      todosAdapter.updateOne(state, {
        id,
        changes: {
          status: 'failed',
          error: action.error.message,
        },
      });
    },
    [deleteTodo.pending]: (state, action) => {
      const id = action.meta.arg.id;
      todosAdapter.updateOne(state, {
        id,
        changes: {
          status: 'deleting',
          error: null,
        },
      });
    },
    [deleteTodo.fulfilled]: (state, action) => {
      const id = action.meta.arg.id;
      todosAdapter.updateOne(state, {
        id,
        changes: {
          status: 'deleted',
          error: null,
        },
      });
      todosAdapter.removeOne(state, id);
    },
    [deleteTodo.rejected]: (state, action) => {
      const id = action.meta.arg.id;
      todosAdapter.updateOne(state, {
        id,
        changes: {
          status: 'failed',
          error: action.error.message,
        },
      });
    },
  },
});

export const selectTodosStatus = state => state.todos.status;
export const selectTodosError = state => state.todos.error;
export const selectTodosStatusLoading = state =>
  Boolean(state.todos.status === 'loading');
export const selectTodosStatusSucceeded = state =>
  Boolean(state.todos.status === 'succeeded');

export const selectTodosExtras = state => state.todos.extras;
export const selectTodosExtrasAddStatus = state =>
  state.todos.extras.add.status;
export const selectTodosExtrasAddError = state => state.todos.extras.add.error;

export const {
  resetAddTodoState,
  resetTodosExtras,
  todosCleared,
  resetTodosState,
  resetTodoStateById,
} = todosSlice.actions;

export default todosSlice.reducer;

export const reloadAllTodos = () => async dispatch => {
  dispatch(resetTodosState());
  dispatch(resetTodosExtras());
  // dispatch(todosCleared());
  dispatch(fetchTodos());
};

export const resetTodos = () => dispatch => {
  dispatch(resetTodosState());
  dispatch(resetTodosExtras());
  dispatch(todosCleared());
};
