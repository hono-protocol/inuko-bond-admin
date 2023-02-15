import { Button, Flex } from "@bds-libs/uikit";
import UnlockButton from "components/UnlockButton";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useGetBondFunc } from "hooks/useTotalSupply";

const BondActionContainer = ({
  onBuy,
  onList,
  disabledBuy,
}: {
  onBuy: () => void;
  onList: () => void;
  disabledBuy?: boolean;
}) => {
  const { t } = useTranslation();
  // const isActive = useGetBondFunc("isActive");
  const isActive = true;
  const { account } = useActiveWeb3React();

  if (!account) {
    return <UnlockButton style={{ flex: 1 }} />;
  }

  if (!isActive) {
    return (
      <Flex>
        <Button mx="10px" style={{ flex: 1 }} variant="action" onClick={onList}>
          {t("Claim bond")}
        </Button>
        <Button mx="10px" style={{ flex: 1 }} variant="action" disabled>
          {t("Not active")}
        </Button>
      </Flex>
    );
  }

  return (
    <Flex>
      <Button mx="10px" style={{ flex: 1 }} variant="action" onClick={onList}>
        {t("Claim bond")}
      </Button>
      <Button
        mx="10px"
        disabled={disabledBuy}
        // disabled={true}
        style={{ flex: 1 }}
        variant="action"
        onClick={onBuy}
      >
        {t("Buy bond")}
      </Button>
    </Flex>
  );
};

export default BondActionContainer;
