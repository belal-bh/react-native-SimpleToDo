import React, {useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {selectUser, logoutAndResetStore} from '../features/users/userSlice';
import {resetToScreen} from '../helpers/helpers';

export default ToDoHeader = props => {
  const navigation = useNavigation();
  const route = useRoute();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleClickLogout = () => {
    dispatch(logoutAndResetStore());
  };

  useEffect(() => {
    if (!user.loggedIn && !Boolean(route.name === 'App_to_Home')) {
      resetToScreen(navigation, 'App_to_Home');
    }
  }, [user.loggedIn, route.name]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) navigation.goBack();
        }}>
        <Text style={styles.toDoTextView}>
          {navigation.canGoBack() && (
            <Image
              style={styles.goBackIcon}
              source={require('./../assets/imgs/left-arrow.png')}
            />
          )}
          {/* {navigation.canGoBack() && <Text>{'<--'}</Text>} */}
          <Text>ToDo</Text>
        </Text>
      </TouchableOpacity>
      {user.loggedIn && (
        <View style={styles.rightContainer}>
          <Text style={styles.userNameTextView}>{user.userFullName}</Text>
          <TouchableOpacity onPress={() => handleClickLogout()}>
            <Image
              style={styles.logoutImageView}
              source={require('./../assets/imgs/logout-20-16.png')}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row',
    // flexWrap:'wrap',
    backgroundColor: '#00a0db',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    color: 'white',
  },
  rightContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'green',
    justifyContent: 'flex-end',
  },
  userNameTextView: {
    marginRight: 10,
    fontSize: 20,
    color: '#000',
  },
  toDoTextView: {
    marginRight: 10,
    fontSize: 20,
    color: '#000',
  },
  logoutImageView: {
    width: 25,
    height: 25,
  },
  goBackIcon: {
    width: 20,
    height: 15,
    paddingRight: 5,
  },
});
