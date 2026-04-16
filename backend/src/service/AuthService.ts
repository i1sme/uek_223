import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BaseService, ValidationError } from "./BaseService";

const SALT_ROUNDS = 10;

export interface RegisterDto {
  username: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export class AuthService extends BaseService {
  private userRepo = AppDataSource.getRepository(User);

  /** Registers a new user and returns a JWT */
  public async register(dto: RegisterDto): Promise<AuthResponse> {
    this.validateCredentials(dto.username, dto.password);

    const existing = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ValidationError("Username is already taken");
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = this.userRepo.create({
      username: dto.username,
      passwordHash,
      role: "user",
    });
    await this.userRepo.save(user);

    return this.buildAuthResponse(user);
  }

  /** Validates credentials and returns a JWT on success */
  public async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new ValidationError("Invalid username or password");
    }

    if (user.isLocked) {
      throw new ValidationError(
        "This account has been locked by an administrator"
      );
    }

    return this.buildAuthResponse(user);
  }

  /** Builds the JWT and response object for a given user */
  private buildAuthResponse(user: User): AuthResponse {
    const secret = process.env.JWT_SECRET ?? "fallback_secret";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "7d",
    });

    return {
      token,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  /** Validates that username and password meet minimum requirements */
  private validateCredentials(username: string, password: string): void {
    if (!username || username.trim().length < 3) {
      throw new ValidationError("Username must be at least 3 characters");
    }
    if (!password || password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters");
    }
    if (username.length > 50) {
      throw new ValidationError("Username must not exceed 50 characters");
    }
  }
}
