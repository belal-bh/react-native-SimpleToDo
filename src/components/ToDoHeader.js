import React, {useContext} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';

import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import {UserContext} from '../contexts/UserContext';
import {ToDoListContext} from '../contexts/ToDoListContext';

export default ToDoHeader = props => {
  const navigation = useNavigation();

  const {user, setUser} = useContext(UserContext);
  const {setToDoList} = useContext(ToDoListContext);

  const handleClickLogout = () => {
    console.log('Clicked!');
    setUser({
      userFullName: '',
      loggedIn: false,
    });

    // clear toDoList
    setToDoList([]);

    // reset navigation
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'App_to_Home'}],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.toDoTextView}>ToDo</Text>
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
    color: 'white',
  },
  toDoTextView: {
    marginRight: 10,
    fontSize: 20,
    color: 'white',
  },
  logoutImageView: {
    width: 25,
    height: 25,
  },
});
