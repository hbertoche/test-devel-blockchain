import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { DatabaseService } from '../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let databaseService: jest.Mocked<DatabaseService>;

  const mockDatabase = {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      getDatabase: jest.fn().mockReturnValue(mockDatabase),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    databaseService = module.get(DatabaseService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const mockTaskData = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        userId: 1,
      };

      // Mock the database run method
      mockDatabase.run.mockImplementation((query, params, callback) => {
        // Simulate successful insert
        const context = { lastID: 1 };
        callback.call(context, null);
      });

      // Mock the database get method for selecting the created task
      mockDatabase.get.mockImplementation((query, params, callback) => {
        callback(null, mockTaskData);
      });

      const result = await service.create(createTaskDto, 1);

      expect(result).toEqual({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        userId: 1,
      });
      expect(mockDatabase.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tasks'),
        ['Test Task', 'Test Description', 1],
        expect.any(Function),
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: 0,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          userId: 1,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: 1,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          userId: 1,
        },
      ];

      mockDatabase.all.mockImplementation((query, params, callback) => {
        callback(null, mockTasks);
      });

      const result = await service.findAll(1);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        userId: 1,
      });
      expect(result[1].completed).toBe(true);
      expect(mockDatabase.all).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM tasks WHERE 1=1'),
        [1],
        expect.any(Function),
      );
    });

    it('should filter tasks by status', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Pending Task',
          description: 'Description',
          completed: 0,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          userId: 1,
        },
      ];

      mockDatabase.all.mockImplementation((query, params, callback) => {
        callback(null, mockTasks);
      });

      const result = await service.findAll(1, 'pending');

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
      expect(mockDatabase.all).toHaveBeenCalledWith(
        expect.stringContaining('AND completed = 0'),
        [1],
        expect.any(Function),
      );
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        completed: true,
      };

      const mockUpdatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Original Description',
        completed: 1,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T01:00:00Z',
        userId: 1,
      };

      // Mock the update query
      mockDatabase.run.mockImplementation((query, params, callback) => {
        callback(null);
      });

      // Mock finding the updated task
      mockDatabase.get.mockImplementation((query, params, callback) => {
        callback(null, mockUpdatedTask);
      });

      const result = await service.update(1, updateTaskDto, 1);

      expect(result).toEqual({
        id: 1,
        title: 'Updated Task',
        description: 'Original Description',
        completed: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T01:00:00Z',
        userId: 1,
      });
      expect(mockDatabase.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE tasks SET'),
        expect.arrayContaining(['Updated Task', 1, 1]),
        expect.any(Function),
      );
    });
  });
});