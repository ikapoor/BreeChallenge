/*
  Warnings:

  - Added the required column `amount` to the `LineOfCreditApplication` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LineOfCreditApplication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    CONSTRAINT "LineOfCreditApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LineOfCreditApplication" ("createdAt", "id", "status", "updatedAt", "user_id") SELECT "createdAt", "id", "status", "updatedAt", "user_id" FROM "LineOfCreditApplication";
DROP TABLE "LineOfCreditApplication";
ALTER TABLE "new_LineOfCreditApplication" RENAME TO "LineOfCreditApplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
