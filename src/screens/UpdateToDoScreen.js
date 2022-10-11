import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import ToDoHeader from '../components/ToDoHeader';
import {ToDoListContext} from '../contexts/ToDoListContext';

import {getToDoObject} from '../helpers/toDoHelpers';
import {wait} from '../helpers/helpers';
import {API_URL, WAITING_TIME} from '../config';

export default UpdateToDoScreen = ({navigation, route}) => {
  const {toDoList, setToDoList} = useContext(ToDoListContext);
  const toDoIndex = route.params.toDoIndex;

  // console.log('toDoList:', toDoList);

  const [toDoTitle, setToDoTitle] = useState(toDoList[toDoIndex].toDoTitle);
  const [toDoDescription, setToDoDescription] = useState(
    toDoList[toDoIndex].toDoDescription,
  );
  const [validationMessage, setValidationMessage] = useState('');
  const [toDoIsCompleted, setToDoIsCompleted] = useState(
    toDoList[toDoIndex].isCompleted,
  );
  const [isLoading, setLoading] = useState(false);

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

  const updateRemoteToDo = async (id, data) => {
    try {
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}todos/${id}/`, {
        method: 'PATCH',
        body: data,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      });
      const json = await response.json();
      const resToDo = getToDoObject(json);
      setToDoList(
        toDoList.map(toDoItem => {
          if (toDoItem.id === resToDo.id) return resToDo;
          return toDoItem;
        }),
      );
      console.log('data:', json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      navigation.navigate('Home_to_ToDo');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ToDoHeader />
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => {
              navigation.pop();
            }}>
            <Text style={styles.backButtonText}>{'<--'} Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headViewContainer}>
          <Text style={{fontWeight: 'bold'}}>My ToDo</Text>
        </View>
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
  backButtonContainer: {
    paddingVertical: 20,
  },
  backButtonText: {
    color: '#00a0db',
    fontSize: 16,
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
