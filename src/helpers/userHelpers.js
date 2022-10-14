export const getUserObject = data => {
  const user = {
    id: typeof data?.id === 'number' ? data.id : NaN,
    userFullName: data?.username ? data.username : '',
    email: data?.email ? data.email : '',
    loggedIn: typeof data?.logged_in === 'boolean' ? data.logged_in : false,
  };
  return user;
};
