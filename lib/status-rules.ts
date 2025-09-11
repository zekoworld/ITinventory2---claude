// lib/status-rules.ts
import { AssetStatus, LocationType } from '@prisma/client';

export interface StatusRule {
  allowedFrom: AssetStatus[];
  location: LocationType;
  requiredFields: string[];
  autoFields: { [key: string]: any };
  requiresNote: boolean;
  unassignsUser?: boolean;
}

export const STATUS_RULES: Record<AssetStatus, StatusRule> = {
  [AssetStatus.Setup]: {
    allowedFrom: [AssetStatus.InUse, AssetStatus.ToBeDeployed, AssetStatus.Repaired, AssetStatus.Retired],
    location: LocationType.SetupShelf,
    requiredFields: ['deploymentSetupDate'],
    autoFields: {},
    requiresNote: true,
  },
  [AssetStatus.ToBeDeployed]: {
    allowedFrom: [AssetStatus.InUse, AssetStatus.Repaired, AssetStatus.Setup, AssetStatus.Retired],
    location: LocationType.DeploymentShelf,
    requiredFields: [],
    autoFields: { toBeDeployedDate: new Date() },
    requiresNote: false,
  },
  [AssetStatus.InUse]: {
    allowedFrom: [AssetStatus.ToBeDeployed, AssetStatus.Setup],
    location: LocationType.Storage,
    requiredFields: ['assignedToUserId'],
    autoFields: { userInUseDate: new Date() },
    requiresNote: false,
  },
  [AssetStatus.ToBeRepaired]: {
    allowedFrom: [AssetStatus.InUse, AssetStatus.ToBeDeployed, AssetStatus.Setup, AssetStatus.UnderRepair, AssetStatus.Repaired, AssetStatus.Retired],
    location: LocationType.DamagedShelf,
    requiredFields: [],
    autoFields: { reportedToRepairDate: new Date() },
    requiresNote: true,
    unassignsUser: true,
  },
  [AssetStatus.UnderRepair]: {
    allowedFrom: [AssetStatus.ToBeRepaired],
    location: LocationType.UnderRepairShelf,
    requiredFields: ['underRepairDate'],
    autoFields: {},
    requiresNote: true,
  },
  [AssetStatus.Repaired]: {
    allowedFrom: [AssetStatus.UnderRepair],
    location: LocationType.RepairedShelf,
    requiredFields: ['repairedDate'],
    autoFields: {},
    requiresNote: true,
  },
  [AssetStatus.Retired]: {
    allowedFrom: [AssetStatus.InUse, AssetStatus.Setup, AssetStatus.ToBeDeployed, AssetStatus.UnderRepair, AssetStatus.Repaired],
    location: LocationType.RetiredShelf,
    requiredFields: ['retiredDate'],
    autoFields: {},
    requiresNote: true,
    unassignsUser: true,
  },
};

export function canTransitionStatus(from: AssetStatus, to: AssetStatus): boolean {
  return STATUS_RULES[to].allowedFrom.includes(from);
}
