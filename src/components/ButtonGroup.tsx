import { Box, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

interface ButtonGroupProps {
  handlePayButtonClick: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ handlePayButtonClick }) => {
  const navigate = useNavigate();

  const handleClickCancel = () => {
    navigate("/");
  };

  const handleClickPay = () => {
    handlePayButtonClick(); // Call the prop function
  };

  return (
    <Box className="flex flex-row my-2 gap-2 float-right">
      <Button
        variant="contained"
        color="warning"
        className="flex-1"
        size="large"
        onClick={handleClickPay}
      >
        Pay
      </Button>
      <Link to="/">
        <Button
          variant="outlined"
          color="warning"
          className="flex-1"
          size="large"
          onClick={handleClickCancel}
        >
          Cancel
        </Button>
      </Link>
    </Box>
  );
};
export default ButtonGroup;
