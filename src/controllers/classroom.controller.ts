import { Request, Response } from "express";
import db from "../database/prisma.connection";

class classroomController {
  public async list(req: Request, res: Response) {
    const { vacancies } = req.query;
    let classrooms;

    try {
      switch (vacancies) {
        case "1":
          classrooms = await db.classrooms.findMany({
            where: {
              vacancies: {
                gt: 0,
              },
            },
          });
          break;
        case "0":
          classrooms = await db.classrooms.findMany({
            where: {
              vacancies: 0,
            },
          });
          break;

        default:
          classrooms = await db.classrooms.findMany();
          break;
      }
      return res
        .status(200)
        .json({ success: true, msg: "List classrooms.", data: classrooms });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async create(req: Request, res: Response) {
    const { subject, vacancies } = req.body;

    if (!subject) {
      return res
        .status(400)
        .json({ success: false, msg: "Subject is missing." });
    }
    try {
      const classroom = await db.classrooms.create({
        data: {
          subject,
          vacancies,
        },
      });

      if (classroom) {
        return res
          .status(200)
          .json({ success: true, msg: "Classroom created.", data: classroom });
      }

      return res
        .status(500)
        .json({ success: false, msg: "Classroom not created." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const classroom = await db.classrooms.findUnique({
        where: {
          id,
        },
      });

      if (classroom) {
        return res
          .status(200)
          .json({ success: true, msg: "Classroom showed.", data: classroom });
      }

      return res
        .status(404)
        .json({ success: false, msg: "Classroom not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { subject, vacancies } = req.body;

    try {
      const classroom = await db.classrooms.findUnique({
        where: {
          id,
        },
      });

      if (!classroom) {
        return res
          .status(404)
          .json({ success: false, msg: "Classroom not found." });
      }

      if (subject && vacancies) {
        await db.classrooms.update({
          where: {
            id,
          },
          data: {
            subject,
            vacancies,
          },
        });

        return res
          .status(200)
          .json({ success: true, msg: "Classroom updated." });
      }

      return res
        .status(400)
        .json({ success: false, msg: "Classroom not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const classroom = await db.classrooms.findUnique({
        where: {
          id,
        },
      });

      if (classroom) {
        await db.classrooms.delete({
          where: { id },
        });
        return res
          .status(200)
          .json({ success: true, msg: "Classroom deleted." });
      }

      return res
        .status(404)
        .json({ success: false, msg: "Classroom not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default classroomController;
