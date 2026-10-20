-- Adds the language of the form a request was sent from (English or Arabic
-- site). Existing requests all came from the English form, hence the default.

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'AR');

-- AlterTable
ALTER TABLE "AppointmentRequest" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'EN';

