import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Layout from '../Layout/Layout.jsx'
import { useQuery } from '@apollo/client'
import ContactList from '../ContactList/ContactList.jsx'
import ContactDetails from '../ContactDetails/ContactDetails.jsx'
import NewContact from '../NewContact/NewContact.jsx'
import * as queries from '../graphql/queries.gql'
import axios from 'axios'
import csrfToken from '../helpers/csrfToken.js'
import './ContactBook.scss'

const ContactBook = () => {
  const props = useQuery(queries.contactBook)

  return (
    <ContactBookUI {...props} />
  )
}

const ContactBookUI = ({ loading, error, data, refetch }) => {
  const { contacts } = data || {}
  const [selectedContact, setSelectedContact] = useState(null)
  const selectContact = (contact) => setSelectedContact(contact)
  const deselectContact = () => setSelectedContact(null)

  return (
    <Layout>
      <div className='ContactBook'>
        { loading && <span className='loading'>Loading...</span> }
        { error && <span className='error'>{ error.message || 'An unexpected error occurred' }</span> }
        { contacts && <ContactList contacts={contacts} selectContact={selectContact} /> }
        { selectedContact && <ContactDetails contact={selectedContact} deselectContact={deselectContact} /> }
        <NewContact createContact={checkDuplicatesAndCreate} onSuccess={refetch} />
      </div>
    </Layout>
  )
}

ContactBookUI.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  data: PropTypes.shape({
    data: PropTypes.array
  })
}

const createContact = ({ name, address, postalCode, city }) =>
  axios.post('/contacts', {
    contact: {
      name,
      address,
      postal_code: postalCode,
      city
    },
    authenticity_token: csrfToken()
  }, {
    headers: { Accept: 'application/json' },
    responseType: 'json'
  })

const findNearDuplicates = ({ name, address, postalCode, city }) =>
  axios.get('/contacts/near_duplicates', {
    params: {
      'contact[name]': name,
      'contact[address]': address,
      'contact[postal_code]': postalCode,
      'contact[city]': city
    },
    headers: { Accept: 'application/json' },
    responseType: 'json'
  })

const checkDuplicatesAndCreate = (newContact) =>
  findNearDuplicates(newContact).then(({ data: duplicates }) => {
    if (duplicates.length === 0 || confirmDuplicates(duplicates)) {
      return createContact(newContact)
    }

    return false
  })

const confirmDuplicates = (duplicates) => {
  const duplicatesPreview = duplicates.map(({ name, address, postal_code: postalCode, city }) =>
    `${name}, ${address}, ${postalCode}, ${city}`
  ).join('\n')

  return window.confirm(`The contact you are creating might be a duplicate of:
    \n${duplicatesPreview}
    \nDo you still want to create it?`)
}

export default ContactBook
export { ContactBookUI, createContact, findNearDuplicates }
