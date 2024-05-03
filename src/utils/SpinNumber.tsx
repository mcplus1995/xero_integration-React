import * as React from "react";
import { FormControl, OutlinedInput } from "@mui/material";

const SpinNumber = ({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (value: number) => void;
}) => {
  const [number, setNumber] = React.useState<number>(1);

  const handleChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (parsedValue <= min) {
      setNumber(min);
      onChange(min);
    } else if (parsedValue >= max) {
      setNumber(max);
      onChange(max);
    } else {
      setNumber(parsedValue);
      onChange(parsedValue);
    }
  };
  return (
    <FormControl fullWidth>
      <OutlinedInput
        id="outlined-adornment-amount"
        type="number"
        size="small"
        value={number}
        onChange={(e) => handleChange(e.target.value)}
      />
    </FormControl>
  );
};
export default SpinNumber;
