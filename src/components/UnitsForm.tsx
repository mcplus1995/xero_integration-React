/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Grid, Box, MenuItem } from '@mui/material';
import Typography from "@mui/material/Typography";
import { IUnitDetails } from "../interface/interface";

import {
    FormControl,
    OutlinedInput,
    InputAdornment,
    Select
} from "@mui/material";
import DateControl from "../utils/DateControl";
import backImage from "../assets/images/whiteleighStorage (5).jpg";

interface UnitsFormProps {
    values: IUnitDetails,
    onChangeValues: (values: IUnitDetails) => void;
}

const UnitsForm: React.FC<UnitsFormProps> = ({
    values,
    onChangeValues,
}) => {
    return (
        <React.Fragment>
            <Grid container spacing={2} className="mt-4" sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
                <Grid item xs={12} lg={6}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="stretch" // Stretch items vertically
                        justifyContent="center"
                        mr={{ xs: 0, lg: 4 }} // Adjust margin for smaller screens
                        height="100%" // Ensure the height is 100% of the container
                        overflow="hidden" // Hide overflow to prevent image from overflowing
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexGrow={1} // Allow the image box to grow to fill the available space
                        >
                            <img
                                src={backImage}
                                style={{
                                    maxHeight: '100%', // Make sure the image doesn't exceed the height of its container
                                    width: 'auto', // Allow the image to resize itself based on height
                                    objectFit: 'contain', // Fit the image within the container while preserving aspect ratio
                                }}
                                alt="back1"
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography className="text-[14px]">Number of Units</Typography>
                            <Select
                                value={values.numberOfUnits}
                                onChange={(e) => {
                                    onChangeValues({
                                        ...values,
                                        numberOfUnits: Number(e.target.value), // Convert to number
                                        total: Number(e.target.value) * 250
                                    });
                                }}
                                style={{ width: "100%" }}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className="text-[14px]">Start Date</Typography>
                            <DateControl
                                value={values.startDate}
                                // onChange={handleDateChange}
                                onChange={(value) => {
                                    onChangeValues({
                                        ...values,
                                        startDate: value, // Convert to number
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className="items-center hidden">
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
                                    disabled
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} className='hidden'>
                            <Typography className="text-[14px]">Administration</Typography>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    startAdornment={
                                        <InputAdornment position="start">$</InputAdornment>
                                    }
                                    size="small"
                                    value={25}
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
                                    value={values.total}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
export default UnitsForm;
