import React, { useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import ContactBook from './ContactBook/ContactBook.jsx'
import graphQlClient from './graphql/client.js'

const App = () => (
  <ApolloProvider client={graphQlClient}>
    <ContactBook />
  </ApolloProvider>
)

export default App
