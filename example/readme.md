<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.






-->
<p align="center">
  <a href="/../../#readme">
    <img src="https://github.com/brillout/wildcard-api/raw/master/docs/images/logo-with-text.svg?sanitize=true" height=80 alt="Wildcard API"/>
  </a>
</p>
<p align='center'><a href="/../../#readme">Intro</a> &nbsp; | &nbsp; <a href="/docs/custom-vs-generic.md#readme">Custom vs Generic</a> &nbsp; | &nbsp; <a href="/example/#readme"><b>Example</b></a></p>

A (simplistic) todo app built with:
 - React
 - Wildcard API
 - Node.js
 - SQLite

> You can also poke around by using
> [Reframe's react-sql starter](https://github.com/reframejs/reframe/tree/master/plugins/create/starters/react-sql#readme)
> which includes a Wildcard API.

#### Contents

- [Code Highlights](#code-highlights)
  - [View Endpoints](#view-endpoints)
  - [Server Integration](#server-integration)
  - [Mutation Endpoints](#mutation-endpoints)
  - [React Frontend](#react-frontend)
- [Run](#run)



## Code Highlights

Source code showcase.

### View Endpoints

(We denote an endpoint that retrieves data a *view endpoint*.)

~~~js
// /example/api/view-endpoints

const {endpoints} = require('wildcard-api');
const db = require('../db');
const {getLoggedUser} = require('../auth');

// Our view endpoints are tailored to the frontend. For example, the endpoint
// `getLandingPageData` returns exactly and only the data needed by the landing page

endpoints.getLandingPageData = async function () {
  // `this` holds contextual information such as HTTP headers
  const user = await getLoggedUser(this.headers.cookie);
  if( ! user ) return {userIsNotLoggedIn: true};

  const todos = await db.query(
    `SELECT * FROM todos WHERE authorId = :authorId AND completed = false;`,
    {authorId: user.id}
  );

  // The landing page displays user information, so we return `user`
  return {user, todos};
};

endpoints.getCompletedPageData = async function () {
  const user = await getLoggedUser(this.headers.cookie);
  if( ! user ) return {userIsNotLoggedIn: true};

  const todos = await db.query(
    `SELECT * FROM todos WHERE authorId = :authorId AND completed = true;`,
    {authorId: user.id}
  );

  // We don't return `user` as the page doesn't need it
  return {todos};
};
~~~

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>

### Server Integration

With Express:

~~~js
// /example/start-with-express

const express = require('express');
const {getApiResponse} = require('wildcard-api');
require('./api/endpoints');

const app = express();

app.all('/wildcard/*' , (req, res, next) => {
  // Our `context` object is made available to endpoint functions over `this`.
  // E.g. `endpoints.getUser = function() { return getLoggedUser(this.headers) }`.
  const {method, url, headers} = req;
  const context = {method, url, headers};
  getApiResponse(context)
  .then(apiResponse => {
    res.status(apiResponse.statusCode);
    res.send(apiResponse.body);
    next();
  })
  .catch(next);
});

// Serve our frontend
app.use(express.static('client/dist', {extensions: ['html']}));

app.listen(3000);
~~~

<details>
<summary>
With Hapi
</summary>

~~~js
// /example/start-with-hapi

const Hapi = require('hapi');
const Inert = require('inert');
const {getApiResponse} = require('wildcard-api');
require('./api/endpoints');

startServer();

async function startServer() {
  const server = Hapi.Server({
    port: 3000,
    debug: {request: ['internal']},
  });

  server.route({
    method: '*',
    path: '/wildcard/{param*}',
    handler: async (request, h) => {
      const {method, url, headers} = request.raw.req;
      const context = {method, url, headers};

      const apiResponse = await getApiResponse(context);

      const resp = h.response(apiResponse.body);
      resp.code(apiResponse.statusCode);
      return resp;
    }
  });

  await server.register(Inert);
  server.route({
    method: '*',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'client/dist',
      }
    }
  });

  await server.start();
}
~~~
</details>

<details>
<summary>
With Koa
</summary>

~~~js
// /example/start-with-koa

const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const {getApiResponse} = require('wildcard-api');
require('./api/endpoints');

const app = new Koa();

const router = new Router();

router.all('/wildcard/*', async (ctx, next) => {
  const {method, url, headers} = ctx;
  const context = {method, url, headers};

  const apiResponse = await getApiResponse(context);

  ctx.status = apiResponse.statusCode;
  ctx.body = apiResponse.body;
});

app.use(router.routes());

app.use(Static('client/dist'));

app.listen(process.env.PORT || 3000);
~~~
</details>


<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>

### Mutation Endpoints

(We denote an endpoint that mutates data a *mutation endpoint*.)

~~~js
// /example/api/mutation-endpoints

const {endpoints} = require('wildcard-api');
const db = require('../db');
const {getLoggedUser} = require('../auth');

// We tailor mutation endpoints to the frontend as well

endpoints.toggleComplete = async function(todoId) {
  const user = await getLoggedUser(this.headers.cookie);
  // Do nothing if user is not logged in
  if( !user ) return;

  const todo = await getTodo(todoId);
  // Do nothing if todo not found.
  // (This can happen since `toggleComplete` is essentially public and anyone
  // on the internet can "call" it with an arbitrary `todoId`.)
  if( !todo ) return;

  // Do nothing if the user is not the author of the todo
  if( todo.authorId !== user.id ) return;

  const completed = !todo.completed;
  await db.query(
    "UPDATE todos SET completed = :completed WHERE id = :todoId;",
    {completed, todoId}
  );

  return completed;
};

async function getTodo(todoId) {
  const [todo] = await db.query(
    `SELECT * FROM todos WHERE id = :todoId;`,
    {todoId}
  );
  return todo;
}
~~~

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>

### React Frontend

The following code shows how our frontend
uses our Wildcard API to retrieve the user information,
the user todos,
and to update a todo.

~~~js
// /example/client/LandingPage

import React from 'react';
import {endpoints} from 'wildcard-api/client';
import renderPage from './renderPage';
import LoadingWrapper from './LoadingWrapper';
import Todo from './Todo';

renderPage(<LandingPage/>);

function LandingPage() {
  // We use our Wildcard endpoint to get user information and the user's todos
  const fetchData = async () => await endpoints.getLandingPageData();

  return (
    <LoadingWrapper fetchData={fetchData}>{
      ({data: {todos, user: {username}}, updateTodo}) => (
        <div>
          Hi, {username}.
          <br/><br/>
          Your todos are:
          <div>
            {todos.map(todo =>
              <Todo todo={todo} updateTodo={updateTodo} key={todo.id}/>
            )}
          </div>
          <br/>
          Your completed todos: <a href="/completed">/completed</a>.
        </div>
      )
    }</LoadingWrapper>
  );
}
~~~

~~~js
// /example/client/Todo

import React from 'react';
import {endpoints} from 'wildcard-api/client';
import {TodoCheckbox, TodoText} from './TodoComponents';

export default Todo;

function Todo({todo, updateTodo}) {
    return (
      <div>
        <TodoCheckbox todo={todo} onChange={onCompleteToggle}/>
        <TodoText todo={todo}/>
      </div>
    );

    async function onCompleteToggle() {
      const completed = await endpoints.toggleComplete(todo.id);
      updateTodo(todo, {completed});
    }
}
~~~

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>

## Run

To run the example:

0. Get the code.

   ~~~shell
   $ git clone git@github.com:brillout/wildcard-api
   $ cd example/
   ~~~

1. Install dependencies.

   ~~~shell
   $ npm run setup
   ~~~

2. Build the frontend.

   ~~~shell
   $ npm run build
   ~~~

3. Run the server.

   ~~~shell
   $ npm run server
   ~~~

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>



<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/example.template.md` instead.






-->
