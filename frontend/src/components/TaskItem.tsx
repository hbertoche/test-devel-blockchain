import React, { useState } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleComplete = () => {
    if (task.id) {
      onToggleComplete(task.id, !task.completed);
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    if (task.id) {
      onDelete(task.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Card className={`task-item ${task.completed ? 'completed' : ''}`}>
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-start flex-grow-1">
            <Form.Check
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleComplete}
              className="me-3 mt-1"
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 
                  className={`mb-0 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {task.title}
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={task.completed ? 'success' : 'warning'}>
                    {task.completed ? 'Concluída' : 'Pendente'}
                  </Badge>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleEdit}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleDelete}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </div>
              
              {task.description && (
                <p 
                  className={`mb-2 ${task.completed ? 'text-muted' : ''} ${
                    isExpanded ? '' : 'text-truncate'
                  }`}
                  style={{ 
                    cursor: 'pointer',
                    maxHeight: isExpanded ? 'none' : '1.5em',
                    overflow: 'hidden'
                  }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {task.description}
                </p>
              )}
              
              <div className="d-flex justify-content-between align-items-center text-muted small">
                <span>
                  Criada: {task.createdAt ? formatDate(task.createdAt) : 'N/A'}
                </span>
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <span>
                    Atualizada: {formatDate(task.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskItem;