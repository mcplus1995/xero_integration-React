import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import MinHeightTextarea from "../utils/Textarea";
import { Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";

interface onHandleTermsProps {
  onHandleTermsClick: (value: boolean) => void,
  acceptedTerms: boolean;
}

const Terms: React.FC<onHandleTermsProps> = ({
  onHandleTermsClick,
  acceptedTerms,
}) => {

  const handleChange = (value: boolean) => {
    onHandleTermsClick(value);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const componentRef = React.useRef(null);

  return (
    <React.Fragment>
      <Typography variant="h6" className="mt-8 mb-2">
        Terms and Conditions
      </Typography>
      <Grid container spacing={2}>
        {/* Terms and Conditions */}
        <Grid item xs={12}>
          <MinHeightTextarea ref={componentRef} />
        </Grid>

        {/* Checkbox */}
        <Grid item xs={9}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="saveAddress"
                checked={acceptedTerms}
                onChange={(e) => handleChange(e.target.checked)}
              />
            }
            label="I agree to the terms and conditions above"
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="outlined"
            color="warning"
            className="flex-1 float-right"
            size="small"
            onClick={handlePrint}
          >
            Print PDF
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Terms;
