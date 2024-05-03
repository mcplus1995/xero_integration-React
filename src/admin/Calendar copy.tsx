import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography } from "@mui/material";

import "react-alice-carousel/lib/alice-carousel.css";

import Copyright from "../layouts/CopyRight";
import Logo from "../assets/images/whiteleigh_logo.svg";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import instance from "../lib/axios";

type Event = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
};

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  const transformEventData = (data: any[]) => {
    const currentDate = new Date(); // Get current date
    const transformedData = data.map((item) => {
      const eventDate = new Date(item.ActionDate);
      const diffInDays = Math.floor((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)); // Calculate difference in days

      let eventColor = "black"; // Default color
      let eventTitle = `Box ${item.BoxID} - Card ${item.CardID}`; // Default title

      if (item.DirOut === 0) {  // DirOut In
        if (diffInDays === 0) {
          eventTitle += " - Access Card ID"; // Show Access Card ID in title
        } else if (diffInDays === 1) {
          eventTitle += " - Access Card ID"; // Show Access Card ID in title for next day
        } else if (diffInDays === 2) {
          eventTitle += " - Pass Code"; // Show Pass Code in title for day after next day
          eventColor = "blue";
        }
      } else if (item.DirOut === 1) { // DirOut Out
        if (diffInDays === -1) {
          eventColor = "green"; // Show Pass Code in green
        }
      }

      return {
        id: item.CardID,
        title: eventTitle,
        start: eventDate,
        end: eventDate,
        color: eventColor,
        description: `Box Code: ${item.BoxCode}`,
      };
    });

    return transformedData;
  };

  const fetchData = async () => {
    try {
      // Fetching drop actions from the backend
      const response = await instance.get("/drop-actions");
      if (response.status !== 200) {
        throw new Error("Failed to fetch drop actions");
      }
      const data = response.data.results; // Assuming the response data contains an array of drop actions
      const transformedData = transformEventData(data); // Transform the data
      setEvents(transformedData);
    } catch (error) {
      console.error("Error fetching drop actions:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Event handler when selecting a date on the calendar
  const handleSelectDate = (slotInfo: { start: any }) => {
    console.log("Selected date:", slotInfo.start);
    // You can implement highlighting related days here
    // For example, update the state to highlight related days
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 flex-shrink-0">
        <img src={Logo} alt="home" className="mb-4 sm:mb-0" />
      </div>

      <div className="flex flex-col flex-grow">
        <Button
          variant="contained"
          color="primary"
          onClick={fetchData}
          style={{ margin: "16px" }}
        >
          Refresh Events
        </Button>
        <div className="overflow-hidden flex-grow">
          <Calendar
            style={{ height: "100%" }} // Set height to fill container
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectDate}
          />
        </div>
      </div>

      <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 flex-shrink-0">
        <Copyright />
      </div>
    </div>
  );
};

export default CalendarComponent;