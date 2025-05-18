/*
  Warnings:

  - A unique constraint covering the columns `[numericId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numericId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "numericId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_numericId_key" ON "Product"("numericId");
