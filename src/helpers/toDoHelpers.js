export const getToDoObject = data => {
  const toDo = {
    id: typeof data?.id === 'number' ? data.id : NaN,
    toDoTitle: data?.title ? data.title : '',
    toDoDescription: data?.description ? data.description : '',
    createdAt: data?.created_at ? new Date(data.created_at) : null,
    isCompleted:
      typeof data?.is_completed === 'boolean' ? data.is_completed : false,
  };
  return toDo;
};

export const getToDoObjectList = data => {
  return data.map(d => getToDoObject(d));
};

export const getToDoObjectSerializable = data => {
  const toDo = {
    id: typeof data?.id === 'number' ? data.id : NaN,
    toDoTitle: data?.title ? data.title : '',
    toDoDescription: data?.description ? data.description : '',
    createdAt: data?.created_at ? data.created_at : null,
    isCompleted:
      typeof data?.is_completed === 'boolean' ? data.is_completed : false,
    status: 'idle',
    error: null,
  };
  return toDo;
};

export const getToDoObjectListSerializable = data => {
  return data.map(d => getToDoObjectSerializable(d));
};
