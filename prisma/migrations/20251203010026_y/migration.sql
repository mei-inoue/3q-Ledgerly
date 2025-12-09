/*
  Warnings:

  - You are about to drop the `Point` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Point";

-- CreateTable
CREATE TABLE "users2" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "users2_pkey" PRIMARY KEY ("id")
);
