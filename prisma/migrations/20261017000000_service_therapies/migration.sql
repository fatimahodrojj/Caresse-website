-- "Preferred Service" now lists therapies instead of conditions.
--
-- Same steps Prisma generates for an enum change, except for the USING
-- clause: the old values (AUTISM, SPEECH_LANGUAGE, ...) have no matching
-- therapy, so any existing rows become NOT_SURE ("Not sure, help me
-- choose") instead of making the cast fail. Production has no requests
-- yet; only preview test data can be affected.

-- AlterEnum
BEGIN;
CREATE TYPE "Service_new" AS ENUM ('SPEECH_THERAPY', 'ABA_THERAPY', 'OCCUPATIONAL_THERAPY', 'PSYCHOMOTOR_SUPPORT', 'NOT_SURE');
ALTER TABLE "AppointmentRequest" ALTER COLUMN "service" TYPE "Service_new" USING ('NOT_SURE'::"Service_new");
ALTER TYPE "Service" RENAME TO "Service_old";
ALTER TYPE "Service_new" RENAME TO "Service";
DROP TYPE "Service_old";
COMMIT;
