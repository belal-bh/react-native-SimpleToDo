import React, {createContext, useState} from 'react';

const toDoListContextInitialValue = [];
const userContextInitialValue = {
  id: NaN,
  userFullName: '',
  loggedIn: false,
  email: '',
};

export default CommonContext = createContext();

export function CommonContextProvider({children}) {
  const [user, setUser] = useState(userContextInitialValue);
  const [toDoList, setToDoList] = useState(toDoListContextInitialValue);

  return (
    <CommonContext.Provider
      value={{
        user,
        toDoList,
        setUser,
        setToDoList,
      }}>
      {children}
    </CommonContext.Provider>
  );
}
