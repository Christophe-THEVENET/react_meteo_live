import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppStore } from '../store/useAppStore'

// Reset le store Zustand avant chaque test (sans écraser les actions)
export function resetStore(initialState = {}) {
  const defaultState = {
    city: null,
    lang: 'fr',
    ...initialState,
  }
  useAppStore.setState(defaultState)
}

export function renderWithProviders(ui, { initialState = {}, ...renderOptions } = {}) {
  // Reset le store avec l'état initial
  resetStore(initialState)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return {
    store: useAppStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
