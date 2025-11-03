import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Dropdown } from 'react-bootstrap';
import { taskApi } from '../services/api';
import { Task, TaskFilter } from '../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { useTheme } from '../contexts/ThemeContext';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>({ status: 'all', search: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {
        status: filter.status !== 'all' ? filter.status : undefined,
        search: filter.search || undefined,
      };
      const data = await taskApi.getTasks(params);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar tarefas');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description: string }) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Erro ao criar tarefa');
    }
  };

  const handleUpdateTask = async (id: number, updates: { title?: string; description?: string; completed?: boolean }) => {
    try {
      const updatedTask = await taskApi.updateTask(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Erro ao excluir tarefa');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      await handleUpdateTask(id, { completed });
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

  const handleExportTasks = async () => {
    try {
      const blob = await taskApi.exportTasks();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting tasks:', err);
      setError('Erro ao exportar tarefas');
    }
  };

  const handleImportTasks = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedTasks = JSON.parse(text);
      
      if (!Array.isArray(importedTasks)) {
        setError('Arquivo inválido: deve conter um array de tarefas');
        return;
      }

      const result = await taskApi.importTasks(importedTasks);
      alert(`Importação concluída! ${result.imported} tarefas importadas, ${result.errors} erros.`);
      loadTasks();
    } catch (err) {
      console.error('Error importing tasks:', err);
      setError('Erro ao importar tarefas');
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleFilterChange = (newFilter: Partial<TaskFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const getTaskCounts = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const counts = getTaskCounts();

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="display-6">📋 Sistema de Tarefas</h1>
            <div className="d-flex gap-2">
              <Button 
                variant={theme === 'light' ? 'outline-dark' : 'outline-light'} 
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-danger alert-dismissible" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
              ></button>
            </div>
          </Col>
        </Row>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Total</h5>
              <Badge bg="primary" className="fs-6">{counts.total}</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Pendentes</h5>
              <Badge bg="warning" className="fs-6">{counts.pending}</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Concluídas</h5>
              <Badge bg="success" className="fs-6">{counts.completed}</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Row className="mb-4">
        <Col lg={8}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="🔍 Buscar tarefas..."
              value={filter.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary">
                {filter.status === 'all' ? 'Todas' : 
                 filter.status === 'pending' ? 'Pendentes' : 'Concluídas'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleFilterChange({ status: 'all' })}>
                  Todas
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterChange({ status: 'pending' })}>
                  Pendentes
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterChange({ status: 'completed' })}>
                  Concluídas
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </InputGroup>
        </Col>
        <Col lg={4} className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="flex-grow-1"
          >
            ➕ Nova Tarefa
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              ⚙️
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleExportTasks}>
                📤 Exportar
              </Dropdown.Item>
              <Dropdown.Item as="label" htmlFor="import-file">
                📥 Importar
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  onChange={handleImportTasks}
                />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Task Form Modal */}
      {(showForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? 
            (data) => handleUpdateTask(editingTask.id!, data) : 
            handleCreateTask
          }
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Tasks List */}
      <Row>
        <Col>
          {tasks.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <div className="text-muted">
                  <h5>Nenhuma tarefa encontrada</h5>
                  <p>
                    {filter.status !== 'all' || filter.search ? 
                      'Tente ajustar os filtros' : 
                      'Comece criando sua primeira tarefa!'
                    }
                  </p>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <div className="d-flex flex-column gap-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TaskList;