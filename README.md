# Bork

Bork is a UI for making HTTP requests.

# Running it

``` bash
$ PORT=4000 npm start
```

Arbitrary HTTP requests can be sent from the backend, and there's no
authentication, so it's not recommended to deploy to a public location yet,
unless it's behind a reverse proxy with authentication.

It can be reached at [http://localhost:4000/](http://localhost:4000/)

# Development

In one terminal tab, run the create-react-app development server on port 3000

``` bash
$ npm start-dev
```

In another terminal tab, run the API server on port 4000:

``` bash
$ npm start
```

It can be reached at [http://localhost:3000/](http://localhost:3000/)
