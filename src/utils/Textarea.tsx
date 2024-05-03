import * as React from "react";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";

const MinHeightTextarea = React.forwardRef<HTMLTextAreaElement>((props, ref) => {
  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }

    @media print {
      height: auto;
      width: 100%; // Ensure full width for printing
      padding: 10px 20px;
      border: none;
      border-radius: 0;
      box-shadow: none;
      line-height: 1.2;
    }
  `
  );

  const defaultConditions =
    "STORAGE 1. The Storer a. Acknowledges that the only service the Owner is providing to the Storer is a licence to use space allocated to the Storer by the Owner for the sole purpose of storing goods and that no other goods or services are provided or responsibilities are taken by the Owner. b. Is deemed to have knowledge of the goods in the Space. c. Acknowledges that the agreement does not grant the Storer a lease or any interest in the space. 2. The Owner (including directors, employees and agents). a. Does not provide any service other than the space. b. Does not and will not be deemed to have knowledge of the goods. c. Is not a bailee nor a warehouseman of the goods and the Storer acknowledges that the Owner does not take possession of the goods. Costs 3. 3. Upon signing the agreement the Storer must pay to the Owner: a. The deposit (which will be refunded on termination of the agreement). b. The administration fee. 4. The Storer must pay: a. The storage fee or the amount notified to the Storer in writing by the Owner from time to time. The storage fee is payable in advance and it is your responsibility to see that payment is made directly to us, on time, in full, throughout the period of storage. b. The cleaning fee is payable at the Owners discretion if the space require cleaning. c. The late payment fee which becomes payable each time a storage payment is late as indicated. d. Any associated postal or telephone costs incurred by the Owner in collecting late storage fees. e. Cost of providing replacement access cards.Failure to Pay 5. 5. The Storer acknowledges that a.All time limits imposed on the Storer by the agreement must be complied with strictly.b.All goods in the space are subject to a general lien for all storage fees and any other amounts owing to the Owner by the Storer.In the event of the storage fee not being paid in full within the re - entry period, the Owner may enter the space, retain the deposit and / or take possession of any goods in the space and may, at the Owners sole discretion, do any one or more of the following: b.i.Sell the goods by private arrangement or public auction to defray any unpaid storage fee, cleaning fee, late payment fee, or costs associated with collection of fees and / or costs associated with disposal of the goods and / or; b.ii.Dispose of the goods in any other manner, whether for value or not, as the Owner sees fit";

  const [conditions, setConditions] = React.useState("");

  React.useEffect(() => {
    setConditions(defaultConditions);
  }, []);

  return (
    <Textarea
      aria-label="minimum height"
      minRows={7}
      maxRows={7}
      disabled
      placeholder="Terms and Conditions"
      value={conditions}
      className="w-full"
      ref={ref}
    />
  );
});

export default MinHeightTextarea;
