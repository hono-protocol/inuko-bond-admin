import { useSelector } from "react-redux";
import { State } from "../types";

export function useStatistics() {
  return useSelector((state: State) => state.statistics);
}

export function useStatisticsKRC20() {
  return useSelector((state: State) => state.statistics.krc20);
}
