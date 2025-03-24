
import { ThemeProvider } from './context/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import RoleSwitcher from './components/RoleSwitcher';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <AppRoutes />
        <Toaster />
        <RoleSwitcher />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
