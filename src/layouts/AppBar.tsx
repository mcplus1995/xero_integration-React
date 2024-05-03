import { AppBar, Toolbar, Link } from "@mui/material";
import HomeLogo from "../assets/images/home_logo.png";

const WAppBar = () => {
  return (
    <AppBar
      position="absolute"
      color="default"
      elevation={0}
      sx={{
        position: "relative",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Toolbar>
        <Link color="inherit" href="/">
          <img src={HomeLogo} className="w-[200px]" />
        </Link>
      </Toolbar>
    </AppBar>
  );
};
export default WAppBar;
