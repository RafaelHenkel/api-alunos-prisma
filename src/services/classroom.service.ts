import db from "../database/prisma.connection";
class ClassroomService {
  public async useVacancies(id: string) {
    const classroomFind = await db.classrooms.findUnique({
      where: {
        id,
      },
    });

    if (!classroomFind) {
      throw new Error("Classroom not found, useVacancies.");
    }

    if (classroomFind.vacancies === 0) {
      throw new Error("Classroom not vacancies, useVacancies.");
    }

    await db.classrooms.update({
      where: {
        id,
      },
      data: {
        vacancies: classroomFind.vacancies - 1,
      },
    });
  }
}

export default ClassroomService;
