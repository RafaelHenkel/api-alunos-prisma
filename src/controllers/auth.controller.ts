import { Request, Response } from "express";
import db from "../database/prisma.connection";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

class AuthController {
  public async create(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }

      const studentFind = await db.students.findUnique({
        where: {
          email,
        },
        include: {
          users: true,
        },
      });

      if (
        !studentFind ||
        !bcrypt.compareSync(password, studentFind.users?.password || "")
      ) {
        return res
          .status(401)
          .json({ success: false, msg: "Email or password incorrect." });
      }

      const token = uuid();

      await db.users.update({
        where: {
          studentId: studentFind.id,
        },
        data: {
          token,
        },
      });
      return res
        .status(200)
        .json({ success: true, msg: "Login success", data: { token } });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default AuthController;
