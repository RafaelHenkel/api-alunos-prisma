-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "student_id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_student_id_key" ON "users"("student_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
