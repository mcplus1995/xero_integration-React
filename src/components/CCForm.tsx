/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Grid } from '@mui/material';
import Typography from "@mui/material/Typography";
import {
    FormControl,
    OutlinedInput,
} from "@mui/material";
import Card, { Focused } from 'react-credit-cards';
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
} from './utils'
import 'react-credit-cards/es/styles-compiled.css';
import { ICardDetails } from '../interface/interface';


interface CCFormProps {
    values: ICardDetails;
    onChangeValues: (values: ICardDetails) => void;
}

const CCForm: React.FC<CCFormProps> = ({
    values,
    onChangeValues,
}) => {

    return (
        <React.Fragment>
            <Grid container spacing={2} className="mt-4" sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
                <Grid item xs={12} lg={7}>
                    <Card
                        number={values.cardNumber}
                        name={values.name}
                        expiry={values.expiryDate}
                        cvc={values.cvc}
                        focused={values.focused}
                    />
                </Grid>
                <Grid item xs={12} lg={5}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography className="text-[14px]">Card Number</Typography>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    size="small"
                                    type='tel'
                                    value={values.cardNumber}
                                    onChange={(e) => {
                                        onChangeValues({
                                            ...values,
                                            cardNumber: formatCreditCardNumber(e.target.value),
                                        });
                                    }}
                                    onFocus={() => {
                                        onChangeValues({
                                            ...values,
                                            focused: "number",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className="text-[14px]">Name</Typography>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    size="small"
                                    value={values.name}
                                    onChange={(e) => {
                                        onChangeValues({
                                            ...values,
                                            name: (e.target.value).toUpperCase(),
                                        });
                                    }}
                                    onFocus={() => {
                                        onChangeValues({
                                            ...values,
                                            focused: "name",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className="text-[14px]">Expiry Date</Typography>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    size="small"
                                    value={values.expiryDate}
                                    onChange={(e) => {
                                        onChangeValues({
                                            ...values,
                                            expiryDate: formatExpirationDate(e.target.value),
                                        });
                                    }}
                                    onFocus={() => {
                                        onChangeValues({
                                            ...values,
                                            focused: "expiry",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className="text-[14px]">CVC</Typography>
                            <FormControl fullWidth>
                                <OutlinedInput
                                    size="small"
                                    value={values.cvc}
                                    onChange={(e) => {
                                        onChangeValues({
                                            ...values,
                                            cvc: formatCVC(e.target.value),
                                        });
                                    }}
                                    onFocus={() => {
                                        onChangeValues({
                                            ...values,
                                            focused: "cvc",
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};
export default CCForm;
