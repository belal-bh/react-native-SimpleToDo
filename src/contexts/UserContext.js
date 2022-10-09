import React from 'react';

export const userContextInitialValue = {
  userFullName: '',
  loggedIn: false,
};

export const UserContext = React.createContext(userContextInitialValue);
