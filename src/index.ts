import express from "express";
import * as dotenv from "dotenv";
import studentsRoutes from "./routes/students.routes";
import classroomsRoutes from "./routes/classrooms.routes";
import registrationsRoutes from "./routes/registrations.routes";
import usersRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());

//ROUTES
app.use("/students", studentsRoutes());
app.use("/classrooms", classroomsRoutes());
app.use("/registrations", registrationsRoutes());
app.use("/users", usersRoutes());
app.use("/auth", authRoutes());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}...`);
});
