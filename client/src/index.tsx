import './index.css';

import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  link: new HttpLink({
    uri: `http://localhost:4000/graphql`
  }),
  cache: new InMemoryCache()
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
