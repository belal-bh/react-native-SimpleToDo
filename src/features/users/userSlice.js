import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import {API_URL, WAITING_TIME} from '../../config';

import {wait} from '../../helpers/helpers';
import {getUserObject} from '../../helpers/userHelpers';

import {resetTodos} from '../todos/todosSlice';

export const loginUser = createAsyncThunk('user/loginUser', async data => {
  await wait(WAITING_TIME);
  const response = await fetch(`${API_URL}login/`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return getUserObject(json);
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      id: NaN,
      userFullName: '',
      loggedIn: false,
      email: '',
    },
    status: 'idle',
    error: null,
  },
  reducers: {
    resetUserState(state, action) {
      state.status = 'idle';
      state.error = null;
    },
    logoutUser(state, action) {
      state.status = 'idle';
      state.error = null;
      state.user.id = NaN;
      state.user.userFullName = '';
      state.user.loggedIn = false;
      state.user.email = '';
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      state.status = 'loading';
      state.error = null;
    },
    [loginUser.fulfilled]: (state, action) => {
      state.user = {...action.payload, loggedIn: true};
      state.status = 'succeeded';
      state.error = null;
    },
    [loginUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export const selectUserStatus = state => state.user.status;
export const selectUserError = state => state.user.error;
export const selectUser = state => state.user.user;
export const selectUserId = state => state.user.user.id;
export const selectUserIsLoggedIn = state => state.user.user.loggedIn;

export const {resetUserState, logoutUser} = userSlice.actions;

export default userSlice.reducer;

export const logoutAndResetStore = () => async dispatch => {
  dispatch(logoutUser());
  dispatch(resetTodos());
};
