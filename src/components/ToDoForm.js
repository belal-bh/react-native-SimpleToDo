import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useSelector, useDispatch} from 'react-redux';

import {
  addNewTodo,
  resetAddTodoState,
  resetUpdateTodoState,
  resetDeleteTodoState,
  resetTodosExtras,
  selectTodosExtras,
  selectTodosExtrasCurrentError,
  selectTodosExtrasCurrentStatusLoading,
  selectTodosExtrasCurrentStatusSucceeded,
} from '../features/todos/todosSlice';

import UtilContext from '../contexts/UtilContext';
import {resetToScreen} from '../helpers/helpers';

export default ToDoForm = ({toDo}) => {
  console.log('ToDoForm toDo:', toDo);

  const dispatch = useDispatch();

  let status = 'idle';
  let error = null;
  if (toDo?.id) {
    status = useSelector(state => state.todos.extras.update.status);
    error = useSelector(state => state.todos.extras.update.error);
  } else {
    status = useSelector(state => state.todos.extras.add.status);
    error = useSelector(state => state.todos.extras.add.error);
  }

  const todosExtras = useSelector(state => selectTodosExtras(state));

  console.log(`status: ${status}`);
  console.log(`error: ${error}`);

  const navigation = useNavigation();

  const {createToDo, updateToDo, deleteToDo} = useContext(UtilContext);

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
  const [isLoading, setLoading] = useState(Boolean(status === 'loading'));
  const [isDeleting, setDeleting] = useState(
    Boolean(todosExtras.delete.status === 'loading'),
  );
  const [errorMessage, setErrorMessage] = useState(
    useSelector(state => selectTodosExtrasCurrentError(state)),
  );

  const [isSucceeded, setSucceeded] = useState(
    useSelector(state => selectTodosExtrasCurrentStatusSucceeded(state)),
  );

  useEffect(() => {
    if (isSucceeded) {
      console.log('redirecting');
      if (toDo?.id) {
        dispatch(resetUpdateTodoState());
        dispatch(resetDeleteTodoState());
      } else {
        dispatch(resetAddTodoState());
      }
      resetToScreen(navigation, 'Home_to_ToDo');
    }
  }, [status, navigation, dispatch]);

  const handleSubmit = () => {
    setToDoTitle(toDoTitle.trim());
    setToDoDescription(toDoDescription.trim());

    if (!toDoTitle) {
      setValidationMessage('ToDo title is required.');
      return;
    }
    setValidationMessage('');
    console.log('Todo data:', toDoTitle, toDoDescription);

    setLoading(true);
    if (toDo?.id) {
      const theToDo = {
        ...toDo,
        toDoTitle,
        toDoDescription,
      };

      updateRemoteToDo(
        theToDo.id,
        JSON.stringify({
          title: theToDo.toDoTitle,
          description: theToDo.toDoDescription,
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
    setDeleting(true);
    deleteRemoteToDo(toDo.id);
  };

  const uploadToDo = async data => {
    try {
      await createToDo(data);
      if (errorMessage) setErrorMessage('');

      setLoading(false);
      resetToScreen(navigation, 'Home_to_ToDo');
    } catch (error) {
      console.log(error);
      setErrorMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const updateRemoteToDo = async (id, data) => {
    try {
      await updateToDo(id, data);
      if (errorMessage) setErrorMessage('');
      setLoading(false);
      resetToScreen(navigation, 'Home_to_ToDo');
    } catch (error) {
      console.log(error);
      setErrorMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const deleteRemoteToDo = async id => {
    try {
      await deleteToDo(id);
      if (errorMessage) setErrorMessage('');
      setDeleting(false);
      resetToScreen(navigation, 'Home_to_ToDo');
    } catch (error) {
      console.log(error);
      setErrorMessage('Something went wrong.');
    } finally {
      setDeleting(false);
    }
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
                  <Text style={styles.submitButtonTextView}>
                    {isDeleting ? (
                      <Text>
                        <ActivityIndicator size="small" color="red" />
                        <Text>Deleting</Text>
                      </Text>
                    ) : (
                      'Delete'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {toDo?.id && !toDoIsCompleted && (
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.submitButtonView}
                  onPress={handleSubmit}>
                  <Text style={styles.submitButtonTextView}>
                    {isLoading ? (
                      <Text>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text>Updating</Text>
                      </Text>
                    ) : (
                      'Update'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {!toDo?.id && (
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.submitButtonView}
                  onPress={handleSubmit}>
                  <Text style={styles.submitButtonTextView}>
                    {isLoading ? (
                      <Text>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text>Uploading</Text>
                      </Text>
                    ) : (
                      'Create'
                    )}
                  </Text>
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
