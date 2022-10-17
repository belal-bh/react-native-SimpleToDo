import React, {createContext, useContext, useState} from 'react';

import CommonContext from './CommonContext';
import {WAITING_TIME, API_URL} from '../config';
import {wait} from '../helpers/helpers';
import {getUserObject} from '../helpers/userHelpers';

export default UtilContext = createContext();

export function UtilContextProvider({children}) {
  const {setUser} = useContext(CommonContext);

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

  return (
    <UtilContext.Provider
      value={{
        login,
      }}>
      {children}
    </UtilContext.Provider>
  );
}
