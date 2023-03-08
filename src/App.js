import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Todo from "./components/Todo"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todolist, setTodolist] = useState([]);
  const todolistCollectionRef = collection(db, "todos");

  const createTodo = async () => {
    if (newTodo!=""){
      await addDoc(todolistCollectionRef, { todo: newTodo, status: Boolean(false) });
    }
    window.location.reload(false);
  };

  const clearAll = () => {
    todolist.map((todo)=>{
      const deleteAll = async () => {
        const todoDoc = doc(db, "todos", todo.id);
        await deleteDoc(todoDoc);
      }
      deleteAll();
      window.location.reload(false);
    })
  }

  useEffect(() => {
    const getTodolist = async () => {
      const data = await getDocs(todolistCollectionRef);
      setTodolist(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getTodolist();
  }, []);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    fontWeight:200,
    '&:hover': {
      backgroundColor: red[700],
    },
  }));
  

  return (
    <div className="App mt-8 font-main ">
      <div className="grid grid-cols-1 gap-5">
        <div><h1 className="text-3xl font-semibold">My Todo List</h1></div>

        <div className="flex space-x-10 justify-center items-center place-items-center">

          <div className="">
          <TextField id="standard-basic" label="Todo...." variant="standard"onChange={(event) => {setNewTodo(event.target.value);}}/>
        </div>

        <div >
          <Button variant="contained" component="label" onClick={createTodo}> Add Todo  </Button>
          </div>

        </div>
        <div>
        <div className="mb-4">
          <ColorButton variant="outlined" color="error" onClick={() => {clearAll(); }}> Delete All</ColorButton>
          </div>
          <Todo />
        </div>
      </div>
    </div>
  );
}

export default App;
