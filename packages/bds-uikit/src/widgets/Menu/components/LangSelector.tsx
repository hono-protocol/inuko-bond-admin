import React from "react";
import { SvgProps } from "../../../components/Svg";
import Text from "../../../components/Text/Text";
import Dropdown from "../../../components/Dropdown/Dropdown";
import Button from "../../../components/Button/Button";
import * as IconModule from "../icons";
import { Language } from "../types";
import MenuButton from "./MenuButton";

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };
const { LanguageIcon } = Icons;

interface Props {
  color?: string;
  currentLang: string;
  langs: Language[];
  onHeader?: boolean;
  setLang: (lang: Language) => void;
}

const LangSelector: React.FC<Props> = ({
  currentLang,
  langs,
  setLang,
  color = "text",
  onHeader = false,
}) => (
  <Dropdown
    position={onHeader ? "bottom" : "top-right"}
    target={
      <Button
        variant="text"
        startIcon={<LanguageIcon color={color} width="30px" />}
      >
        {!onHeader && <Text color={color}>{currentLang?.toUpperCase()}</Text>}
      </Button>
    }
  >
    {langs.map((lang) => (
      <MenuButton
        key={lang.locale}
        fullWidth
        onClick={() => setLang(lang)}
        // Safari fix
        style={{ minHeight: "32px", height: "auto" }}
      >
        {lang.language}
      </MenuButton>
    ))}
  </Dropdown>
);

export default React.memo(
  LangSelector,
  (prev, next) => prev.currentLang === next.currentLang
);
