import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private db: sqlite3.Database;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.initializeDatabase();
  }

  async onModuleDestroy(): Promise<void> {
    await this.closeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbPath = this.configService.get<string>('DATABASE_PATH') || 
                    path.join(process.cwd(), 'todo.db');
      
      this.logger.log(`Conectando ao SQLite: ${dbPath}`);
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          this.logger.error('Erro ao conectar SQLite:', err);
          reject(err);
          return;
        }
        
        this.logger.log('✅ Conectado ao SQLite');
        this.createTables()
          .then(() => {
            this.logger.log('✅ Tabelas criadas com sucesso');
            resolve();
          })
          .catch(reject);
      });
    });
  }

  private async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const createTasksTable = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          completed INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          userId INTEGER DEFAULT NULL,
          FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL
        )
      `;

      this.db.serialize(() => {
        this.db.run(createUsersTable, (err) => {
          if (err) {
            this.logger.error('Erro ao criar tabela users:', err);
            reject(err);
            return;
          }
        });

        this.db.run(createTasksTable, (err) => {
          if (err) {
            this.logger.error('Erro ao criar tabela tasks:', err);
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  getDatabase(): sqlite3.Database {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  private async closeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            this.logger.error('Erro ao fechar database:', err);
            reject(err);
          } else {
            this.logger.log('Database fechado');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}