import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';

interface DateControlProps {
  value?: Dayjs | null | string;
  minDate?: string;
  onChange: (value: Dayjs | null) => void;
}

const DateControl: React.FC<DateControlProps> = ({ onChange, value, minDate }) => {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [selectedMinDate, setSelectedMinDate] = React.useState<Dayjs | undefined>(undefined);
  const [selectedMaxDate, setSelectedMaxDate] = React.useState<Dayjs | undefined>(undefined);

  React.useEffect(() => {
    if (value) {
      setSelectedDate(dayjs(value, 'DD/MM/YYYY'));
    }
  }, [value])

  React.useEffect(() => {
    if (minDate) {
      setSelectedMinDate(dayjs(minDate, 'DD/MM/YYYY'));
      setSelectedMaxDate(dayjs(minDate, 'DD/MM/YYYY').add(1, 'month'));
    }
  }, [minDate])

  const handleChange = (value: Dayjs | null) => {
    setSelectedDate(value); // Update the selected date in the component state
    onChange(value); // Pass the selected date value back to the parent component
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        className="w-full borderless"
        slotProps={{
          openPickerIcon: { fontSize: "small" },
          textField: {
            size: "small",
          },
        }}
        minDate={selectedMinDate}
        maxDate={selectedMaxDate}
        value={selectedDate} // Set the value of the DatePicker to the selectedDate state
        onChange={handleChange}
        format="DD-MM-YYYY"
      />
    </LocalizationProvider>
  );
};

export default DateControl;
