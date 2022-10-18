import React, {useContext} from 'react';

import ToDoForm from '../components/ToDoForm';
import CommonContext from '../contexts/CommonContext';

export default UpdateToDoScreen = ({navigation, route}) => {
  const {toDoList} = useContext(CommonContext);
  const toDoIndex = route.params.toDoIndex;

  return <ToDoForm toDo={toDoList[toDoIndex]} />;
};
