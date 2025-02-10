import { useState } from 'react'

/**
 * useAsyncEffect is a hook to facilitate performing an
 * asynchronous side-effect returning a promise (like an HTTP request), and
 * updating the UI showing a loading state, an error state and a success state.
 *
 * It works similarily to React Apollo `useMutation` component.
 *
 * The hook returns a `[performEffect, { data, error, loading }]` array:
 *
 *   - performEffect: a function that performs the side effect when called
 *   - loading: a boolean indicating whether the effect is being performed
 *   - error: the rejection error if the promise is rejected, otherwise null
 *   - data: the resolved value if the promise resolves, otherwise null
 *
 * @example
 *
 * const MyComponent = () => {
 *   [performEffect, { loading, error, data }] =
 *     useAsyncEffect(functionReturningPromise)
 *
 *   // Now you can call performEffect to perform your side effect, and
 *   // loading, error, and data will reflect the atate and result of the
 *   // effect
 * }
 */
const useAsyncEffect = (effectFn) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const performEffect = (...args) => {
    const promise = effectFn(...args)
    setLoading(true)

    return promise.then(
      (data) => {
        setLoading(false)
        setError(null)
        setData(data)
      },
      (error) => {
        setLoading(false)
        setError(error)
        setData(null)
      }
    )
  }

  return [performEffect, { loading, error, data }]
}

export default useAsyncEffect
