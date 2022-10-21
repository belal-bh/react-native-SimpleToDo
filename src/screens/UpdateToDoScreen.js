import React, {useContext} from 'react';

import {useSelector, useDispatch} from 'react-redux';

import {selectTodoById} from '../features/todos/todosSlice';

import ToDoForm from '../components/ToDoForm';
import CommonContext from '../contexts/CommonContext';

export default UpdateToDoScreen = ({navigation, route}) => {
  const {toDoList} = useContext(CommonContext);
  const toDoIndex = route.params.toDoIndex;

  const todoId = route.params.todoId;

  const todo = useSelector(state => selectTodoById(state, todoId));

  // return <ToDoForm toDo={toDoList[toDoIndex]} />;
  return <ToDoForm toDo={todo} />;
};
