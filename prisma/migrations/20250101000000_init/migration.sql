CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'VIEWER');
CREATE TYPE "JobStatus" AS ENUM ('Active', 'Departed', 'Retired');
CREATE TYPE "WorkStyle" AS ENUM ('Onsite', 'Remote', 'Hybrid');
CREATE TYPE "AssetStatus" AS ENUM ('Setup', 'ToBeDeployed', 'InUse', 'ToBeRepaired', 'UnderRepair', 'Repaired', 'Retired');
CREATE TYPE "LocationType" AS ENUM ('Storage', 'SetupShelf', 'DeploymentShelf', 'DamagedShelf', 'UnderRepairShelf', 'RepairedShelf', 'RetiredShelf');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "jobStatus" "JobStatus" NOT NULL DEFAULT 'Active',
    "workStyle" "WorkStyle" NOT NULL DEFAULT 'Onsite',
    "currentAddress" TEXT,
    "homeAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "hardware" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "assetTag" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'Setup',
    "location" "LocationType" NOT NULL DEFAULT 'SetupShelf',
    "purchaseDate" TIMESTAMP(3),
    "newAssetArrivalDate" TIMESTAMP(3),
    "warrantyEndDate" TIMESTAMP(3),
    "deploymentSetupDate" TIMESTAMP(3),
    "toBeDeployedDate" TIMESTAMP(3),
    "firstInUseAssetDate" TIMESTAMP(3),
    "userInUseDate" TIMESTAMP(3),
    "reportedToRepairDate" TIMESTAMP(3),
    "underRepairDate" TIMESTAMP(3),
    "repairedDate" TIMESTAMP(3),
    "retiredDate" TIMESTAMP(3),
    "outOfRetirementDate" TIMESTAMP(3),
    "assignedToUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "hardware_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "history" (
    "id" TEXT NOT NULL,
    "hardwareId" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "location" "LocationType" NOT NULL,
    "changedBy" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "userId" TEXT,
    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "hardware_assetTag_key" ON "hardware"("assetTag");

ALTER TABLE "hardware" ADD CONSTRAINT "hardware_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "history" ADD CONSTRAINT "history_hardwareId_fkey" FOREIGN KEY ("hardwareId") REFERENCES "hardware"("id") ON DELETE CASCADE ON UPDATE CASCADE;
