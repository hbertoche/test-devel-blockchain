import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { User } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access context
const TestComponent = () => {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.username : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Yes' : 'No'}</div>
      <button 
        onClick={() => login({ id: 1, username: 'testuser', email: 'test@example.com' }, 'test-token')}
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should provide initial state when no stored data', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
  });

  it('should restore user from localStorage', () => {
    const mockUser: User = { id: 1, username: 'testuser', email: 'test@example.com' };
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'stored-token';
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Yes');
  });

  it('should handle login correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      expect(screen.getByTestId('token')).toHaveTextContent('test-token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Yes');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('user', expect.any(String));
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  it('should handle logout correctly', async () => {
    const mockUser: User = { id: 1, username: 'testuser', email: 'test@example.com' };
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'stored-token';
      return null;
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('logout-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('token')).toHaveTextContent('No token');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('No');
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  it('should throw error when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});