import React, {useState, useContext, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

import ToDoHeader from '../components/ToDoHeader';
import OverlaySpinner from '../components/OverlaySpinner';
import CommonContext from '../contexts/CommonContext';
import UtilContext from '../contexts/UtilContext';
import {dateToString} from '../helpers/helpers';

const Item = ({toDo, index}) => {
  const navigation = useNavigation();
  const {toDoList} = useContext(CommonContext);
  const {updateToDo} = useContext(UtilContext);

  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickToDoCompletion = () => {
    setLoading(true);

    const theToDo = toDoList[index];
    updateRemoteToDo(
      theToDo.id,
      JSON.stringify({
        is_completed: !theToDo.isCompleted,
      }),
    );
  };

  const handleClickUpdateToDo = () => {
    console.log('clicked...');
    navigation.navigate('ToDo_to_UpdateToDo', {toDoIndex: index});
  };

  const updateRemoteToDo = async (id, data) => {
    try {
      await updateToDo(id, data);
      if (errorMessage) setErrorMessage('');
    } catch (error) {
      console.log(error);
      setErrorMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.itemViewContainer}>
      <View style={styles.item}>
        <TouchableOpacity
          disabled={isLoading}
          style={styles.titleContainerView}
          onPress={() => handleClickUpdateToDo()}>
          <Text style={styles.title}>
            <Text>
              {index + 1}
              {'. '}
            </Text>
            <Text
              style={{
                textDecorationLine: toDo.isCompleted ? 'line-through' : 'none',
              }}>
              {toDo.toDoTitle.length > 22
                ? toDo.toDoTitle.slice(0, 22) + '...'
                : toDo.toDoTitle}
            </Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.itemRightSightView}>
          <Text style={styles.itemDateView}>
            {dateToString(toDo.createdAt)}
          </Text>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.itemCheckView}
            onPress={() => handleClickToDoCompletion()}>
            {isLoading && <ActivityIndicator size="small" />}
            {!isLoading && (
              <Image
                style={styles.toDoCompletionImageView}
                source={
                  toDo.isCompleted
                    ? require('./../assets/imgs/done.png')
                    : require('./../assets/imgs/due.png')
                }
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageTextView}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default ToDoScreen = ({navigation, route}) => {
  const {toDoList} = useContext(CommonContext);
  const {getToDos} = useContext(UtilContext);

  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getAllToDos = async () => {
      try {
        await getToDos();
        if (errorMessage) setErrorMessage('');
      } catch (error) {
        console.log(error);
        setErrorMessage('Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
    getAllToDos();
  }, []);

  const renderItem = ({item, index}) => {
    return <Item toDo={item} index={index} />;
  };

  return (
    <View style={styles.mainContainer}>
      {isLoading && <OverlaySpinner message="Loading ToDos" />}
      <ToDoHeader />
      <View style={styles.container}>
        <View style={styles.headViewContainer}>
          <Text style={{fontWeight: 'bold'}}>My ToDos</Text>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => navigation.navigate('ToDo_to_CreateToDo')}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#00a0db',
                textDecorationLine: 'underline',
              }}>
              Create new
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listViewContainer}>
          {errorMessage && (
            <View style={styles.loadingView}>
              <Text style={{color: 'red'}}>{errorMessage}</Text>
            </View>
          )}
          {toDoList.length > 0 && (
            <FlatList
              data={toDoList}
              renderItem={props => renderItem(props)}
              keyExtractor={(item, index) => item.id}
            />
          )}
        </View>
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
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headViewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    textAlign: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 200,
    // backgroundColor: 'orange',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  listViewContainer: {
    flex: 18,
    // backgroundColor: 'red',
    width: '100%',
    paddingLeft: 20,
  },
  itemViewContainer: {
    marginVertical: 8,
    marginHorizontal: 5,
    // backgroundColor: 'red',
  },
  errorMessageContainer: {
    paddingHorizontal: 10,
  },
  errorMessageTextView: {
    color: 'red',
    fontSize: 12,
  },
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#c5c5c5',
    padding: 5,
    // marginVertical: 8,
    // marginHorizontal: 5,
    // height: 50,
    borderRadius: 5,
  },
  titleContainerView: {
    textAlignVertical: 'center',
    // backgroundColor: 'red',
  },
  title: {
    flex: 1,
    height: '100%',
    // backgroundColor: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  itemRightSightView: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    height: '100%',
  },
  itemDateView: {
    paddingRight: 5,
    height: '100%',
    // backgroundColor: 'yellow',
    padding: 5,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  itemCheckView: {
    height: '100%',
    // backgroundColor: 'red',
    marginLeft: 10,
    padding: 5,
  },
  toDoCompletionImageView: {
    width: 20,
    height: 20,
    resizeMode: 'stretch',
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
});
