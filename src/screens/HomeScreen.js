import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {
  selectUser,
  loginUser,
  selectUserStatus,
  selectUserError,
} from '../features/users/userSlice';

import ToDoHeader from '../components/ToDoHeader';
import OverlaySpinner from '../components/OverlaySpinner';
import {resetToScreen} from '../helpers/helpers';

export default HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  const isLoading = Boolean(status === 'loading');
  const errorMessage = error;

  const [userName, setUserName] = useState(user.userFullName);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (Boolean(status === 'succeeded')) {
      resetToScreen(navigation, 'Home_to_ToDo');
    }
  }, [status]);

  const handleSubmit = () => {
    setUserName(userName.trim());
    if (!userName) {
      setValidationMessage('Name is required.');
      return;
    }
    setValidationMessage('');

    dispatch(loginUser({username: userName}));
  };

  return (
    <View style={styles.mainContainer}>
      {isLoading && <OverlaySpinner color="green" message="Wait a second..." />}
      <ToDoHeader />
      {!isLoading && (
        <View style={styles.container}>
          {errorMessage && (
            <View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessageTextView}>{errorMessage}</Text>
            </View>
          )}
          <View style={styles.inputContainerView}>
            <TextInput
              style={styles.textInputView}
              placeholder="Your Name"
              maxLength={18}
              value={userName}
              onChangeText={text => {
                text = text.slice(0, 18);
                setUserName(text);
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
              onPress={handleSubmit}>
              <Text style={styles.buttonTextView}>Next</Text>
            </TouchableOpacity>
          </View>
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
});
