import { Address, FarmConfig } from "../config/constants/types";
import { getMasterChefAddress } from "./addressHelpers";

const ARCHIVED_FARMS_START_PID = 100;
const ARCHIVED_FARMS_END_PID = 200;

const isArchivedPid = (pid: number) =>
  pid >= ARCHIVED_FARMS_START_PID && pid <= ARCHIVED_FARMS_END_PID;

export default isArchivedPid;

export function getFarmFromPidMasterChef(
  farms: FarmConfig[],
  pid: number,
  masterChef: Address
) {
  const master = getMasterChefAddress(masterChef);

  return {
    farm: farms.find((f) => {
      const farmMaster = getMasterChefAddress(f.masterChefContract);
      return f.pid === pid && farmMaster.toLowerCase() === master.toLowerCase();
    }),
    index: farms.findIndex((f) => {
      const farmMaster = getMasterChefAddress(f.masterChefContract);
      return f.pid === pid && farmMaster.toLowerCase() === master.toLowerCase();
    }),
  };
}
