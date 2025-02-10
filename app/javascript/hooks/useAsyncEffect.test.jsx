/* eslint-env jest */

import useAsyncEffect from './useAsyncEffect'
import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('useAsyncEffect', () => {
  const MyComponent = ({ effectFn }) => {
    const [performEffect, { loading, error, data }] = useAsyncEffect(effectFn)

    return (
      <div>
        <span>Loading: {loading ? 'yes' : 'no'}</span>
        <span>Error: {error || 'none'}</span>
        <span>Data: {data || 'none'}</span>

        <button onClick={performEffect}>Perform</button>
      </div>
    )
  }

  it('performs the effect when the function is called, and maintains the loading, error, and data states', async () => {
    let resolvePromise
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve
    })

    const effectFn = () => promise

    render(<MyComponent effectFn={effectFn} />)

    const button = screen.getByText('Perform')
    const loading = screen.getByText(/Loading: /)
    const error = screen.getByText(/Error: /)
    const data = screen.getByText(/Data: /)

    expect(loading).toHaveTextContent('Loading: no')
    expect(error).toHaveTextContent('Error: none')
    expect(data).toHaveTextContent('Data: none')

    await userEvent.click(button)

    expect(loading).toHaveTextContent('Loading: yes')
    expect(error).toHaveTextContent('Error: none')
    expect(data).toHaveTextContent('Data: none')

    await act(async () => {
      resolvePromise('Yay!')
      return promise
    })

    expect(loading).toHaveTextContent('Loading: no')
    expect(error).toHaveTextContent('Error: none')
    expect(data).toHaveTextContent('Data: Yay!')
  })

  it('maintains the error state if the promise rejects', async () => {
    let rejectPromise
    const promise = new Promise((resolve, reject) => {
      rejectPromise = reject
    })

    const effectFn = () => promise

    render(<MyComponent effectFn={effectFn} />)

    const button = screen.getByText('Perform')
    const loading = screen.getByText(/Loading: /)
    const error = screen.getByText(/Error: /)
    const data = screen.getByText(/Data: /)

    expect(loading).toHaveTextContent('Loading: no')
    expect(error).toHaveTextContent('Error: none')
    expect(data).toHaveTextContent('Data: none')

    await userEvent.click(button)

    expect(loading).toHaveTextContent('Loading: yes')
    expect(error).toHaveTextContent('Error: none')
    expect(data).toHaveTextContent('Data: none')

    await act(async () => {
      rejectPromise('Boom!')
      return promise.catch((e) => {})
    })

    expect(loading).toHaveTextContent('Loading: no')
    expect(error).toHaveTextContent('Error: Boom!')
    expect(data).toHaveTextContent('Data: none')
  })
})
