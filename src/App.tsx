import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewCustomer from "./pages/NewCustomer";
import OldCustomer from "./pages/OldCustomer";
import AccessNumber from "./pages/AccessNumber";
import Contact from "./pages/Contact";
import CalendarComponent from "./admin/Calendar";
import ConfirmationPage from "./pages/ConfirmationPage";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

function App() {
  // const stripePromise = loadStripe('pk_test_51OzC0BK5qqhEVBOynfW3vsEUnTSgAweIZP6FD0UqRElqZMG9Zie8xlDNPMZWtgZikar4rRi16l1aLjxV7Z8hh0Fq0077iomFgQ');
  const stripePromise = loadStripe('pk_test_51PAy40GIdTOEFqJWjrV5H6WncobHD6OU0XISZNec7XlEvJLFnOFx90St7ulGbVTd9UKHgNzXdF7PipAcNNi0HKrD00qXDtBCXa');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Elements stripe={stripePromise}><NewCustomer /></Elements>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />

        {/* Modified route with an email parameter */}
        <Route path="/customer/:email" element={<OldCustomer />} />
        <Route path="/accessNumber" element={<AccessNumber />} />
        <Route path="/calendar" element={<CalendarComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
