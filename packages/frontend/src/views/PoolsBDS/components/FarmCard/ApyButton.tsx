import React from "react";
import { IconButton, useModal, CalculateIcon } from "@bds-libs/uikit";
import AprCalculatorModal from "components/AprCalculatorModal";
import { useTranslation } from "contexts/Localization";
import { Token } from "../../../../config/constants/types";
import ApyCalculatorModal from "../../../../components/ApyCalculatorModal";

export interface ApyButtonProps {
  lpLabel?: string;
  apr?: number;
  addLiquidityUrl?: string;
  earnToken?: Token;
  earnPrice?: number;
  className?: string;
  mode?: "apy" | "apr";
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  earnPrice,
  apr,
  addLiquidityUrl,
  earnToken,
  className,
  mode = "apr",
}) => {
  const { t } = useTranslation();
  const [onPresentApyModal] = useModal(
    mode === "apr" ? (
      <AprCalculatorModal
        earningTokenSymbol={earnToken.symbol}
        linkLabel={`${t("Get")} ${lpLabel}`}
        tokenPrice={earnPrice}
        apr={apr}
        linkHref={addLiquidityUrl}
      />
    ) : (
      <ApyCalculatorModal
        earningTokenSymbol={earnToken.symbol}
        linkLabel={`${t("Get")} ${lpLabel}`}
        tokenPrice={earnPrice}
        apr={apr}
        linkHref={addLiquidityUrl}
      />
    )
  );

  const handleClickButton = (event): void => {
    event.stopPropagation();
    onPresentApyModal();
  };

  return (
    <IconButton
      onClick={handleClickButton}
      variant="text"
      scale="sm"
      ml="4px"
      className={className}
    >
      <CalculateIcon color="primary" width="18px" />
    </IconButton>
  );
};

export default ApyButton;
