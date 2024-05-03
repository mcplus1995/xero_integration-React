import { Typography, Link } from "@mui/material";
const Copyright = () => {
  return (
    <Typography variant="body2" color="text.primary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        WHITELEIGH.COM
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
export default Copyright;
