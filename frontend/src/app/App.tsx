import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';

import Router from '@Router/Router';
import { InternalServerErrorView } from '@Views/errors';

import queryClient from '../data/client';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<InternalServerErrorView />}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </SnackbarProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
