import React from 'react'
import { useState, useEffect } from "react";
import { db } from "../firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const Todo = () => {
const [todolist, setTodolist] = useState([]);

const todolistCollectionRef = collection(db, "todos");

const deleteTodo = async (id) => {
  const todoDoc = doc(db, "todos", id);
  await deleteDoc(todoDoc);
  window.location.reload(false);
};

const [isChecked,setChecked] = useState();

useEffect(() => {
  const getTodolist = async () => {
  const data = await getDocs(todolistCollectionRef);
    setTodolist(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  getTodolist();
}, []);



const handleChange = async (id, status) => {
  const todolistDoc = doc(db, "todos", id);
  let newFields = { status: !status };
  setChecked(!status);
  await updateDoc(todolistDoc, newFields);
  window.location.reload(false);
};

  return (
    <div className='w-full max-w-3xl my-8  mx-auto  px-5'>
        {todolist.map((todo)=>{
        return(
          <div className="flex justify-between">
            {" "}
            <div>
              {
                todo.status ? (
                              <p className='font-medium text-lg line-through'>{todo.todo}</p>
                ) : (
                                <p className='font-medium text-lg '>{todo.todo}</p>
                )
              }
            </div>
            <div className='flex space-x-5 '>
            <Checkbox checked={todo.status} onChange={() => {handleChange(todo.id,todo.status)}} inputProps={{ 'aria-label': 'controlled' }}/>
            <IconButton aria-label="delete" onClick={() => {deleteTodo(todo.id);}}> <DeleteIcon /></IconButton>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Todo
