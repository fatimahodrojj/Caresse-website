-- Admin requests: when the status last changed, and the clinic settings
-- (contact details shown on the site, request retention period).

-- AlterTable
ALTER TABLE "AppointmentRequest" ADD COLUMN     "statusChangedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ClinicSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "addressAr" TEXT NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "retentionMonths" INTEGER NOT NULL DEFAULT 12,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicSettings_pkey" PRIMARY KEY ("id")
);


-- Current clinic details, as on the site today.
INSERT INTO "ClinicSettings" ("id", "phone", "email", "addressEn", "addressAr", "instagramUrl", "retentionMonths", "updatedAt")
VALUES (
  1,
  '+961 71056803',
  'caresseclinic@gmail.com',
  'Airport Road, Zaarour Center, Third floor',
  'طريق المطار، مركز زعرور، الطابق الثالث',
  'https://www.instagram.com/caresseclinic',
  12,
  CURRENT_TIMESTAMP
);
