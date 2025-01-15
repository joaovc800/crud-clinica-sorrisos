/*
  Warnings:

  - You are about to drop the column `Historico` on the `Paciente` table. All the data in the column will be lost.
  - Added the required column `DataNascimento` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Funcionario" ADD COLUMN     "DataNascimento" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Paciente" DROP COLUMN "Historico";
