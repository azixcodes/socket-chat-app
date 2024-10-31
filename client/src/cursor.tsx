import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
const Cursor = ({ username }: { username: string }) => {
  const url = `ws://localhost:8000`;

  const { sendJsonMessage } = useWebSocket(url, {
    queryParams: { username },
  });

  const throttleDur = 50;

  const sendJsonMessgethrottled = useRef(
    throttle(sendJsonMessage, throttleDur)
  );
  useEffect(() => {
    window.addEventListener("mousemove", (e: MouseEvent) => {
      sendJsonMessgethrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, []);

  return <div>Hello {username}</div>;
};

export default Cursor;
