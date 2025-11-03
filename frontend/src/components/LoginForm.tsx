import React, { useState } from 'react';
import { Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4">
          <h3>Entrar</h3>
        </Card.Title>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </Form>

        <div className="text-center">
          <span className="text-muted">Não tem uma conta? </span>
          <Button 
            variant="link" 
            className="p-0"
            onClick={onSwitchToRegister}
          >
            Cadastre-se
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};