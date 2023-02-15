import { Button, Flex } from "@bds-libs/uikit";
import UnlockButton from "components/UnlockButton";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useGetStakingFunc } from "hooks/useTotalSupply";

const StakingActionContainer = ({
  onBuy,
  onList,
  canClaim,
}: {
  onBuy: () => void;
  onList: () => void;
  canClaim?: boolean;
}) => {
  const { t } = useTranslation();
  const isActive = useGetStakingFunc("isActive");
  const { account } = useActiveWeb3React();

  if (!account) {
    return (
      <Flex mt="20px">
        <UnlockButton style={{ flex: 1 }} />
      </Flex>
    );
  }

  if (!isActive) {
    return (
      <Flex mt="20px">
        <Button
          disabled={!canClaim}
          mr="20px"
          style={{ flex: 1 }}
          variant="action"
          onClick={onList}
        >
          {t("Unstake")}
        </Button>
        <Button ml="20px" style={{ flex: 1 }} variant="action" disabled>
          {t("Not active")}
        </Button>
      </Flex>
    );
  }

  return (
    <Flex mt="20px">
      <Button
        disabled={!canClaim}
        mr="20px"
        style={{ flex: 1 }}
        variant="action"
        onClick={onList}
      >
        {t("Unstake")}
      </Button>
      <Button ml="20px" style={{ flex: 1 }} variant="action" onClick={onBuy}>
        {t("Stake")}
      </Button>
    </Flex>
  );
};

export default StakingActionContainer;
