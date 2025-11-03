import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './interfaces/task.interface';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private databaseService: DatabaseService) {}

  async create(createTaskDto: CreateTaskDto, userId?: number): Promise<Task> {
    const { title, description = '' } = createTaskDto;
    
    return new Promise((resolve, reject) => {
      const db = this.databaseService.getDatabase();
      const query = `INSERT INTO tasks (title, description, userId) VALUES (?, ?, ?)`;
      
      db.run(query, [title, description, userId || null], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const taskId = this.lastID;
        const selectQuery = `SELECT * FROM tasks WHERE id = ?`;
        
        db.get(selectQuery, [taskId], (selectErr: any, row: any) => {
          if (selectErr || !row) {
            reject(selectErr || new NotFoundException('Tarefa não encontrada'));
            return;
          }
          
          resolve({
            id: row.id,
            title: row.title,
            description: row.description || '',
            completed: Boolean(row.completed),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            userId: row.userId
          });
        });
      });
    });
  }

  async findAll(userId?: number, filter?: string, search?: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM tasks WHERE 1=1`;
      const params: any[] = [];

      if (userId) {
        query += ` AND userId = ?`;
        params.push(userId);
      }

      if (filter === 'completed') {
        query += ` AND completed = 1`;
      } else if (filter === 'pending') {
        query += ` AND completed = 0`;
      }

      if (search) {
        query += ` AND (title LIKE ? OR description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY createdAt DESC`;

      const db = this.databaseService.getDatabase();
      db.all(query, params, (err: any, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }

        const tasks = rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description || '',
          completed: Boolean(row.completed),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          userId: row.userId
        }));

        resolve(tasks);
      });
    });
  }

  async findOne(id: number, userId?: number): Promise<Task> {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM tasks WHERE id = ?`;
      const params: any[] = [id];

      if (userId) {
        query += ` AND (userId IS NULL OR userId = ?)`;
        params.push(userId);
      }

      const db = this.databaseService.getDatabase();
      db.get(query, params, (err: any, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          reject(new NotFoundException(`Tarefa com ID ${id} não encontrada`));
          return;
        }

        resolve({
          id: row.id,
          title: row.title,
          description: row.description || '',
          completed: Boolean(row.completed),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          userId: row.userId
        });
      });
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId?: number): Promise<Task> {
    const updates: string[] = [];
    const params: any[] = [];

    if (updateTaskDto.title !== undefined) {
      updates.push('title = ?');
      params.push(updateTaskDto.title);
    }

    if (updateTaskDto.description !== undefined) {
      updates.push('description = ?');
      params.push(updateTaskDto.description);
    }

    if (updateTaskDto.completed !== undefined) {
      updates.push('completed = ?');
      params.push(updateTaskDto.completed ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findOne(id, userId);
    }

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    return new Promise((resolve, reject) => {
      let query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
      
      if (userId) {
        query += ` AND (userId IS NULL OR userId = ?)`;
        params.push(userId);
      }

      const db = this.databaseService.getDatabase();
      db.run(query, params, (err: any) => {
        if (err) {
          reject(err);
          return;
        }

        this.findOne(id, userId)
          .then(resolve)
          .catch(reject);
      });
    });
  }

  async remove(id: number, userId?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let query = `DELETE FROM tasks WHERE id = ?`;
      const params: any[] = [id];

      if (userId) {
        query += ` AND (userId IS NULL OR userId = ?)`;
        params.push(userId);
      }

      const db = this.databaseService.getDatabase();
      db.run(query, params, function(err: any) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(new NotFoundException(`Tarefa com ID ${id} não encontrada`));
          return;
        }

        resolve();
      });
    });
  }

  async exportTasks(userId?: number): Promise<Task[]> {
    return this.findAll(userId);
  }

  async importTasks(tasks: any[], userId?: number): Promise<{ imported: number; errors: number; total: number }> {
    const total = tasks.length;
    let imported = 0;
    let errors = 0;

    for (const taskData of tasks) {
      try {
        // Validate required fields
        if (!taskData.title || typeof taskData.title !== 'string') {
          errors++;
          continue;
        }

        const createTaskDto: CreateTaskDto = {
          title: taskData.title,
          description: taskData.description || ''
        };

        await this.create(createTaskDto, userId);
        imported++;
      } catch (error) {
        this.logger.error(`Error importing task: ${error.message}`);
        errors++;
      }
    }

    return { imported, errors, total };
  }
}