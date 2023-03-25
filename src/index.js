const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = {
     username:username
  }

  const verifyIfExistsUsername = users.find(
    (user) => user.username === username
  )

  if(!verifyIfExistsUsername){
    return response.status(404).json({error:"Username don't find it ❌"})
  }

  request.username = user

  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  const verifyIfExistsUsername = users.find(
    (user) => user.username === username
  )
  
  if(verifyIfExistsUsername){
    return response.status(400).json({error:"Username already exists ❌"})
  }

  users.push(user)

  return response.json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request
  return response.json(username.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadeline } = request.body
  const { username } = request

  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadeline: new Date(deadeline),
    created_at: new Date()
  }

  username.todos.push(todo)

  return response.json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request
  const { title, deadeline } = request.body
  const { id } = request.params

  const findForId = username.todos.find(
    (todo) => todo.id === id
  )
  
  if(!findForId){
    return response.status(404).json({error: "ID didn't find it"})
  }

  todos.title = title
  todos.deadeline = deadeline

  return response.json(findForId)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request
  const { id } = request.params

  const findForId = username.todo.find((user) => 
    username.id === id
  )

  if(!findForId){
    return response.status(404).json({error: "ID didn't find it"})
  }

  todos.done = true

  return response.json(findForId)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request
  const { id } = request.params

  const findUsername = username.findIndex((user) => user.id === id)

  if(findUsername === -1){ //-1 retorna que não foi encontrado
    return response.status(404).json({error: "Id not found"})
  }

  users.todos.splice(findUsername,1)

  return response.status(204).json()
});

module.exports = app;