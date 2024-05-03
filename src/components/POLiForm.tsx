/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  Link,
} from "@mui/material";
import DateControl from "../utils/DateControl";
import SpinNumber from "../utils/SpinNumber";
import POLiImage from "../assets/images/poli.png";
import ButtonGroup from "./ButtonGroup";
import { Dayjs } from "dayjs";

interface POLiFormProps {
  handlePayClick: () => void;
  onNumberOfUnitsChange: (value: number) => void; // Event handler for numberOfUnits
  onStartDateChange: (value: Dayjs | null) => void; // Event handler for startDate
  onDepositChange: (value: number) => void;
  onAdministrationChange: (value: number) => void;
}

const POLiForm: React.FC<POLiFormProps> = ({
  handlePayClick,
  onNumberOfUnitsChange,
  onStartDateChange,
  onDepositChange,
  onAdministrationChange,
}) => {
  const [numberOfUnits, setNumberOfUnits] = React.useState(1);

  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);

  const [deposit, setDeposit] = React.useState("250");

  const [administration, setAdministration] = React.useState("25");

  const [total, setTotal] = React.useState(250);

  const handleDeposit = (value: string) => {
    setDeposit(value);
    onDepositChange(parseInt(value));
  };

  const handleAdministrator = (value: string) => {
    setAdministration(value);
    onAdministrationChange(parseInt(value));
  };

  function handlePayButtonClick(): void {
    if (numberOfUnits > 3 || numberOfUnits < 1 || Number.isNaN(numberOfUnits)) {
      alert("Number of Units is invalid");
      return;
    } else if (startDate == null) {
      alert("Start Date is invalid");
      return;
    } else if (parseInt(deposit) == 0) {
      alert("Deposit is invalid");
      return;
    } else if (parseInt(administration) == 0) {
      alert("Administration is invalid");
      return;
    }
    handlePayClick();
  }

  const handleNumberChange = (value: number) => {
    const totalValue = value * 250;
    setTotal(totalValue);
    setNumberOfUnits(value);
    onNumberOfUnitsChange(value); // Notify the parent component about the change
  };

  const handleDateChange = (value: Dayjs | null) => {
    setStartDate(value);
    onStartDateChange(value); // Notify the parent component about the change
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} className="mt-4" sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
        <Grid item xs={12} lg={6}>
          <div className="flex flex-col h-full items-center justify-center border border-solid border-slate-300 rounded-lg mr-4 bg-slate-300 items-center mr-0">
            <img src={POLiImage} className="w-[60%] mb-4" alt="poli" />
            <Link
              href="https://www.polipay.co.nz/poli-for-consumers"
              target="_blank"
            >
              Learn more about POLi
            </Link>
          </div>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography variant="h6" className="mb-4 text-center">
            Pay with POLi
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className="text-[14px]">Number of Units</Typography>
              <SpinNumber min={1} max={3} onChange={handleNumberChange} />
            </Grid>
            <Grid item xs={12}>
              <Typography className="text-[14px]">Start Date</Typography>
              <DateControl onChange={handleDateChange} />
            </Grid>

            <Grid item xs={6} className="items-center">
              <Typography className="min-w-[120px] text-[14px]">
                Deposit
              </Typography>
              <FormControl fullWidth>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  size="small"
                  value={250}
                  // onChange={(e) => handleDeposit(e.target.value)}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Typography className="text-[14px]">Administration</Typography>
              <FormControl fullWidth>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  size="small"
                  value={25}
                  // onChange={(e) => handleAdministrator(e.target.value)}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography className="text-[14px] font-bold">Total</Typography>
              <FormControl fullWidth>
                <OutlinedInput
                  disabled={true}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  size="small"
                  value={total}
                />
              </FormControl>
            </Grid>
            {/* Buttons */}
            <Grid item xs={12}>
              <ButtonGroup handlePayButtonClick={handlePayButtonClick} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default POLiForm;
