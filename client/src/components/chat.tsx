import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";

interface Response {
  id: number; // Unique ID for the message
  sender: string;
  text: string;
  timestamp: string | null;
}

const Chat = ({ username }: { username: string }) => {
  const [inputText, setInputText] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState(false);
  const [messages, setMessages] = useState<Response[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8000?username=${username}`);
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const newMessage: Response = JSON.parse(event.data);
      console.log(newMessage);

      setTypingUser(null);
      if (
        !messages.some(
          (msg) =>
            msg.text === newMessage.text && msg.sender === newMessage.sender
        )
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    return () => {
      newSocket.close();
    };
  }, [username, messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Response = {
      id: messages.length + 1,
      sender: username,
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket?.send(JSON.stringify(newMessage));

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="w-full max-w-sm rounded-lg shadow-sm border bg-white h-[500px] overflow-hidden flex flex-col">
      <div className="h-10 border-b w-full flex items-center justify-between px-3">
        <h4 className="lowercase">@{username}</h4>
        <h4 className="text-center font-semibold text-pink-500">Re-Chat</h4>
      </div>
      {messages.length <= 0 ? (
        <div className="flex-1 mx-auto mt-20 flex flex-col gap-2">
          <h2 className="font-semibold text-center">No new Messages</h2>
          <span className="text-xs text-gray-400">
            start messaging with people
          </span>
        </div>
      ) : (
        <div className="chat-area my-1 px-3 flex-1 flex flex-col gap-3 overflow-y-auto space-y-2 pt-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-1 ${
                msg.sender === username ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === username ? (
                <div className="h-12 w-12 rounded-full border bg-slate-800 text-white text-center align-middle flex items-center justify-center">
                  {username?.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <div className="h-12 w-12 min-w-12 rounded-full border bg-slate-800 text-pink-500 text-center align-middle flex items-center justify-center font-bold">
                  {msg.sender?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div
                className={`p-2 rounded-lg shadow-sm ${
                  msg.sender === username
                    ? "bg-white border text-black"
                    : "bg-gray-100 border text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center border rounded-md px-2 w-full py-2 justify-between">
        <textarea
          placeholder="Type your message"
          className="outline-none resize-none flex-1 px-2 h-auto max-h-56 overflow-auto"
          value={inputText}
          onChange={handleChange}
        ></textarea>
        <Send
          className="text-pink-500 hover:scale-110 transition-transform duration-150 cursor-pointer"
          onClick={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
