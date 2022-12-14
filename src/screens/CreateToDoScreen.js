import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

import ToDoHeader from '../components/ToDoHeader';
import {ToDoListContext} from '../contexts/ToDoListContext';

export default CreateToDoScreen = ({navigation}) => {
  const {toDoList, setToDoList} = useContext(ToDoListContext);

  const [toDoTitle, setToDoTitle] = useState('');
  const [toDoDescription, setToDoDescription] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  console.log('toDoList:', toDoList);

  const createToDo = (toDoTitle, toDoDescription = '') => {
    const now = new Date();
    const newToDo = {
      toDoTitle,
      toDoDescription,
      createdAt: now,
      isCompleted: false,
    };

    setToDoList([...toDoList, {...newToDo}]);

    console.log('toDoList:', toDoList);
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
    createToDo(toDoTitle, toDoDescription);
    // console.log("Todo created:", toDo);

    navigation.navigate('Home_to_ToDo');
  };

  return (
    <View style={styles.mainContainer}>
      <ToDoHeader />
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <Text style={styles.backButtonText}>{'<--'} Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headViewContainer}>
          <Text style={{fontWeight: 'bold'}}>Create new ToDo</Text>
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
              onChangeText={text => setToDoDescription(text)}
            />
          </View>
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              style={styles.submitButtonView}
              onPress={() => handleSubmit()}>
              <Text style={styles.submitButtonTextView}>Create</Text>
            </TouchableOpacity>
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
