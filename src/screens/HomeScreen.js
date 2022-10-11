import React, {useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {StackActions} from '@react-navigation/native';

import {UserContext} from '../contexts/UserContext';

import ToDoHeader from '../components/ToDoHeader';
import {API_URL, WAITING_TIME} from '../config';
import {wait} from '../helpers/helpers';

export default HomeScreen = ({navigation}) => {
  const {user, setUser} = useContext(UserContext);

  const [userName, setUserName] = useState(user.userFullName);
  const [validationMessage, setValidationMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = () => {
    setUserName(userName.trim());
    if (!userName) {
      setValidationMessage('Name is required.');
      return;
    }

    setValidationMessage('');

    console.log('User:', user);

    setLoading(true);
    loginUser(userName);

    console.log(`UserName: ${userName}`);
  };

  const loginUser = async userName => {
    try {
      console.log('Logging in ', userName);
      await wait(WAITING_TIME);

      setUser({
        ...user,
        userFullName: userName,
        loggedIn: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      console.log(`Hi ${userName}!`);
      navigation.dispatch(StackActions.replace('Home_to_ToDo'));
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ToDoHeader />
      {!isLoading ? (
        <View style={styles.container}>
          <View style={styles.inputContainerView}>
            <TextInput
              style={styles.textInputView}
              placeholder="Your Name"
              maxLength={18}
              value={userName}
              onChangeText={text => {
                text = text.slice(0, 18);
                setUserName(text);
                // console.log(text);
                if (text && validationMessage) setValidationMessage('');
              }}
            />
            {validationMessage && (
              <Text style={styles.validationMessageView}>
                {validationMessage}
              </Text>
            )}
          </View>
          <View style={styles.buttonViewContainer}>
            <TouchableOpacity
              disabled={isLoading}
              style={styles.buttonViewContainer}
              onPress={() => handleSubmit()}>
              <Text style={styles.buttonTextView}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
          <Text>Wait a second...</Text>
        </View>
      )}
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
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  inputContainerView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: 20,
  },
  textInputView: {
    borderColor: '#fefefe',
    borderRadius: 10,
    borderWidth: 1,
    width: '80%',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  buttonViewContainer: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom: 30,
    backgroundColor: '#00a0db',
    borderRadius: 10,
  },
  buttonTextView: {
    color: 'white',
    fontSize: 20,
  },
  validationMessageView: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // backgroundColor: 'green',
    paddingHorizontal: 10,
    color: 'red',
  },
});
