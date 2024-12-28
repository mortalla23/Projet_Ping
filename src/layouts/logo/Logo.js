import { Link } from "react-router-dom";
import baumanLogo from '../../assets/images/logos/bauman.png'; // Importez comme image standard
import { styled } from "@mui/material";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src={baumanLogo} alt="Logo" style={{ height: "100%", width: "auto" }} />
    </LinkStyled>
  );
};

export default Logo;
