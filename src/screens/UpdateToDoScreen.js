import React, {useState, useContext} from 'react';
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

import ToDoHeader from '../components/ToDoHeader';
import CommonContext from '../contexts/CommonContext';
import {getToDoObject} from '../helpers/toDoHelpers';
import {wait, resetToScreen} from '../helpers/helpers';
import {API_URL, WAITING_TIME} from '../config';

export default UpdateToDoScreen = ({navigation, route}) => {
  const {user, toDoList} = useContext(CommonContext);
  const toDoIndex = route.params.toDoIndex;

  // console.log('toDoList:', toDoList);

  const [toDoTitle, setToDoTitle] = useState(toDoList[toDoIndex]?.toDoTitle);
  const [toDoDescription, setToDoDescription] = useState(
    toDoList[toDoIndex]?.toDoDescription,
  );
  const [validationMessage, setValidationMessage] = useState('');
  const [toDoIsCompleted, setToDoIsCompleted] = useState(
    toDoList[toDoIndex]?.isCompleted,
  );
  const [isLoading, setLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateToDo = (toDoTitle, toDoDescription = '') => {
    setLoading(true);

    const theToDo = {
      ...toDoList[toDoIndex],
      toDoTitle,
      toDoDescription,
    };
    // toDoList[toDoIndex] = theToDo;
    // setToDoList([...toDoList]);

    updateRemoteToDo(
      theToDo.id,
      JSON.stringify({
        title: theToDo.toDoTitle,
        description: theToDo.toDoDescription,
      }),
    );
  };

  const deleteToDo = () => {
    setDeleting(true);
    const theToDo = toDoList[toDoIndex];
    deleteRemoteToDo(theToDo.id);
  };

  const handleSubmit = () => {
    setToDoTitle(toDoTitle.trim());
    setToDoDescription(toDoDescription.trim());

    if (!toDoTitle) {
      setValidationMessage('ToDo title is required!');
      return;
    }

    setValidationMessage('');

    console.log('Todo data:', toDoTitle, toDoDescription);
    updateToDo(toDoTitle, toDoDescription);
    // console.log("Todo created:", toDo);
  };

  const handleSubmitDeleteToDo = () => {
    deleteToDo();
  };

  const updateRemoteToDo = async (id, data) => {
    try {
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}tasks/${id}/`, {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Userid: user.id,
        },
      });
      const json = await response.json();
      const resToDo = getToDoObject(json);
      // setToDoList(
      //   toDoList.map(toDoItem => {
      //     if (toDoItem.id === resToDo.id) return resToDo;
      //     return toDoItem;
      //   }),
      // );
      console.log('data:', json);

      if (errorMessage) setErrorMessage('');

      // succesfully updated
      setLoading(false);
      // navigation.navigate('Home_to_ToDo');
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
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}tasks/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Userid: user.id,
        },
      });
      console.log(response);
      // const json = await response.json();
      // console.log(json);
      // later
      // setToDoList(
      //   toDoList.filter(toDoItem => {
      //     if (toDoItem.id === id) return false;
      //     return true;
      //   }),
      // );
      // console.log('data:', json);

      if (errorMessage) setErrorMessage('');

      // succesfully deleted
      setDeleting(false);
      // navigation.navigate('Home_to_ToDo');
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
        onPress: () => {
          console.log('Delete Pressed');
          handleSubmitDeleteToDo();
        },
      },
    ]);

  return (
    <View style={styles.mainContainer}>
      <ToDoHeader />
      <View style={styles.container}>
        <View style={styles.headViewContainer}>
          <Text style={{fontWeight: 'bold'}}>My ToDo</Text>
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
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity
                disabled={isLoading}
                style={styles.submitButtonView}
                onPress={() => createTwoButtonAlert()}>
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
            {!toDoIsCompleted && (
              <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={styles.submitButtonView}
                  onPress={() => handleSubmit()}>
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
