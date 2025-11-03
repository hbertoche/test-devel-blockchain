import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-primary">📝 Todo List</h1>
            <p className="text-muted">Organize suas tarefas de forma simples e eficiente</p>
          </div>

          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </Col>
      </Row>
    </Container>
  );
};