const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const foundUser = users.find((user) => user.username === username);

  if (!foundUser) {
    return response.json({ error: "usuário não encontrado" });
  }

  request.user = foundUser;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const newUser = {
    id: uuid(),
    name,
    username,
    todos: [],
  };

  if (users.some((user) => user.username === newUser.username)) {
    return response.status(400).json({
      error: `Esse Username já está sendo utilizado. Escolha outro por favor`,
    });
  }

  users.push(newUser);

  return response.json(newUser);
});

app.get("/all-users", (request, response) => {
  return response.json(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  // return response.json({ user: user.username, todos: user.todos });
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  console.log(deadline);

  // if (new Date(deadline).getTime() <= new Date().getTime()) {
  //   return response.json({
  //     error:
  //       "a data da deadline precisa ser maior que a data de criação do TODO",
  //   });
  // }

  const newTodo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  // delete newTodo.id;
  // return response.json({
  //   message: "TODO criado com sucesso!",
  //   user: user.username,
  //   ...newTodo,
  // });

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  // if (new Date(deadline).getTime() <= new Date().getTime()) {
  //   return response.json({
  //     error:
  //       "a data da deadline precisa ser maior que a data de criação do TODO",
  //   });
  // }

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo não encontrado" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  // return response.json({ message: "TODO atualizado com sucesso!", todo });

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo não encontrado" });
  }

  // todo.done = !todo.done;
  todo.done = true;

  delete todo.error;

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  // console.log(id);

  // const index = user.todos.findIndex((todo) => todo.id === id);

  // if (index < 0) {
  //   return response.status(404).json({ error: "TODO não encontrado" });
  // }

  // const deletedTodo = user.todos[index];
  const todo = user.todos.find((todo) => todo.id === id);
  if (!todo) {
    return response.status(404).json({ error: "TODO não encontrado" });
  }
  user.todos.splice(todo, 1);

  return response.status(204).send();

  // return response.status(204).json({ error: "TODO deletado" });
  // return response.status(204).json({
  // message: `TODO ${deletedTodo.id} excluído com sucesso!`,
  // });
});

module.exports = app;
