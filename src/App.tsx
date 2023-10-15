import { QueryClientProvider } from "react-query";
import AppRouter from "./AppRouter";
import { AuthProvider } from "./state/AuthContext";
import queryClient from "./state/queryClient";
import ErrorBoundary from "./components/Common/ErrorBoundary";

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
