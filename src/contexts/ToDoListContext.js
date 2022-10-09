import React from 'react';

// const now = new Date();
// {
//   toDoTitle: '',
//   toDoDescription: '',
//   createdAt: null,
//   isCompleted: false,
// },

export const toDoListContextInitialValue = [];

export const ToDoListContext = React.createContext(toDoListContextInitialValue);
