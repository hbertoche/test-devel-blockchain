import React, { useState } from 'react';
import { Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Erro no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4">
          <h3>Cadastrar</h3>
        </Card.Title>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

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
              placeholder="Digite sua senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirmar Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Cadastrando...
              </>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </Form>

        <div className="text-center">
          <span className="text-muted">Já tem uma conta? </span>
          <Button 
            variant="link" 
            className="p-0"
            onClick={onSwitchToLogin}
          >
            Entre aqui
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};