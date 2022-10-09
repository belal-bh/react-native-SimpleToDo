import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

import {ToDoListContext} from '../contexts/ToDoListContext';

const dateToString = date => {
  try {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = String(date.getFullYear());

    const dateStr = dd + '/' + mm + '/' + yyyy.slice(2, 4);
    return dateStr;
  } catch (err) {
    console.log('💥💥💥 ERROR: ', err);
    return '';
  }
};

const Item = ({toDo, index}) => {
  const navigation = useNavigation();
  console.log('toDo:', toDo);
  const {toDoList, setToDoList} = useContext(ToDoListContext);

  const complteteToDo = index => {
    const theToDo = toDoList[index];
    theToDo.isCompleted = !theToDo.isCompleted;

    toDoList[index] = theToDo;
    setToDoList([...toDoList]);

    console.log('toDoList:', toDoList);
  };

  const handleClickToDoCompletion = () => {
    complteteToDo(index);
  };

  const handleClickUpdateToDo = () => {
    navigation.navigate('ToDo_to_UpdateToDo', {toDoIndex: index});
  };

  return (
    <View style={styles.item}>
      <TouchableOpacity
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
          style={styles.itemCheckView}
          onPress={() => handleClickToDoCompletion()}>
          <Image
            style={styles.toDoCompletionImageView}
            source={
              toDo.isCompleted
                ? require('./../assets/imgs/done.png')
                : require('./../assets/imgs/due.png')
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToDoScreen = ({navigation}) => {
  const {toDoList} = useContext(ToDoListContext);

  const renderItem = ({item, index}) => {
    console.log('index', index);
    return <Item toDo={item} index={index} />;
  };

  return (
    <View style={styles.mainContainer}>
      <ToDoHeader />
      <View style={styles.container}>
        <View style={styles.headViewContainer}>
          <Text style={{fontWeight: 'bold'}}>My ToDos</Text>
          <TouchableOpacity
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
    width: 35,
    height: 30,
    resizeMode: 'stretch',
  },
});
