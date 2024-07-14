import Router from '@Router/Router';
import { InternalServerErrorView } from '@Views/errors';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<InternalServerErrorView />}>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
