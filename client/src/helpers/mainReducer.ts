const mainReducer = (state: any, action: any) => {
  const { data } = action;

  switch (action.type) {
    case "timestampBatch":
    case "currentTime":
      console.log(action.type, data);
      return {
        ...state,
        [action.type]: new Date(data).toISOString().substr(11, 8),
      };
    case "users":
    case "settings":
    case "counter":
    case "previousUser":
    case "username":
    case "isInRoom":
      return { ...state, [action.type]: data };

    default:
      return state;
  }
};

export default mainReducer;
