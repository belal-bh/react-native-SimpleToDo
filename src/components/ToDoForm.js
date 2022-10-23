import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useSelector, useDispatch} from 'react-redux';

import {
  addNewTodo,
  updateTodo,
  deleteTodo,
  resetAddTodoState,
  resetTodoStateById,
  selectTodosExtrasAddStatus,
  selectTodosExtrasAddError,
  selectTodoById,
} from '../features/todos/todosSlice';

import {resetToScreen} from '../helpers/helpers';

export default ToDoForm = ({todoId}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const toDo = todoId
    ? useSelector(state => selectTodoById(state, todoId))
    : undefined;
  const hasToDo = todoId && toDo ? true : false;

  const createTodoStatus = useSelector(selectTodosExtrasAddStatus);
  const createTodosError = useSelector(selectTodosExtrasAddError);

  const [toDoTitle, setToDoTitle] = useState(
    toDo?.toDoTitle ? toDo.toDoTitle : '',
  );
  const [toDoDescription, setToDoDescription] = useState(
    toDo?.toDoDescription ? toDo.toDoDescription : '',
  );
  const [validationMessage, setValidationMessage] = useState('');
  const [toDoIsCompleted, setToDoIsCompleted] = useState(
    toDo?.isCompleted ? true : false,
  );
  const isLoading =
    Boolean(toDo?.status === 'loading') ||
    Boolean(toDo?.status === 'deleting') ||
    Boolean(createTodoStatus === 'creating');

  const error = toDo?.error
    ? toDo.error
    : createTodosError
    ? createTodosError
    : null;

  const errorMessage = error;

  useEffect(() => {
    if (todoId && !hasToDo) {
      resetToScreen(navigation, 'Home_to_ToDo');
    }
    if (toDo?.status === 'succeeded') {
      dispatch(resetTodoStateById(toDo.id));
      resetToScreen(navigation, 'Home_to_ToDo');
    } else if (toDo?.status === 'deleted') {
      resetToScreen(navigation, 'Home_to_ToDo');
    } else if (createTodoStatus === 'created') {
      dispatch(resetAddTodoState());
      resetToScreen(navigation, 'Home_to_ToDo');
    }
  }, [
    hasToDo,
    createTodoStatus,
    toDo?.status,
    toDo?.error,
    toDo?.id,
    dispatch,
  ]);

  const handleSubmit = () => {
    setToDoTitle(toDoTitle.trim());
    setToDoDescription(toDoDescription.trim());
    if (!toDoTitle) {
      setValidationMessage('ToDo title is required.');
      return;
    }
    setValidationMessage('');
    console.log('Todo data:', toDoTitle, toDoDescription);

    if (toDo?.id) {
      const theToDo = {
        ...toDo,
        toDoTitle,
        toDoDescription,
      };

      dispatch(
        updateTodo({
          id: theToDo.id,
          data: {
            title: theToDo.toDoTitle,
            description: theToDo.toDoDescription,
          },
        }),
      );
    } else {
      dispatch(
        addNewTodo({
          title: toDoTitle,
          description: toDoDescription,
        }),
      );
    }
  };

  const handleSubmitDeleteToDo = () => {
    dispatch(deleteTodo({id: toDo.id}));
  };

  const createTwoButtonAlert = () =>
    Alert.alert('Confirm Delete', 'Are you sure to delete ToDo?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: handleSubmitDeleteToDo,
      },
    ]);

  return (
    <View style={styles.mainContainer}>
      {isLoading && <OverlaySpinner message="Processing..." />}
      <ToDoHeader />
      <View style={styles.container}>
        <View style={styles.headViewContainer}>
          <Text style={{fontWeight: 'bold'}}>
            {toDo?.id ? 'My ToDo' : 'Create new ToDo'}
          </Text>
        </View>
        {errorMessage && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessageTextView}>{errorMessage}</Text>
          </View>
        )}
        <ScrollView style={styles.inputViewContainer}>
          <View style={styles.inputGroupView}>
            <Text>
              Title <Text style={{color: 'red'}}>*</Text>
            </Text>
            <TextInput
              style={styles.textInputView}
              placeholder={'Enter title here'}
              value={toDoTitle}
              editable={!toDoIsCompleted}
              onChangeText={text => {
                if (text.trim() && validationMessage) setValidationMessage('');
                setToDoTitle(text);
              }}
            />
            {validationMessage && (
              <Text style={{color: 'red'}}>{validationMessage}</Text>
            )}
          </View>
          <View style={styles.inputGroupView}>
            <Text>Description</Text>
            <TextInput
              style={styles.textInputView}
              multiline={true}
              numberOfLines={4}
              placeholder={'Enter description here'}
              value={toDoDescription}
              editable={!toDoIsCompleted}
              onChangeText={text => setToDoDescription(text)}
            />
          </View>
          <View style={styles.buttonContainer}>
            {toDo?.id && (
              <View style={styles.deleteButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.submitButtonView}
                  onPress={createTwoButtonAlert}>
                  <Text style={styles.submitButtonTextView}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            {toDo?.id && !toDoIsCompleted && (
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.submitButtonView}
                  onPress={handleSubmit}>
                  <Text style={styles.submitButtonTextView}>Update</Text>
                </TouchableOpacity>
              </View>
            )}
            {!toDo?.id && (
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.submitButtonView}
                  onPress={handleSubmit}>
                  <Text style={styles.submitButtonTextView}>Create</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // textAlign:
    paddingLeft: 5,
    paddingRight: 5,
  },
  headViewContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 20,
  },
  inputViewContainer: {
    flex: 18,
    // backgroundColor: 'red',
    width: '100%',
    paddingLeft: 20,
  },
  errorMessageContainer: {
    width: '100%',
    paddingHorizontal: 30,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  errorMessageTextView: {
    color: 'red',
    fontSize: 18,
  },
  inputGroupView: {
    // backgroundColor: 'green',
    marginBottom: 10,
  },
  textInputView: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlignVertical: 'top',
    marginTop: 5,
    color: '#000',
  },
  buttonContainer: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButtonContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  submitButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  submitButtonView: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 30,
    backgroundColor: '#00a0db',
    borderRadius: 10,
  },
  submitButtonTextView: {
    color: 'white',
    fontSize: 20,
  },
});
