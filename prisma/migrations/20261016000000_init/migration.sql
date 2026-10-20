-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AppointmentFor" AS ENUM ('CHILD', 'SELF');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('AUTISM', 'SPEECH_LANGUAGE', 'NEURO_DEVELOPMENTAL', 'FEEDING', 'FAMILY_SUPPORT', 'CO_THERAPY');

-- CreateEnum
CREATE TYPE "TimeSlot" AS ENUM ('MORNING', 'AFTERNOON');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'CONTACTED', 'APPROVED', 'DECLINED');

-- CreateTable
CREATE TABLE "AppointmentRequest" (
    "id" TEXT NOT NULL,
    "appointmentFor" "AppointmentFor" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "childFirstName" TEXT,
    "childAge" INTEGER,
    "service" "Service" NOT NULL,
    "timeSlot" "TimeSlot" NOT NULL,
    "notes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "consentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionAttempt" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentRequest_status_createdAt_idx" ON "AppointmentRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AppointmentRequest_phone_createdAt_idx" ON "AppointmentRequest"("phone", "createdAt");

-- CreateIndex
CREATE INDEX "SubmissionAttempt_ipHash_createdAt_idx" ON "SubmissionAttempt"("ipHash", "createdAt");

