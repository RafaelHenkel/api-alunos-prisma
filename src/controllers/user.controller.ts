import { Request, Response } from "express";
import db from "../database/prisma.connection";
import generateHash from "../utils/generateHash";

class UserController {
  public async list(req: Request, res: Response) {
    try {
      const users = await db.users.findMany({});

      return res
        .status(200)
        .json({ success: true, msg: "List users.", data: users });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async create(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }
      const findStudent = await db.students.findUnique({
        where: {
          email,
        },
      });
      if (!findStudent) {
        return res
          .status(400)
          .json({ success: false, msg: "Student not found." });
      }

      const hash = generateHash(password);

      const newUser = await db.users.create({
        data: {
          studentId: findStudent.id,
          password: hash,
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Users created.",
        data: {
          id: newUser.id,
          studentId: newUser.studentId,
          enable: newUser.enable,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { studentId, password, enable } = req.body;

    try {
      const user = await db.users.findUnique({
        where: {
          studentId,
        },
      });

      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found." });
      }

      if (studentId) {
        await db.users.update({
          where: {
            id,
          },
          data: {
            password,
            enable,
          },
        });

        return res.status(200).json({ success: true, msg: "User updated." });
      }

      return res.status(400).json({ success: true, msg: "User not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await db.users.findUnique({
        where: {
          id,
        },
      });

      if (user) {
        await db.users.delete({
          where: { id },
        });
        return res.status(200).json({ success: true, msg: "User deleted." });
      }

      return res.status(404).json({ success: false, msg: "User not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default UserController;
