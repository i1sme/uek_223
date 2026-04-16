import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { handleError } from "./errorHandler";

const authService = new AuthService();

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      handleError(err, res);
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      handleError(err, res);
    }
  }
}
