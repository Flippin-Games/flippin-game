const formatTime = (time) => new Date(time).toISOString().substr(11, 8);

export default formatTime;
