import { Request, Response } from "express";
import userService from '../services/user.service';

export default {
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const userList = await userService.getAllUsers();

      res.send(userList);
    } catch (error) {
      throw new Error(error);
    }
  },

  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.getUserById(2);

      res.send(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}
