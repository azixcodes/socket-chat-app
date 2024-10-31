import { useState } from "react";
import Login from "./components/login";

import Chat from "./components/chat";
const App = () => {
  const [username, setUsername] = useState("");
  return (
    <>
      {username ? (
        <div className="flex h-screen w-full justify-center items-center">
          <Chat username={username} />
        </div>
      ) : (
        <Login onSubmit={setUsername} />
      )}
    </>
  );
};

export default App;
