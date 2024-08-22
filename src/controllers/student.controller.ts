import { Request, Response } from "express";
import db from "../database/prisma.connection";

class StudentController {
  public async list(req: Request, res: Response) {
    try {
      const students = await db.students.findMany();

      return res
        .status(200)
        .json({ success: true, msg: "List students.", data: students });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async create(req: Request, res: Response) {
    const { name, email } = req.body;

    try {
      const student = await db.students.create({
        data: { name, email },
      });

      if (student) {
        return res
          .status(200)
          .json({ success: true, msg: "Student created.", data: student });
      }

      return res
        .status(500)
        .json({ success: false, msg: "Student not created." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const student = await db.students.findUnique({
        where: {
          id,
        },
        include: {
          users: {
            select: {
              id: true,
              enable: true,
              password: true,
            },
          },
          registration: {
            include: {
              classroom: true,
            },
          },
        },
      });

      if (student) {
        return res
          .status(200)
          .json({ success: true, msg: "Student showed.", data: student });
      }

      return res
        .status(404)
        .json({ success: false, msg: "Student not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
      const student = await db.students.findUnique({
        where: {
          id,
        },
      });

      if (!student) {
        return res
          .status(404)
          .json({ success: false, msg: "Student not found." });
      }

      if (name) {
        await db.students.update({
          where: {
            id,
          },
          data: {
            name,
            email,
          },
        });

        return res.status(200).json({ success: true, msg: "Student updated." });
      }

      return res
        .status(400)
        .json({ success: true, msg: "Student not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const student = await db.students.findUnique({
        where: {
          id,
        },
      });

      if (student) {
        await db.students.delete({
          where: { id },
        });
        return res.status(200).json({ success: true, msg: "Student deleted." });
      }

      return res
        .status(404)
        .json({ success: false, msg: "Student not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default StudentController;
