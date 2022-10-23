import React, {useEffect} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';

import {
  updateTodo,
  reloadAllTodos,
  selectTodoIds,
  selectTodoById,
  selectTodosStatusLoading,
  selectTodosError,
  selectTodosStatus,
  resetTodoStateById,
} from '../features/todos/todosSlice';

import {parseISO} from 'date-fns';

import ToDoHeader from '../components/ToDoHeader';
import OverlaySpinner from '../components/OverlaySpinner';
import {dateToString} from '../helpers/helpers';

const TodoExcerpt = ({todoId, index}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toDo = useSelector(state => selectTodoById(state, todoId));

  const isLoading = Boolean(toDo.status === 'loading');
  const errorMessage = toDo.error;
  const date = parseISO(toDo.createdAt);

  const handleClickUpdateToDo = () => {
    navigation.navigate('ToDo_to_UpdateToDo', {
      toDoIndex: index,
      todoId: todoId,
    });
  };

  const handleClickToDoCompletion = () => {
    dispatch(
      updateTodo({
        id: toDo.id,
        data: {
          is_completed: !toDo.isCompleted,
        },
      }),
    );
  };

  useEffect(() => {
    dispatch(resetTodoStateById(toDo.id));
  }, []);

  useEffect(() => {
    if (toDo.status === 'succeeded') {
      dispatch(resetTodoStateById(toDo.id));
    }
  }, [toDo.status, toDo.error, toDo.id, dispatch]);

  return (
    <View style={styles.itemViewContainer}>
      <View style={styles.item}>
        <TouchableOpacity
          disabled={isLoading}
          style={styles.titleContainerView}
          onPress={handleClickUpdateToDo}>
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
          <Text style={styles.itemDateView}>{dateToString(date)}</Text>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.itemCheckView}
            onPress={handleClickToDoCompletion}>
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
  const dispatch = useDispatch();
  const todosIds = useSelector(selectTodoIds);
  const status = useSelector(selectTodosStatus);

  const isLoading = useSelector(selectTodosStatusLoading);
  const errorMessage = useSelector(selectTodosError);
  console.log(
    `Loading: ${isLoading} , status: ${status}, error: ${errorMessage}, todosIds: ${todosIds} `,
  );

  useEffect(() => {
    dispatch(reloadAllTodos());
  }, []);

  const renderTodoItem = ({item, index}) => {
    return <TodoExcerpt todoId={item} index={index} />;
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
          {todosIds.length > 0 && (
            <FlatList
              data={todosIds}
              renderItem={props => renderTodoItem(props)}
              keyExtractor={(item, index) => item}
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
