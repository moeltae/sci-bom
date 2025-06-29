/*
  Warnings:

  - You are about to drop the `bom_items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bom_items";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "estimatedCost" REAL,
    "supplier" TEXT,
    "catalog" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "experimentId" TEXT NOT NULL,
    CONSTRAINT "items_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "experiments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
