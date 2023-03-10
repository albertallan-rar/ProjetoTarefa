import "./App.css";

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

        setLoading(false);

        setTodos(res);
        
    };

    loadData();

  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    // Mostrando o que vai ser enviado para a API
    // console.log(todo);

    fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo])

    setTitle("");
    setTime("");
  };

  const handleDelete = async(id) =>{
    fetch(API + "/todos/"+ id, {
      method: "DELETE"
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done;

    const data = fetch(API + "/todos"+ todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers:{
        "Content-Type": "application/json",
      }
    });

    setTodos((prevState) => 
      prevState.map((t)=> (t.id === data.id ? (t = data): t))
    );
  };


  if(loading){
    return <p>CARREGANDO APLICAÇÃO ...</p>
  }

  return (
    <div className="App">
      {/* COMENTARIO NO JSX*/}
      <div className="todo-header">
        <h1>React TODO</h1>
      </div>
      <div className="form-todo">
        <h1>Insira a sua proxima tarefa:</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer ?</label>
            <br />
            <input
              type="text"
              name="title"
              placeholder="Titulo da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="title">Qual a duração da tarefa ?</label>
            <br />
            <input
              type="text"
              name="time"
              placeholder="Tempo estimado(em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>
          <button className="button-submit" onClick={handleSubmit}>
            Criar Tarefa
          </button>
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas</h2>
        {todos.length === 0 && <p>Não existe tarefas cadastradas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions"> 
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={()=> handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default App;
