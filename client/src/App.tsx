import { useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const connect = () => {
    const socket = io("http://localhost:9000");
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="App">
      <header className="App-header"> Hello app</header>
    </div>
  );
}

export default App;
