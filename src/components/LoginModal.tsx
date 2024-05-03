import * as React from "react";
import { Box, Grid, Typography, Modal, TextField, Button } from "@mui/material";
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const LoginModal = ({
  open,
  setOpen,
  handleLogin,
}: {
  open: boolean;
  setOpen: () => void;
  handleLogin: (email: string) => void;
}) => {
  const [email, setEmail] = React.useState<string>("");
  const [errorState, setError] = React.useState<boolean>(false);

  const validateEmail = (email: string) => {
    if (email === "") {
      setError(true);
    } else {
      setError(false);
      handleLogin(email);
    }
  };

  React.useEffect(() => {
    setEmail("");
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={setOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="rounded-md p-4">
        <Typography className="text-[24px] text-center">Log in</Typography>
        <Grid item xs={12}>
          <Typography className="text-[14px]">Email</Typography>
          <TextField
            required
            id="email"
            name="email"
            type="email"
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span
            className={`text-[12px] text-red-500 ${errorState ? "" : "hidden"}`}
          >
            Please check email.
          </span>
        </Grid>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          If your e-mail address is found a time sensitive link will be e-mailed
          to you.
        </Typography>

        <Box className="flex flex-row mt-4 mb-4 gap-2">
          <Button
            variant="contained"
            color="warning"
            className="flex-1"
            size="small"
            onClick={() => validateEmail(email)}
          >
            Ok
          </Button>
          <Button
            variant="outlined"
            color="warning"
            className="flex-1"
            size="small"
            onClick={setOpen}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default LoginModal;
