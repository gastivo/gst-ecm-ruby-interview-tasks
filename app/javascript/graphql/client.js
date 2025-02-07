import csrfToken from 'helpers/csrfToken.js'

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'

const fetchWithCSRF = (fetch) => (uri, options) => {
  options.headers['X-CSRF-Token'] = csrfToken()
  return fetch(uri, options)
}

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
  fetch: fetchWithCSRF(window.fetch)
})

const client = new ApolloClient({
  uri: 'http://localhost:3000/',
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
})

export default client
