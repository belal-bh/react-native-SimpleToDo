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

import {API_URL, WAITING_TIME} from '../config';
import {ToDoListContext} from '../contexts/ToDoListContext';
import {getToDoObject, getToDoObjectList} from '../helpers/toDoHelpers';
import {wait, dateToString} from '../helpers/helpers';

const Item = ({toDo, index}) => {
  const navigation = useNavigation();
  // console.log('toDo:', toDo);
  const {toDoList, setToDoList} = useContext(ToDoListContext);

  const [isLoading, setLoading] = useState(false);

  const toggleToDoIsCompleted = index => {
    const theToDo = toDoList[index];
    // theToDo.isCompleted = !theToDo.isCompleted;

    updateRemoteToDo(
      theToDo.id,
      JSON.stringify({
        is_completed: !theToDo.isCompleted,
      }),
    );

    // toDoList[index] = theToDo;
    // setToDoList([...toDoList]);

    // console.log('toDoList:', toDoList);
  };

  const handleClickToDoCompletion = () => {
    setLoading(true);
    toggleToDoIsCompleted(index);
  };

  const handleClickUpdateToDo = () => {
    console.log('clicked...');
    navigation.navigate('ToDo_to_UpdateToDo', {toDoIndex: index});
  };

  const updateRemoteToDo = async (id, data) => {
    try {
      console.log(`id=${id}`);
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
    }
  };

  return (
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
            {toDo.toDoTitle.length > 19
              ? toDo.toDoTitle.slice(0, 19) + '...'
              : toDo.toDoTitle}
          </Text>
        </Text>
      </TouchableOpacity>
      <View style={styles.itemRightSightView}>
        <Text style={styles.itemDateView}>{dateToString(toDo.createdAt)}</Text>
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
  );
};

export default ToDoScreen = ({navigation}) => {
  const {toDoList, setToDoList} = useContext(ToDoListContext);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getToDos = async () => {
    try {
      await wait(WAITING_TIME);
      const response = await fetch(`${API_URL}todos/`);
      const json = await response.json();
      setData(json);
      console.log('data:', json);

      setToDoList(getToDoObjectList(json));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToDos();
  }, []);

  const renderItem = ({item, index}) => {
    // console.log('index', index);
    return <Item toDo={item} index={index} />;
  };

  return (
    <View style={styles.mainContainer}>
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
          {isLoading && (
            <View style={styles.loadingView}>
              <ActivityIndicator size="large" />
              <Text>Loading ToDos</Text>
            </View>
          )}
          {toDoList.length > 0 && (
            <FlatList
              data={toDoList}
              renderItem={props => renderItem(props)}
              keyExtractor={(item, index) => index}
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
  item: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#c5c5c5',
    padding: 5,
    marginVertical: 8,
    marginHorizontal: 5,
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
