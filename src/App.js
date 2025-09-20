import { useState } from "react";
import OpenAI from "openai";

// ✅ Read API key from .env
const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: newMessages
      });

      const reply = res.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Error talking to OpenAI:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Something went wrong. Check your API key." }
      ]);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Welcome to vidurai.com</h1>
      <div style={{
        border: "1px solid #ddd",
        width: "80%",
        margin: "20px auto",
        padding: "10px",
        minHeight: "200px",
        textAlign: "left"
      }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.role}:</b> {m.content}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: "70%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 12px", marginLeft: "8px" }}>
        Send
      </button>
    </div>
  );
}

export default App;
