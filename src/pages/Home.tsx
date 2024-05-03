import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, Divider } from "@mui/material";

import LoginModal from "../components/LoginModal";
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import Copyright from "../layouts/CopyRight";
import Logo from "../assets/images/whiteleigh_logo.svg";
import BxsCctv from "../assets/images/bxs_cctv.png";
import ParkSolidCard from "../assets/images/icon-park-solid_card-two.png";
import MaterialSymbols from "../assets/images/material-symbols_detector-alarm-sharp.png";
import MdiDrive from "../assets/images/mdi_drive-eta.png";
import MdiGarage from "../assets/images/mdi_garage.png";
import LockImg from "../assets/images/lock.png";
import WhiteleighStorage1 from "../assets/images/whiteleighStorage (1).jpg";
import WhiteleighStorage2 from "../assets/images/whiteleighStorage (2).jpg";
import WhiteleighStorage3 from "../assets/images/whiteleighStorage (3).jpg";
import WhiteleighStorage4 from "../assets/images/whiteleighStorage (4).jpg";

import { GoogleMap, useLoadScript, MarkerF, Libraries } from '@react-google-maps/api';
import { useState } from "react";
import instance from "../lib/axios";

import { Link, animateScroll as scroll } from 'react-scroll';

const Home = () => {
  const navigate = useNavigate();

  const libraries: Libraries = ['places'];
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDoPCMXiK9XZu_7CJt18hCZxmqfYc68z8k',
    libraries: libraries,
  });

  const [imageHeight, setImageHeight] = useState(0);

  React.useEffect(() => {
    // Function to calculate and set the image height
    const updateImageHeight = () => {
      const containerElement = document.querySelector('.alice-carousel') as HTMLElement | null;

      if (containerElement) {
        const containerWidth = containerElement.offsetWidth;
        const aspectRatio = 16 / 9; // Assuming a 16:9 aspect ratio, adjust accordingly
        const newImageHeight = containerWidth / aspectRatio;

        setImageHeight(newImageHeight);
        containerElement.style.margin = '0';
      }
    };

    // Initial calculation on mount
    updateImageHeight();

    // Event listener for window resize
    window.addEventListener('resize', updateImageHeight);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateImageHeight);
    };
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: `${imageHeight - 40}px`,
  };

  const initialCenter = {
    lat: -43.54156361609041, lng: 172.60576108011503
  };

  const [center, setCenter] = useState(initialCenter);

  // Login Modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  // // For Snackbar
  // const [openSnack, setOpenSnack] = useState<boolean>(false);
  // const [message, setMessage] = useState<string>("");
  // const [severity, setSeverity] = useState<string>("success");

  // const handleSnackClick = () => {
  //     setOpenSnack(true);
  // };

  // const handleSnackClose = (event: any, reason: any) => {
  //     if (reason === "clickaway") {
  //         return;
  //     }
  //     setOpenSnack(false);
  // };

  const handleClickBook = () => {
    navigate("/book");
  };

  const handleClickContact = () => {
    navigate("/contact");
  };

  const openLoginModal = () => {
    setOpenModal((p) => !p);
  };

  const handleLogin = async (email: string) => {
    openLoginModal();
    navigate(`/customer/${email}`); // Navigate to the '/customer/:email' route with the provided email
  };

  const handleContactByEmail = () => {
    window.location.href = 'mailto:your@email.com';
  }

  return (
    <div className="grid grid-cols-1">
      <div className="header flex justify-between items-center px-12">
        <Typography component="h1" className="py-2 text-[12px]">
          SELF STORAGE IN ADDINGTON, CHRISTCHURCH (<Link
            to="map"
            smooth={true}
            duration={500}
            spy={true}
            offset={-50} // Adjust offset as needed
            className="cursor-pointer text-yellow-400 hover:text-yellow-500"
          >Map</Link>)
        </Typography>
        {/* <button
          className="px-4 py-2 bg-white border-0 cursor-pointer"
          onClick={openLoginModal}
        >
          Login
        </button> */}
      </div>

      <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 flex flex-col sm:flex-row justify-between items-center">
        <img src={Logo} alt="home" className="mb-4 sm:mb-0" />
        <div className="flex-grow text-center">
          <Typography component="h1" className="py-2 font-bold text-[32px]">
            Single Garages - $350/month
          </Typography>
          {/* <Typography component="h2" className="py-2 font-bold text-[14px]">
          subject to change (without notice)
          </Typography> */}
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="contained"
            size="large"
            style={{ backgroundColor: '#ffd600', color: 'black' }}
            onClick={handleClickBook}
            className="hidden"
          >
            Reserve Space
          </Button>

          <Button
            variant="contained"
            style={{ backgroundColor: '#fff', color: 'black' }}
            size="large"
            onClick={handleClickContact}
          >
            Contact Us
          </Button>
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <div className="grid grid-cols-3 lg:grid-cols-6 flex gap-4 place-content-center">
          <div className="flex-col text-center flex-1 max-w-150">
            <img src={ParkSolidCard} alt="" className="h-[80px] w-auto" />
            <Typography component="h1" className="py-2 text-[16px] font-bold text-center">Swipe card entry</Typography>
          </div>
          <div className="flex-col text-center flex-1 max-w-150">
            <img src={LockImg} alt="" className="h-[80px] w-auto" />
            <Typography component="h1" className="py-2 text-[16px] font-bold text-center">Own Padlock</Typography>
          </div>
          <div className="flex-col text-center flex-1 max-w-150">
            <img src={MdiGarage} alt="" className="h-[80px] w-auto" />
            <Typography component="h1" className="py-2 text-[16px] font-bold text-center">Ground Floor <br /> Drive-up Units</Typography>
          </div>
          <div className="flex-col text-center flex-1 max-w-150">
            <img src={BxsCctv} alt="" className="h-[80px] w-auto" />
            <Typography component="h1" className="py-2 text-[16px] font-bold text-center">24/7 Access <br /> &amp; Security</Typography>
          </div>
          <div className="flex-col text-center flex-1 max-w-150">
            <img src={MaterialSymbols} alt="" className="h-[80px] w-auto" />
            <Typography component="h1" className="py-2 text-[16px] font-bold text-center">Individually Alarmed</Typography>
          </div>
          <div className="flex-col text-center flex-1 max-w-150">
            <img src={MdiDrive} alt="" className="h-[80px] w-auto" />
            <Typography component="h1" className="py-2 text-[16px] font-bold text-center">Contactless <br /> Checkin & Checkout</Typography>
          </div>
        </div>

        <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col object-cover lg:col-span-1 m-0">
            <AliceCarousel
              autoPlay
              autoPlayInterval={3000}
              disableButtonsControls // Set disableButtonsControls to hide arrows
            >
              <img src={WhiteleighStorage1} style={{ height: `${imageHeight}px` }} className="w-full object-cover" />
              <img src={WhiteleighStorage2} style={{ height: `${imageHeight}px` }} className="w-full object-cover" />
              <img src={WhiteleighStorage3} style={{ height: `${imageHeight}px` }} className="w-full object-cover" />
              <img src={WhiteleighStorage4} style={{ height: `${imageHeight}px` }} className="w-full object-cover" />
            </AliceCarousel>
          </div>

          <div className="flex-1">
            <Typography component="h1" className="pb-4 text-[16px]">
              9 Longley Place, Addington, Christchurch 8024, New Zealand
            </Typography>
            {/* Map section */}
            {isLoaded && (
              <div id="map">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={10}
                  center={center}
                  onCenterChanged={() => { }}
                >
                  <MarkerF position={center} />
                </GoogleMap>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4">
          {/* CopyRight */}
          <Copyright />
        </div>
      </div>

      <LoginModal
        open={openModal}
        setOpen={openLoginModal}
        handleLogin={handleLogin}
      />
    </div >
  );
};

export default Home;
