import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Container, Stepper, Step, Box, StepLabel, Button, Typography } from "@mui/material";
import PersonForm from "../components/PersonForm";
import Terms from "../components/Terms";
import CCForm from "../components/CCForm";
import UnitsForm from "../components/UnitsForm";
import Copyright from "../layouts/CopyRight";
import Logo from "../assets/images/whiteleigh_logo.svg";
import CompletedImg from "../assets/images/order-details-order-status-128.png";
import instance from "../lib/axios";
import { Stripe, loadStripe, StripeCardElement, StripeError, PaymentIntent } from '@stripe/stripe-js';
import { CardElement, useElements, useStripe, Elements } from '@stripe/react-stripe-js';

import {
  IInvoice,
  IContact,
  ITrackingCategory,
  IUnitDetails,
  ICardDetails,
} from "../interface/interface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dayjs } from "dayjs";

interface CreatePaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
}

interface PaymentResult {
  success: boolean;
}

const NewCustomer = () => {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [activeStep, setActiveStep] = React.useState(0);
  const [validData, setValidData] = useState(false);

  const stripePromise = loadStripe('pk_test_51OzC0BK5qqhEVBOynfW3vsEUnTSgAweIZP6FD0UqRElqZMG9Zie8xlDNPMZWtgZikar4rRi16l1aLjxV7Z8hh0Fq0077iomFgQ');

  const steps = ['Details', 'Agreement', 'Units', 'Pay'];

  const handleNext = () => {
    let isValidStep = false;

    switch (activeStep) {
      case 0: // Assuming this is the step for filling in personal details
        isValidStep = validatePersonalDetails();
        break;
      case 1: // Assuming this is the step for accepting terms
        isValidStep = acceptedTerms; // Directly use the state that tracks if terms are accepted
        if (!isValidStep) {
          showToast("Please accept the terms to proceed.", "error");
        }
        break;
      case 2: // Assuming this is the step for unit details
        isValidStep = validateUnitDetails();
        break;
      case 3: // Final step before payment
        isValidStep = validatePaymentDetails();
        break;
      default:
        console.warn("Unknown step");
        break;
    }

    if (isValidStep) {
      if (activeStep === steps.length - 1) {
        handlePayClick(); // Trigger payment if it's the last step and valid
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Move to the next step if valid
      }
    }
  };

  // Example validation function for personal details
  const validatePersonalDetails = () => {
    // Implement validation logic here
    // For example, check if the storer object has all required fields filled
    if (storer.firstname && storer.lastname && storer.email && storer.address && storer.phones.length > 0) {
      return true;
    } else {
      showToast("Please fill in all personal details.", "error");
      return false;
    }
  };

  // Example validation function for unit details
  const validateUnitDetails = () => {
    // Implement validation logic here
    // For example, check if the unitDetails object has valid values
    if (unitDetails.numberOfUnits > 0 && unitDetails.startDate) {
      return true;
    } else {
      showToast("Please fill in all unit details.", "error");
      return false;
    }
  };

  // Example validation function for payment details
  const validatePaymentDetails = () => {
    // Implement validation logic here
    // For example, check if the cardDetails object has all required fields filled
    if (cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvc && cardDetails.name) {
      return true;
    } else {
      showToast("Please fill in all payment details.", "error");
      return false;
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCancel = () => {
    navigate("/");
  }

  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [references, setReferences] = useState<any[]>([]);
  const [trackingCategories, setTrackingCategories] = useState<
    ITrackingCategory[]
  >([]);

  const showToast = (message: string, type = "info") => {
    if (type == "error") {
      toast["error"](message);
    } else {
      toast["info"](message);
    }
  };

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

    for (let i = 0; i < NumberOfUnits; i++) {
      const randomIndex = Math.floor(Math.random() * availableLPNumbers.length);
      const randomLPNumber = availableLPNumbers[randomIndex];
      availableLPNumbers.splice(randomIndex, randomIndex);
      resReference = resReference + randomLPNumber;
    }
    return resReference; // Returning the generated number with 'LP' prefix
  };

  const [storer, setStorer] = useState<IContact>({
    firstname: "",
    lastname: "",
    email: "",
    phones: [],
    address: "",
  });

  const [unitDetails, setUnitDetails] = useState<IUnitDetails>({
    numberOfUnits: 1,
    startDate: null,
    deposit: 250,
    administration: 25,
    total: 250
  });

  const [cardDetails, setCardDetails] = useState<ICardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
    focused: 'name'
  });

  const [invoiceData, setInvoiceData] = useState<IInvoice>({
    contactID: "",
    trackingCategoryID: "",
    trackingOptionID: "",
    description: "",
    quantity: 0,
    unitAmount: 0,
    accountCode: "",
  });

  const validateAndFillData = (): boolean => {
    // Check if any of the required fields are empty
    if (
      storer.firstname === "" ||
      storer.lastname === "" ||
      storer.email === "" ||
      storer.phones.length === 0 ||
      storer.address === "" ||
      unitDetails.numberOfUnits <= 0 ||
      unitDetails.startDate === null ||
      cardDetails.cardNumber === '' ||
      cardDetails.expiryDate === '' ||
      cardDetails.cvc === '' ||
      cardDetails.name === '' ||
      !acceptedTerms
    ) {
      // If any required field is empty, return false
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(storer.email)) {
      return false;
    }

    // If all validations pass, set valid data
    setValidData(true);
    return true;
  };

  const createPaymentIntent = async (amount: number): Promise<CreatePaymentIntentResponse> => {
    try {
      const response = await instance.post<CreatePaymentIntentResponse>('/create-payment-intent', {
        amount: amount,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  };

  const ConfirmPayment = async (clientSecret: string, cardDetails: ICardDetails): Promise<PaymentResult> => {
    console.log(stripe, "Stripe============")
    console.log(elements, "elements============")
    if (!stripe || !elements) {
      console.error("Stripe or elements not initialized");
      return { success: false }; // Ensure to handle this case appropriately
    }

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        console.error("Card element not found");
        return { success: false }; // Handle this case as well
      }

      const { paymentIntent, error } = await stripe.confirmCardSetup()(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardDetails.name,
          },
        },
      });

      // const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: {
      //     card: cardElement,
      //     billing_details: {
      //       name: cardDetails.name,
      //     },
      //   },
      // });

      if (error) {
        console.error("Error confirming payment:", error.message);
        return { success: false };
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Error during payment confirmation:", error);
      return { success: false };
    }
  };

  const handlePayClick = async () => {
    const isValid = validateAndFillData();
    if (isValid) {
      try {
        setLoading(true); // Activate loading

        const newLPReference = generateLPReference(references, unitDetails.numberOfUnits);
        console.log(newLPReference, "newLPReference");
        if (!newLPReference) {
          return;
        }

        // Create payment intent with Stripe
        const { paymentIntentId, clientSecret } = await createPaymentIntent(unitDetails.total * 100); // Convert to cents

        if (paymentIntentId && clientSecret) {
          // Confirm the payment with Stripe
          console.log(paymentIntentId, "paymentIntentId~")
          const paymentResult = await ConfirmPayment(clientSecret, cardDetails);
          console.log(paymentResult, "paymentResult~")
          if (paymentResult.success) {
            showToast("Payment Successful", "info");
            const customerResult = await createCustomer();

            if (customerResult.contactID) {
              const contactID = customerResult.contactID;
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
                quantity: unitDetails.numberOfUnits,
                unitAmount: 250.0,
                accountCode: "000",
                reference: newLPReference,
                deposit: unitDetails.deposit,
                administration: unitDetails.administration,
                startDate: unitDetails.startDate?.format('DD/MM/YYYY'),
              };

              setInvoiceData(invoiceData);

              const InitialinvoiceResult = await createInvoice(invoiceData);
            }
            getAvailableReferences();
            setLoading(false); // Deactivate loading
          } else {
            setLoading(false); // Deactivate loading
            showToast("Payment failed", "error");
          }
        } else {
          setLoading(false); // Deactivate loading
          showToast("Failed to create payment intent", "error");
        }
      } catch (error) {
        setLoading(false); // Deactivate loading

        console.error("Error:", error);
        // Handle any unexpected errors here
      }
    } else {
      showToast("Please fill in all required fields.", "error");
    }
  }

  const handleClickHome = () => {
    navigate("/");
  };

  const createCustomer = async () => {
    try {
      showToast("Creating customer...", "info");

      const response = await instance.post("/customer", { ...storer });

      const message = response.data.message || "Customer creation failed";

      if (response.status === 200) {
        const contactID = response.data.contacts[0].contactID;
        // setContactId(contactID);
        showToast(message, "info");
        return { message: message, contactID: contactID };
      } else {
        showToast(message, "error");
        return { message: message };
      }
    } catch (err: any) {
      const errorMessage =
        err.response.data.message || "Customer creation failed";
      showToast(errorMessage, "error");
      return (
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        "Something went wrong"
      );
    }
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

  async function getAvailableReferences() {
    try {
      const response = await instance.get("/repeating-invoices-reference"); // Replace '/invoices' with your API endpoint
      const references = response.data.references;

      setReferences(references);
      generateLPReference(references, unitDetails.numberOfUnits);

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
    getAvailableReferences(); // Fetch invoices when the component mounts
    getTrackingCategories(); // Fetch tracking categories when the component mounts
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
        <div className="flex items-center bg-gray-400 h-screen">
          <Container maxWidth="sm" sx={{ mb: 4 }}>
            {/* New Customer page */}
            <Paper
              elevation={3}
              sx={{ my: { xs: 3, md: 6 } }}
              className="flex flex-col"
            >
              <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 justify-between items-center">
                <img src={Logo} alt="home" className="mb-4 sm:mb-0" />
              </div>
              {/* <img src={HomeLogo} className="w-[40%] self-center" alt="home" /> */}
              <div className="p-2 md:p-3">
                <Box sx={{ width: '100%' }}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                      const stepProps: { completed?: boolean } = {};
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  {activeStep === steps.length ? (
                    <React.Fragment>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <img src={CompletedImg} alt="completed Order" style={{ width: '128px' }} />
                      </div>
                      <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
                        All steps completed - Check your e-mail
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                        <Button onClick={handleClickHome} variant="contained" color="primary">Close</Button>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {/* Storer Details */}
                      {activeStep === 0 && (
                        <PersonForm
                          values={storer}
                          onChangeValues={(values) => {
                            setStorer({ ...values });
                          }}
                        />
                      )}
                      {activeStep === 1 && (
                        <Terms
                          acceptedTerms={acceptedTerms}
                          onHandleTermsClick={(accepted) => {
                            setAcceptedTerms(accepted);
                          }}
                        />
                      )}
                      {activeStep === 2 && (
                        <UnitsForm
                          values={unitDetails}
                          onChangeValues={(values) => {
                            setUnitDetails({ ...values });
                          }}
                        />
                      )}
                      {activeStep === 3 && (
                        <CCForm
                          values={cardDetails}
                          onChangeValues={(values) => {
                            setCardDetails({ ...values });
                          }}
                        />
                      )}
                      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />

                        <Button color="inherit" onClick={handleCancel} sx={{ mr: 1 }}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleNext}
                        >
                          {activeStep === steps.length - 1 ? 'Pay' : 'Next'}
                        </Button>
                        <CardElement />
                      </Box>
                    </React.Fragment>
                  )}
                </Box>
              </div>
            </Paper>

            {/* CopyRight */}
            <Copyright />
          </Container>
        </div>
        <ToastContainer position="top-center" />
      </React.Fragment>
  );
};
export default NewCustomer;
