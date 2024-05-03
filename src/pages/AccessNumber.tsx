import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import instance from "../lib/axios";
import { Container } from "@mui/material";

// Define the structure of a card
interface AccessCard {
  id: number;
  cardNumber: number;
  unitNumber: number;
  status: number;
}

const AccessNumber = () => {
  const [accessCards, setAccessCards] = useState<AccessCard[]>([]);

  // Assume you fetch the data and update the state with it
  useEffect(() => {
    // Call the function to fetch data
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulating API response
      const response = await instance.get("/access");
      const result = await response.data.result;
      // Update state with API response
      const cardsData: AccessCard[] = result;
      setAccessCards(cardsData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center bg-gray-400">
        <Container maxWidth="sm" sx={{ mb: 4 }}>
          {/* New Customer page */}

          <Paper
            elevation={3}
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            className="flex flex-col"
          >
            <h2>Access Cards:</h2>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Unit Number</TableCell>
                    <TableCell align="right">Card Number</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accessCards.map((card) => (
                    <TableRow
                      key={card.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {card.unitNumber}
                      </TableCell>
                      <TableCell align="right">{card.cardNumber}</TableCell>
                      <TableCell align="right">
                        {card.status === 1 ? "Active" : "Inactive"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AccessNumber;
