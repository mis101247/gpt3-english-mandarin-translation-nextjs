import React, { useState, useEffect } from "react";
import ResponseMsg from "./ResponseMsg";
import SendMsg from "./SendMsg";

const Chat = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLength, setMessagesLength] = useState(0);
  const [lastResponse, setLastResponse] = useState("");

  useEffect(() => {
    const historyMessages = localStorage.getItem("messages");
    if (historyMessages) {
      setMessages(JSON.parse(historyMessages));
      setMessagesLength(JSON.parse(historyMessages).length);
    }
  }, []);

  useEffect(() => {
    const el = document.getElementById("messages");
    el.scrollTop = el.scrollHeight;
  }, [messagesLength]);

  const prompt = `Translate the input text, if there is include Chinese words, translate it into English, if there is no Chinese, translate it into Traditional Chinese. \n\nInput text:
  

  ${text}`;

  const translate = async (e: any) => {
    e.preventDefault();

    if (text.length > 300) {
      alert("The text is too long, please enter less than 300 characters.");
      return null;
    }

    const newMessage = {
      text,
      msgDateTime: new Date().toISOString(),
      type: "request",
    };
    const newMessages = messages ? [...messages, newMessage] : [newMessage];
    setMessages(newMessages);
    setLastResponse("");
    setText("");
    setMessagesLength(newMessages.length);

    localStorage.setItem("messages", JSON.stringify(newMessages));

    const response = await fetch("/api/openAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      console.error(response.statusText);
      alert("Something went wrong, please try again later.");
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let lastResponseComplete = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      // set the last response
      setLastResponse((prev) => prev + chunkValue);
      lastResponseComplete = lastResponseComplete + chunkValue;
    }

    if (done) {
      // save the response message to local storage
      const newResponseMessage = {
        text: lastResponseComplete,
        msgDateTime: new Date().toISOString(),
        type: "response",
      };
      const newResponseMessages = messages
        ? [...messages, newMessage, newResponseMessage]
        : [newResponseMessage];
      localStorage.setItem("messages", JSON.stringify(newResponseMessages));
      setMessages(newResponseMessages);
      setLastResponse("");
      setMessagesLength(newResponseMessages.length);
    }
  };

  return (
    <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
      <div
        id="messages"
        className="flex flex-col flex-grow h-0 p-4 overflow-auto"
      >
        {messages &&
          messages.map((message: any, index: number) => {
            if (message.type === "request") {
              return (
                <SendMsg
                  key={index}
                  text={message.text}
                  msgDateTime={message.msgDateTime}
                ></SendMsg>
              );
            } else {
              return (
                <ResponseMsg
                  key={index}
                  text={message.text}
                  msgDateTime={message.msgDateTime}
                ></ResponseMsg>
              );
            }
          })}

        {lastResponse && (
          <ResponseMsg
            text={lastResponse}
            msgDateTime={new Date().toISOString()}
          ></ResponseMsg>
        )}
      </div>

      <div className="bg-gray-300 p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-24 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          placeholder="Type text here..."
        ></textarea>
        <div className="flex justify-between mt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => {
              localStorage.removeItem("messages");
              setMessages([]);
              setMessagesLength(0);
            }}
          >
            Clear History
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={translate}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
