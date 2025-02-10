/* eslint-env jest */

import { ContactBookUI } from './ContactBook'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

jest.mock('axios')

describe('ContactBookUI', () => {
  const contacts = [
    { id: '1', name: 'Alfa Beta', address: 'Gamma Str. 123', postalCode: '12345', city: 'Portland' },
    { id: '2', name: 'Beep Boop', address: 'Robot Str. 101', postalCode: '10110', city: 'Bintown' }
  ]
  const data = { contacts }
  const refetch = () => {}

  it('lists all contacts', async () => {
    render(<ContactBookUI data={data} loading={false} error={null} refetch={refetch} />)

    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Alfa Beta')
    expect(items[1]).toHaveTextContent('Beep Boop')
  })

  it('adds a contact and re-fetches data', async () => {
    const axiosGetMock = axios.get
    const axiosPostMock = axios.post

    axiosGetMock.mockResolvedValue({ data: [] })
    axiosPostMock.mockResolvedValue({ data: {} })

    const refetch = jest.fn()
    render(<ContactBookUI data={data} loading={false} error={null} refetch={refetch} />)

    const addButton = screen.getByRole('button', { name: '+' })
    const items = screen.getAllByRole('listitem')

    expect(items).toHaveLength(2)

    await userEvent.click(addButton)

    const nameInput = screen.getByRole('textbox', { name: 'Name' })
    const addressInput = screen.getByRole('textbox', { name: 'Address' })
    const postalCodeInput = screen.getByRole('textbox', { name: 'Postal Code' })
    const cityInput = screen.getByRole('textbox', { name: 'City' })
    const createButton = screen.getByRole('button', { name: 'Create' })

    fireEvent.change(nameInput, { target: { value: 'Tom Bombadil' } })
    fireEvent.change(addressInput, { target: { value: 'Hill' } })
    fireEvent.change(postalCodeInput, { target: { value: '00000' } })
    fireEvent.change(cityInput, { target: { value: 'Withywindle' } })

    expect(refetch).not.toHaveBeenCalled()
    await userEvent.click(createButton)
    expect(refetch).toHaveBeenCalled()

    expect(axiosGetMock).toHaveBeenCalledWith(
      '/contacts/near_duplicates',
      {
        headers: {
          Accept: 'application/json'
        },
        params: {
          'contact[address]': 'Hill',
          'contact[city]': 'Withywindle',
          'contact[name]': 'Tom Bombadil',
          'contact[postal_code]': '00000'
        },
        responseType: 'json'
      }
    )
    expect(axiosPostMock).toHaveBeenCalledWith(
      '/contacts',
      {
        authenticity_token: undefined,
        contact: {
          address: 'Hill',
          city: 'Withywindle',
          name: 'Tom Bombadil',
          postal_code: '00000'
        }
      },
      {
        headers: {
          Accept: 'application/json'
        },
        responseType: 'json'
      }
    )
  })
})
