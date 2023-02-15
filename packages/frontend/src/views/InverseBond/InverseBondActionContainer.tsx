import { Button, Flex } from "@bds-libs/uikit";
import UnlockButton from "components/UnlockButton";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useGetInverseBondFunc } from "hooks/useTotalSupply";

const InverseBondActionContainer = ({
  onBuy,
  disabledBuy,
}: {
  onBuy: () => void;
  disabledBuy?: boolean;
}) => {
  const { t } = useTranslation();
  const isActive = useGetInverseBondFunc("_isActive");
  const { account } = useActiveWeb3React();

  if (!account) {
    return <UnlockButton style={{ flex: 1 }} />;
  }

  if (!isActive) {
    return (
      <Flex textAlign="center" justifyContent="center">
        <Button
          maxWidth="300px"
          mb="10px"
          style={{ flex: 1 }}
          variant="action"
          disabled
        >
          {t("Not active")}
        </Button>
      </Flex>
    );
  }

  return (
    <Flex textAlign="center" justifyContent="center">
      <Button
        disabled={disabledBuy}
        mb="10px"
        style={{ flex: 1 }}
        variant="action"
        onClick={onBuy}
        maxWidth="300px"
      >
        {t("Buy inverse bond")}
      </Button>
    </Flex>
  );
};

export default InverseBondActionContainer;
