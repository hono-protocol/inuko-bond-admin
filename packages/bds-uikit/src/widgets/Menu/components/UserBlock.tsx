import React from "react";
import Button from "../../../components/Button/Button";
import { useWalletModal } from "../../WalletModal";
import { Login } from "../../WalletModal/types";

interface Props {
  account?: string;
  login: Login;
  logout: () => void;
  isMobile?: boolean;
}

const UserBlock: React.FC<Props> = ({
  account,
  login,
  logout,
  isMobile = false,
}) => {
  const { onPresentAccountModal, onPresentConnectModal } = useWalletModal(
    login,
    logout,
    account
  );
  const accountEllipsis = account
    ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}`
    : null;
  return (
    <div>
      {account ? (
        <Button
          scale={isMobile ? "xs" : "md"}
          variant="action"
          onClick={onPresentAccountModal}
        >
          {accountEllipsis}
        </Button>
      ) : (
        <Button
          variant="action"
          minWidth="140px"
          scale={isMobile ? "xs" : "md"}
          onClick={onPresentConnectModal}
        >
          Connect
        </Button>
      )}
    </div>
  );
};

export default React.memo(
  UserBlock,
  (prevProps, nextProps) => prevProps.account === nextProps.account
);
