import { useSelector } from "react-redux";
import { State } from "../types";

export function useAssetTokens() {
  return useSelector((state: State) => state.assets.tokens);
}

export function useAssetTokensSingle(add: string) {
  return useSelector((state: State) => state.assets.tokens[add]);
}
