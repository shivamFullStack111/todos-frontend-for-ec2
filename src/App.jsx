import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch todos on load
  useEffect(() => {
    fetchTodos();
  }, []);
  const DBURL = import.meta.env.VITE_DBURL;

  const fetchTodos = async () => {
    const res = await axios.get(`${DBURL}/get-all`);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await axios.post(`${DBURL}/add`, { text });
    setTodos([...todos, res.data]);
    setText("");
  };

  const updateTodo = async (id) => {
    const res = await axios.put(`${DBURL}/update/${id}`, { text: editText });
    setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    setEditId(null);
    setEditText("");
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${DBURL}delete/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Todo List</h2>

      <input
        type="text"
        placeholder="Enter todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "70%", marginRight: "10px" }}
      />
      <button onClick={addTodo}>Add</button>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ marginBottom: "10px" }}>
            {editId === todo._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => updateTodo(todo._id)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <button
                  onClick={() => {
                    setEditId(todo._id);
                    setEditText(todo.text);
                  }}
                  style={{ marginLeft: "10px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  style={{ marginLeft: "5px" }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
