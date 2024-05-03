import * as React from "react";
import { Typography, Box, Button } from "@mui/material";
import DateControl from "../utils/DateControl";
import instance from "../lib/axios";
import { repeatingResult } from "../pages/OldCustomer";
import dayjs, { Dayjs } from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


interface unitsProps {
  repeatingResult: repeatingResult[];
  contactID: string;
  daily: number
}

const UnitsTable = ({ repeatingResult, daily, contactID }: unitsProps) => {
  const navigate = useNavigate();

  const [totalBalance, setTotalBalance] = React.useState<number>(0)
  const [repeatingInvoices, setRepeatingInvoices] = React.useState<repeatingResult[]>([]);

  // Function to display toast notifications
  const showToast = (message: string, type = "info") => {
    if (type == "error") {
      toast["error"](message);
    } else {
      toast["info"](message);
    }
  };

  React.useEffect(() => {
    setRepeatingInvoices(repeatingResult);
  }, [repeatingResult])

  const onDateChange = (value: Dayjs | null, index: number) => {
    if (value !== null) {
      var renewDate = dayjs(repeatingInvoices[index].formattedNextScheduledDate, 'DD/MM/YYYY');
      const diffInDays = value.diff(renewDate, 'day');

      setRepeatingInvoices((prevInvoices) => {
        const newDates = [...prevInvoices];
        newDates[index].endDate = value.format('DD/MM/YYYY');
        const prevBalance = newDates[index].balance || 0
        const balance = (diffInDays * daily).toFixed(2);
        setTotalBalance((value) => value - prevBalance + parseFloat(balance));
        newDates[index].balance = parseFloat(balance);
        newDates[index].quantity = diffInDays;
        return newDates;
      });
    }
  };

  const handleSave = async () => {
    console.log(repeatingInvoices);
    // Do something with the dates, e.g., send them to an API
    // console.log("Saved dates:", dates);
    try {
      showToast("Updating invoice...", "info");
      const response = await instance.post("/updateInvoice", {
        contactID: contactID,
        repeatingInvoices: repeatingInvoices,
      });

      if (response.status === 200) {
        showToast(response.data.message, "info")

      } else {
        showToast(response.data.message, "error");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update repeating invoice";

      showToast(errorMessage, "error");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <React.Fragment>
      <Typography variant="h6" className="mt-8 mb-2">
        Your Units
      </Typography>
      <div className="overflow-x-auto">
        <table className="border-collapse border border-dashed border-gray-300 mx-auto">
          <thead>
            <tr>
              <th className="min-w-[100px] p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center">
                Unit Number
              </th>
              <th className="min-w-[100px] p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center">
                Renewal Date
              </th>
              <th className="min-w-[150px] p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center">
                End Date
              </th>
              <th className="min-w-[100px] p-2 border-0 border-dashed border-gray-300 text-[14px] text-center">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {repeatingResult.length > 0 ? (
              repeatingResult.map((unit, i) => {
                return (
                  <tr
                    key={i}
                    className="border-[1px] border-dashed border-gray-300 items-center"
                  >
                    <td className="p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center">
                      {unit.reference}
                    </td>
                    <td
                      className="p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center"
                    >
                      {unit.formattedNextScheduledDate}
                    </td>
                    <td className="p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center">
                      <DateControl value={unit.endDate} minDate={unit.formattedNextScheduledDate} onChange={(value) => onDateChange(value, i)} />
                    </td>
                    <td className="p-2 border-0 border-dashed border-gray-300 text-[14px] text-center">
                      ${unit.balance || 0}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="p-2 border-0 text-[14px] text-center">
                  No units
                </td>
              </tr>
            )}

            {repeatingResult.length > 0 && (
              <tr
                key={4}
                className="border-[1px] border-dashed border-gray-300 items-center"
              >
                <td colSpan={3} className="p-2 border-0 border-r-[1px] border-dashed border-gray-300 text-[14px] text-center">
                  Total
                </td>

                <td colSpan={1} className="p-2 border-0 border-dashed border-gray-300 text-[14px] text-center">
                  ${totalBalance.toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Box className="flex flex-row mt-4 mb-4 gap-2 justify-end">
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={handleSave}
        >
          Pay
        </Button>
        <Button
          variant="outlined"
          color="warning"
          size="small"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Box>
      <ToastContainer position="top-center" />
    </React.Fragment>
  );
};
export default UnitsTable;
