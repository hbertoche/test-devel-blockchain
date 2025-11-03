import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import TaskList from './components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;