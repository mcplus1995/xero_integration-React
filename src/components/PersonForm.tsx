import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { MuiTelInput } from "mui-tel-input";
import { IContact } from "../interface/interface";

function PersonForm({
  values,
  onChangeValues,
}: {
  values: IContact;
  onChangeValues: (values: IContact) => void;
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({
    address: '',
    email: '',
  });

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddress = e.target.value;

    // Make a request to the Addressable API for address autocomplete
    try {
      const response = await fetch(`https://api.addressable.dev/v2/autocomplete?q=${inputAddress}&api_key=1l5mIL_eZnUsabt1qwojRg&country_code=NZ`);
      const data = await response.json();

      console.log("aaaaaaaaaaaaa", data)
      // Update the suggestions based on the API response
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }

    // Continue with your existing logic for updating the state
    handleInputChange(e, 'address');
  };

  const validateAddress = (address: string): string => {
    return address.trim() !== '' ? '' : 'Address is required';
  };

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid ? '' : 'Invalid email address';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ): void => {
    const newValue = e.target.value;

    let validationError = '';
    if (field === 'address') {
      validationError = validateAddress(newValue);
    } else if (field === 'email') {
      validationError = validateEmail(newValue);
    }

    setErrors({
      ...errors,
      [field]: validationError,
    });

    onChangeValues({
      ...values,
      [field]: newValue,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" className="mt-8 mb-4">
        Storer Details
      </Typography>
      <Grid container spacing={2}>
        {/* First Name */}
        <Grid item xs={12} sm={6} className="">
          <Typography className="text-[14px]">First Name</Typography>
          <TextField
            required
            id="firstName"
            name="firstName"
            fullWidth
            autoComplete="given-name"
            size="small"
            value={values.firstname}
            onChange={(e) => {
              onChangeValues({
                ...values,
                firstname: e.target.value,
              });
            }}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={6}>
          <Typography className="text-[14px]">Last Name</Typography>
          <TextField
            required
            id="lastName"
            name="lastName"
            fullWidth
            autoComplete="family-name"
            size="small"
            value={values.lastname}
            onChange={(e) => {
              onChangeValues({
                ...values,
                lastname: e.target.value,
              });
            }}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <Typography className="text-[14px]">Address</Typography>
          <Autocomplete
            freeSolo
            options={suggestions?.map((suggestion: any) => suggestion.formatted)}
            value={values.address}
            // onChange={handleAddressChange} // Use onInput event
            renderInput={(params) => (
              <TextField
                {...params}
                required
                id="address"
                name="address"
                fullWidth
                autoComplete="shipping address-line1"
                size="small"
                error={Boolean(errors.address)}
                helperText={errors.address}
                onChange={handleAddressChange}
              // onInput={handleAddressChange} // Use onInput event
              />
            )}
          />
        </Grid>

        {/* Phone and Mobile */}
        <Grid item xs={12} sm={6}>
          <Typography className="text-[14px]">Phone</Typography>
          <MuiTelInput
            defaultCountry="NZ"
            className="w-full h-10"
            size="small"
            onChange={(e) => {
              onChangeValues({
                ...values,
                phones: [e.valueOf(), values.phones[1] || ""],
              });
            }}
            value={values.phones[0]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography className="text-[14px]">Mobile</Typography>
          <MuiTelInput
            defaultCountry="NZ"
            className="w-full"
            size="small"
            onChange={(e) => {
              onChangeValues({
                ...values,
                phones: [values.phones[0] || "", e.valueOf()],
              });
            }}
            value={values.phones[1]}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12}>
          <Typography className="text-[14px]">Email</Typography>
          <TextField
            required
            id="email"
            name="email"
            type="email"
            fullWidth
            size="small"
            error={Boolean(errors.email)}
            helperText={errors.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'email')}
            value={values.email}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
export default PersonForm;
