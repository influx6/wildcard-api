!MENU_ORDER 3
!MENU_LINK /example/
!OUTPUT ../example/readme.md
!INLINE ./header.md --hide-source-path
!MENU

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
!INLINE ../example/api/view-endpoints
~~~

!INLINE ./snippets/example-section-footer.md --hide-source-path

### Server Integration

With Express:

~~~js
!INLINE ../example/start-with-express
~~~

<details>
<summary>
With Hapi
</summary>

~~~js
!INLINE ../example/start-with-hapi
~~~
</details>

<details>
<summary>
With Koa
</summary>

~~~js
!INLINE ../example/start-with-koa
~~~
</details>


!INLINE ./snippets/example-section-footer.md --hide-source-path

### Mutation Endpoints

(We denote an endpoint that mutates data a *mutation endpoint*.)

~~~js
!INLINE ../example/api/mutation-endpoints
~~~

!INLINE ./snippets/example-section-footer.md --hide-source-path

### React Frontend

The following code shows how our frontend
uses our Wildcard API to retrieve the user information,
the user todos,
and to update a todo.

~~~js
!INLINE ../example/client/LandingPage
~~~

~~~js
!INLINE ../example/client/Todo
~~~

!INLINE ./snippets/example-section-footer.md --hide-source-path

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

!INLINE ./snippets/example-section-footer.md --hide-source-path


