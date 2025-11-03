import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiPencil, mdiPlus } from '@mdi/js';
import { Task } from '../types';

interface TaskFormProps {
  task?: Task | null;
  onSave: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || ''
      });
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Título deve ter no máximo 255 caracteres';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Descrição deve ter no máximo 1000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: 'title' | 'description', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Modal show={true} onHide={onCancel} size="lg" onKeyDown={handleKeyDown}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon 
            path={task ? mdiPencil : mdiPlus} 
            size={0.8} 
            className="me-2"
          />
          {task ? 'Editar Tarefa' : 'Nova Tarefa'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o título da tarefa..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              isInvalid={!!errors.title}
              maxLength={255}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formData.title.length}/255 caracteres
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Digite uma descrição opcional..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              isInvalid={!!errors.description}
              maxLength={1000}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formData.description.length}/1000 caracteres
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Salvando...
              </>
            ) : (
              task ? 'Salvar Alterações' : 'Criar Tarefa'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskForm;