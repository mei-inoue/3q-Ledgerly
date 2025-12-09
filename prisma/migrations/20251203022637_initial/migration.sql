-- CreateTable
CREATE TABLE "Point" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "math" INTEGER NOT NULL,
    "english" INTEGER NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sudentnum" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
