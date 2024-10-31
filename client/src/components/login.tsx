import React, { FC, useState } from "react";
interface Props {
  onSubmit: (username: string) => void;
}
const Login: FC<Props> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  return (
    <div className="w-full  h-screen items-center content-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(username);
        }}
        className="w-full max-w-sm p-3 flex flex-col mx-auto gap-2"
      >
        <h1>Welcome to Live cursor App</h1>
        <input
          type="text"
          placeholder="@username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="outline-none border rounded-md px-1 py-1.5"
        />
        <button
          type="submit"
          className="border px-2 py-1.5 rounded-md mx-auto w-32"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default Login;
