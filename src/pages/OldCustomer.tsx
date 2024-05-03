import React, { useEffect, useState } from "react";
import { Typography, Paper, Container, Tabs, Tab, Box } from "@mui/material";
import POLiForm from "../components/POLiForm";
import CCForm from "../components/CCForm";
import Copyright from "../layouts/CopyRight";
import Logo from "../assets/images/whiteleigh_logo.svg";
import UnitsTable from "../components/UnitsTable";
import { useParams } from "react-router-dom";
import instance from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import {
  IInvoice,
  ITrackingCategory,
  ICardDetails,
} from "../interface/interface";
import { Dayjs } from "dayjs";

export interface repeatingResult {
  reference: string,
  formattedNextScheduledDate: string,
  endDate: string,
  quantity?: number,
  balance?: number
}
const OldCustomer = () => {
  const { email } = useParams(); // Retrieve the email parameter

  const [loading, setLoading] = useState(false);
  const [references, setReferences] = useState<any[]>([]);
  const [NumberOfUnits, setNumberOfUnits] = useState<number>(1);
  const [trackingCategories, setTrackingCategories] = useState<
    ITrackingCategory[]
  >([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Function to display toast notifications
  const showToast = (message: string, type = "info") => {
    if (type == "error") {
      toast["error"](message);
    } else {
      toast["info"](message);
    }
  };

  const [unitNumbers, setUnitNumbers] = useState<string[]>([]); // Define unitNumbers state
  const [repeatingInvoices, setRepeatingInvoices] = useState<repeatingResult[]>([]);
  // const [renewalDate, setRenewalDate] = useState("");
  const [contactID, setContactID] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [deposit, setDeposit] = useState(0);
  const [administration, setAdministration] = useState(0);
  const [daily, setDaily] = useState(0);

  const [invoiceData, setInvoiceData] = useState<IInvoice>({
    contactID: "",
    trackingCategoryID: "",
    trackingOptionID: "",
    description: "",
    quantity: 0,
    unitAmount: 0,
    accountCode: "",
  });

  const [cardDetails, setCardDetails] = useState<ICardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
    focused: 'name'
  });

  async function handleNumberOfUnitsChange(value: number) {
    setNumberOfUnits(value);
  }

  async function handleStartDateChange(value: Dayjs | null) {
    setStartDate(value);
  }

  async function handleDepositChange(value: number) {
    setDeposit(value);
  }

  async function handleAdministrationChange(value: number) {
    setAdministration(value);
  }

  const generateLPReference = (
    existingReferences: string[],
    NumberOfUnits: number
  ): string | null => {
    const allLPNumbers: string[] = Array.from(
      { length: 69 },
      (_, i) => (i + 1).toString().padStart(2, "0") // Ensure two digits with leading zeros
    );

    const existingLPNumbers = new Set(); // Initialize array to store extracted numbers

    existingReferences.forEach((str) => {
      const LPstart = str.startsWith("LP");
      if (LPstart) {
        str = str.slice(2);
        for (let i = 0; i < str.length; i += 2) {
          const pair = str.slice(i, i + 2);
          existingLPNumbers.add(pair);
        }
      }
    });

    const uniqueExistingLPNumbers = Array.from(existingLPNumbers);
    console.log(uniqueExistingLPNumbers);
    const usedLPNumbers = new Set(uniqueExistingLPNumbers);

    let availableLPNumbers = allLPNumbers.filter(
      (lp) => !usedLPNumbers.has(lp)
    );
    console.log(availableLPNumbers.length, "Length")
    if (
      availableLPNumbers.length === 0 ||
      availableLPNumbers.length < NumberOfUnits
    ) {
      showToast("Error: All Refrences are already used.", "error");
      setLoading(false);
      return null;
    }

    let resReference = "LP";

    console.log(availableLPNumbers);
    for (let i = 0; i < NumberOfUnits; i++) {
      const randomIndex = Math.floor(Math.random() * availableLPNumbers.length);
      const randomLPNumber = availableLPNumbers[randomIndex];
      availableLPNumbers.splice(randomIndex, randomIndex);
      resReference = resReference + randomLPNumber;
    }
    return resReference; // Returning the generated number with 'LP' prefix
  };

  // Function to create an invoice
  const createInvoice = async (invoiceData: IInvoice) => {
    try {
      showToast("Creating invoice...", "info");
      const response = await instance.post("/customizedInvoice", {
        ...invoiceData,
      });

      const message = response.data.message || "Customer creation failed";

      if (response.status === 200) {
        showToast(message, "info");
        return { status: "success", message };
      } else {
        showToast(message, "error");
        return { status: "error", message };
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create invoice";

      showToast(errorMessage, "error");
      return errorMessage;
    }
  };

  async function handlePayClick() {
    try {
      setLoading(true); // Activate loading

      const newLPReference = generateLPReference(references, NumberOfUnits);
      console.log(newLPReference);
      if (!newLPReference) {
        return;
      }

      // const customerResult = await createCustomer();

      if (contactID) {
        const invoiceData = {
          contactID,
          trackingCategoryID:
            trackingCategories.length > 0
              ? trackingCategories[0].trackingCategoryID
              : "fa437cfd-f005-4538-ae84-943857da5c8c",
          trackingOptionID:
            trackingCategories.length > 0 &&
              trackingCategories[0].options.length > 0
              ? trackingCategories[0].options[0].trackingOptionID
              : "7b354c1c-cf59-42fc-9449-a65c51988335",
          description: "Invoice description",
          quantity: NumberOfUnits,
          unitAmount: 250.0,
          accountCode: "000",
          reference: newLPReference,
          deposit: deposit,
          administration: administration,
          startDate: startDate?.format('DD/MM/YYYY'),
        };

        setInvoiceData(invoiceData);

        const InitialinvoiceResult = await createInvoice(invoiceData);
      }
      getAvailableReferences();
      await getInvoicebyEmail();
      setLoading(false); // Deactivate loading
    } catch (error) {
      setLoading(false); // Deactivate loading

      console.error("Error:", error);
      // Handle any unexpected errors here
    }
  }

  async function getInvoicebyEmail() {
    try {
      const response = await instance.post("/getUnitsbyEmail", {
        email: email,
      });

      // Assuming the response contains data like contactId, firstName, reference, etc.
      const { contactID, firstName, daily, repeatResult } =
        response.data;

      // Use the retrieved data as needed
      console.log("Contact ID:", contactID);

      setContactID(contactID);
      setRepeatingInvoices(repeatResult);
      setDaily(daily);

      return response.data.message || "Invoice creation failed";
    } catch (error) {
      console.log("Error sending email to old customer:", error);
      showToast("Error sending email to old customer", "error");
      // Handle error scenarios here if needed
      return "Error occurred while fetching data";
    }
  }

  async function getAvailableReferences() {
    try {
      const response = await instance.get("/repeating-invoices-reference"); // Replace '/invoices' with your API endpoint
      const references = response.data.references;

      setReferences(references);
      generateLPReference(references, NumberOfUnits);

      return response.data.message || "Invoice creation failed";
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // Handle error or set appropriate state to indicate failure
    }
  }

  async function getTrackingCategories() {
    try {
      const response = await instance.get("/tracking-categories"); // Replace '/tracking-categories' with your API endpoint for tracking categories
      setTrackingCategories(response.data.trackingCategories); // Assuming the response contains the tracking categories data
      return response.data.message || "Tracking categories fetch failed";
    } catch (error) {
      console.error("Error fetching tracking categories:", error);
      // Handle error or set appropriate state to indicate failure
    }
  }

  useEffect(() => {
    async function fetchData() {
      const result = await getInvoicebyEmail(); // Fetch invoices when the component mounts
      getTrackingCategories();
      console.log(result);
    }
    fetchData();
  }, []); // Passing an empty dependency array ensures this runs only once when mounted

  return (
    <React.Fragment>
      {/* Container */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          Loading...
        </div>
      )}
      <div className="flex items-center bg-gray-400" style={{ height: "100vh" }}>
        <Container maxWidth="sm" sx={{ mb: 4 }}>
          <Paper elevation={3} sx={{ my: { xs: 3, md: 6 } }} className="flex flex-col">
            <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 justify-between items-center">
              <img src={Logo} alt="home" className="mb-4 sm:mb-0" />
            </div>

            <div className="p-2 md:p-3">
              <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                <Tab label="Your Units" />
                <Tab label="Reserve Space" />
              </Tabs>
              <TabPanel value={selectedTab} index={0}>
                <UnitsTable repeatingResult={repeatingInvoices} daily={daily} contactID={contactID} />
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                {/* <POLiForm
                  handlePayClick={handlePayClick}
                  onNumberOfUnitsChange={handleNumberOfUnitsChange}
                  onStartDateChange={handleStartDateChange}
                  onDepositChange={handleDepositChange}
                  onAdministrationChange={handleAdministrationChange}
                /> */}
                <CCForm
                  values={cardDetails}
                  onChangeValues={(values) => {
                    setCardDetails({ ...values });
                  }}
                />
              </TabPanel>

            </div>
          </Paper>
          {/* CopyRight */}
          <Copyright />
        </Container>
        <ToastContainer position="top-center" />
      </div>
    </React.Fragment>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default OldCustomer;
