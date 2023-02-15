import styled from "styled-components";
import { Flex } from "../Box";

const StyledBottomNavItem = styled(Flex)`
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 5px 8px;
  padding-bottom: env(safe-area-inset-bottom);
  background: #052e22;
  border-top: 1px solid #052e22;
  box-shadow: 0px 0px 3px rgba(255, 255, 255, 0.4);
`;

export default StyledBottomNavItem;
