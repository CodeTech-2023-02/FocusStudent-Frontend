
import { QueryClientProvider } from 'react-query';
import AppRouter from './AppRouter';
import { AuthProvider } from './state/AuthContext';
import queryClient from './state/queryClient';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
    </QueryClientProvider>
  );
};


export default App
