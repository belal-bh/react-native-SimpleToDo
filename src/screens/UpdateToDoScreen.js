import React from 'react';

import ToDoForm from '../components/ToDoForm';

export default UpdateToDoScreen = ({navigation, route}) => {
  const todoId = route.params.todoId;
  return <ToDoForm todoId={todoId} />;
};
