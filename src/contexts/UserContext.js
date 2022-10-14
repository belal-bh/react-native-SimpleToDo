import React from 'react';

export const userContextInitialValue = {
  id: NaN,
  userFullName: '',
  loggedIn: false,
  email: '',
};

export const UserContext = React.createContext(userContextInitialValue);
