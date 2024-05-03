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
};

const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  const transformEventData = (data: any[]) => {
    const transformedData = data.map((item) => {
      const eventDate = new Date(item.ActionDate);
      let eventResults = [];

      if (item.DirOut === 0) {  // DirOut In
        for (let i = 0; i < 3; i++) {
          const endDate = new Date(eventDate);
          const startDate = new Date(eventDate);
          endDate.setDate(eventDate.getDate() + i);

          let color = "black"; // Default color
          let eventTitle = `${item.Letter}: ${item.CardID}`; // Default title
          let eventHexColor = "#ddd"; // Default hex color

          if (i === 1) {
            eventHexColor = "#fff";
          } else if (i === 2) {
            eventTitle = `${item.Letter}: ${item.BoxCode}`;
            color = "blue";
          }

          eventResults.push({
            id: item.CardID,
            title: eventTitle,
            start: endDate,
            end: endDate,
            color: color,
            hexColor: eventHexColor
          });
        }
      } else if (item.DirOut === 1) { // DirOut Out
        for (let i = -1; i < 2; i++) {
          const endDate = new Date(eventDate);
          const startDate = new Date(eventDate);
          endDate.setDate(eventDate.getDate() + i);

          let color = "black"; // Default color
          let eventTitle = `${item.Letter}: ${item.CardID}`; // Default title
          let eventHexColor = "#ddd"; // Default hex color

          if (i === -1) {
            eventTitle = `${item.Letter}: ${item.BoxCode}`;
            color = "green";
            eventHexColor = "#fff";
          } else if (i === 1) {
            eventHexColor = "#fff";
          }

          eventResults.push({
            id: item.CardID,
            title: eventTitle,
            start: endDate,
            end: endDate,
            color: color,
            hexColor: eventHexColor
          });
        }
      } else {
        // Handle other cases here
      }

      return eventResults;
    });

    // Flatten the array of arrays into a single array
    return transformedData.flat();
  };

  const eventStyleGetter = (event: any, start: any, end: any, isSelected: boolean) => {
    const style = {
      backgroundColor: event.hexColor,
      borderRadius: '0px',
      color: event.color,
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  const fetchData = async (startDate: Date, endDate: Date) => {
    try {
      const response = await instance.get(`/drop-actions?startDate=${startDate}&endDate=${endDate}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch drop actions");
      }
      const data = response.data.results;
      const transformedData = transformEventData(data);
      setEvents(transformedData);
    } catch (error) {
      console.error("Error fetching drop actions:", error);
    }
  };

  useEffect(() => {
    const today = moment(); // Get current date
    const startDate = moment(today).startOf('month').startOf('week').toDate(); // Start from first day of the month, start of the week
    const endDate = moment(today).endOf('month').endOf('week').toDate(); // End at last day of the month, end of the week
    
    fetchData(startDate, endDate);
  }, []);

  const handleNavigate = (newDate: Date, view: string, action: string) => {
    const startDate = moment(newDate).startOf('month').startOf('week').toDate(); // Start from first day of the month, start of the week
    const endDate = moment(newDate).endOf('month').endOf('week').toDate(); // End at last day of the month, end of the week

    fetchData(startDate, endDate);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-200 px-4 py-2 sm:px-8 sm:py-4 lg:px-24 lg:py-4 flex-shrink-0">
        <img src={Logo} alt="home" className="mb-4 sm:mb-0" />
      </div>

      <div className="flex flex-col flex-grow">
        <div className="overflow-hidden flex-grow">
          <Calendar
            style={{ height: "100%" }}
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['month']}
            showAllEvents
            onNavigate={handleNavigate}
            eventPropGetter={(eventStyleGetter)}
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
