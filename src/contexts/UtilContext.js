import React, {createContext, useContext, useState} from 'react';

import CommonContext from './CommonContext';
import {WAITING_TIME, API_URL} from '../config';
import {wait} from '../helpers/helpers';
import {getUserObject} from '../helpers/userHelpers';
import {getToDoObject, getToDoObjectList} from '../helpers/toDoHelpers';

export default UtilContext = createContext();

export function UtilContextProvider({children}) {
  const {user, setUser, toDoList, setToDoList} = useContext(CommonContext);

  const login = async userName => {
    try {
      console.log('Logging in ', userName);
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}login/`, {
        method: 'POST',
        body: JSON.stringify({
          username: userName,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      const newUser = getUserObject(json);

      console.log('new-user:', newUser);

      setUser({
        ...newUser,
        loggedIn: true,
      });
    } catch (error) {
      console.log(`ERROR at login: ${error}`);
      throw error;
    }
  };

  const getToDos = async () => {
    try {
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}tasks/`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Userid: user.id,
        },
      });
      const json = await response.json();

      setToDoList(getToDoObjectList(json));
    } catch (error) {
      console.log(`ERROR at getToDos: ${error}`);
      throw error;
    }
  };

  const createToDo = async data => {
    try {
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}tasks/`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Userid: user.id,
        },
      });
      const json = await response.json();
      const newToDo = getToDoObject(json);
      console.log('data:', json);
    } catch (error) {
      console.log(`ERROR at createToDo: ${error}`);
      throw error;
    }
  };

  const updateToDo = async (id, data) => {
    try {
      console.log(`id=${id}`);
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}tasks/${id}/`, {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Userid: user.id,
        },
      });
      const json = await response.json();
      const resToDo = getToDoObject(json);
      setToDoList(
        toDoList.map(toDoItem => {
          if (toDoItem.id === resToDo.id) return resToDo;
          return toDoItem;
        }),
      );
      console.log('data:', json);
    } catch (error) {
      console.log(`ERROR at updateToDo: ${error}`);
      throw error;
    }
  };

  return (
    <UtilContext.Provider
      value={{
        login,
        getToDos,
        createToDo,
        updateToDo,
      }}>
      {children}
    </UtilContext.Provider>
  );
}
