import { io } from "socket.io-client";
const Socket = io(process.env.REACT_APP_SOCKET_URL);
export default Socket;
