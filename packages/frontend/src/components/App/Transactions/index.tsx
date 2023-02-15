import React from "react";
import { HistoryIcon, Button, useModal } from "@bds-libs/uikit";
import TransactionsModal from "./TransactionsModal";

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />);
  return (
    <>
      <Button
        variant="text"
        p={0}
        onClick={onPresentTransactionsModal}
        ml="16px"
      >
        <HistoryIcon color="primaryBright" width="24px" />
      </Button>
    </>
  );
};

export default Transactions;
