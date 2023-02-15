import { useState } from "react";

const copyToClipboardWithCommand = (content: string) => {
  const el = document.createElement("textarea");
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export default function useCopy(
  toCopy: string,
  onSuccess: () => void = () => {
    // empty
  }
) {
  const [isCopied, setIsCopied] = useState(false);

  function displayTooltip() {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  function copy() {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(toCopy).then(() => {
        onSuccess();
        displayTooltip();
      });
    } else if (document.queryCommandSupported("copy")) {
      copyToClipboardWithCommand(toCopy);
      onSuccess();
      displayTooltip();
    }
  }
  return {
    copy,
    isCopied,
  };
}
