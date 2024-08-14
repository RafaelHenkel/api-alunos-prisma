import { Request, Response } from "express";
import db from "../database/prisma.connection";
import ClassroomService from "../services/classroom.service";

class registrationController {
  public async list(req: Request, res: Response) {
    try {
      const registrations = await db.registrations.findMany();

      return res.status(200).json({
        success: true,
        msg: "List registrations.",
        data: registrations,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async create(req: Request, res: Response) {
    const { studentId, classroomId } = req.body;

    try {
      if (!studentId || !classroomId) {
        return res
          .status(400)
          .json({ success: false, msg: "Required fields." });
      }

      const findStudent = await db.students.findMany({
        where: { id: studentId },
      });
      if (!findStudent) {
        return res
          .status(400)
          .json({ success: false, msg: "Student not find." });
      }

      const findClassroom = await db.classrooms.findUnique({
        where: { id: classroomId },
      });
      if (!findClassroom) {
        return res
          .status(400)
          .json({ success: false, msg: "Classroom not find." });
      }

      if (findClassroom.vacancies === 0) {
        return res
          .status(400)
          .json({ success: false, msg: "Classroom does not have vacancies." });
      }

      const registration = await db.registrations.create({
        data: {
          classroomId,
          studentId,
        },
      });

      const serviceClassroom = new ClassroomService();
      await serviceClassroom.useVacancies(classroomId);

      return res.status(200).json({
        success: true,
        msg: "registration created.",
        data: registration,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const registration = await db.registrations.findUnique({
        where: {
          id,
        },
      });

      if (registration) {
        return res.status(200).json({
          success: true,
          msg: "Registration showed.",
          data: registration,
        });
      }

      return res
        .status(404)
        .json({ success: false, msg: "Registration not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { studentId, classroomId } = req.body;

    try {
      const registration = await db.registrations.findUnique({
        where: {
          id,
        },
      });

      if (!registration) {
        return res
          .status(404)
          .json({ success: false, msg: "Registration not found." });
      }

      if (studentId && classroomId) {
        await db.registrations.update({
          where: {
            id,
          },
          data: {
            studentId,
            classroomId,
          },
        });

        return res
          .status(200)
          .json({ success: true, msg: "Registration updated." });
      }

      return res
        .status(400)
        .json({ success: false, msg: "Registration not updated." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const registration = await db.registrations.findUnique({
        where: {
          id,
        },
      });

      if (registration) {
        await db.registrations.delete({
          where: { id },
        });
        return res
          .status(200)
          .json({ success: true, msg: "Registration deleted." });
      }

      return res
        .status(404)
        .json({ success: false, msg: "Registration not found." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "ERROR Database." });
    }
  }
}

export default registrationController;
