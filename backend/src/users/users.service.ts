import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserResponse } from './interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { username, email, password } = createUserDto;

    // Verificar se usuário já existe
    const existingUser = await this.findByUsernameOrEmail(username, email);
    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Nome de usuário já está em uso');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return new Promise((resolve, reject) => {
      const db = this.databaseService.getDatabase();
      const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
      
      db.run(query, [username, email, hashedPassword], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const userId = this.lastID;
        const selectQuery = `SELECT id, username, email, createdAt FROM users WHERE id = ?`;
        
        db.get(selectQuery, [userId], (selectErr: any, row: any) => {
          if (selectErr || !row) {
            reject(selectErr || new NotFoundException('Usuário não encontrado após criação'));
            return;
          }
          
          resolve({
            id: row.id,
            username: row.username,
            email: row.email,
            createdAt: row.createdAt
          });
        });
      });
    });
  }

  async findByUsernameOrEmail(username?: string, email?: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const db = this.databaseService.getDatabase();
      let query = `SELECT * FROM users WHERE 1=0`;
      const params: any[] = [];

      if (username) {
        query += ` OR username = ?`;
        params.push(username);
      }

      if (email) {
        query += ` OR email = ?`;
        params.push(email);
      }

      db.get(query, params, (err: any, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve({
          id: row.id,
          username: row.username,
          email: row.email,
          password: row.password,
          createdAt: row.createdAt
        });
      });
    });
  }

  async findById(id: number): Promise<UserResponse | null> {
    return new Promise((resolve, reject) => {
      const db = this.databaseService.getDatabase();
      const query = `SELECT id, username, email, createdAt FROM users WHERE id = ?`;

      db.get(query, [id], (err: any, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        resolve({
          id: row.id,
          username: row.username,
          email: row.email,
          createdAt: row.createdAt
        });
      });
    });
  }

  async validateUser(username: string, password: string): Promise<UserResponse | null> {
    const user = await this.findByUsernameOrEmail(username);
    
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Retornar usuário sem a senha
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  async validateUserByEmail(email: string, password: string): Promise<UserResponse | null> {
    const user = await this.findByUsernameOrEmail(undefined, email);
    
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Retornar usuário sem a senha
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
  }
}