import { Card } from "flowbite-react";
import React from "react";

const Quote = ({
  quote,
  date,
  event_location,
}: {
  quote: string;
  date: string;
  event_location: string;
}) => {
  return (
    <Card href="#" className="w-30">
      <p className="font-normal text-gray-700 dark:text-gray-400">{quote} </p>
      <h6 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
        {date}, {event_location}
      </h6>
    </Card>
  );
};

export default Quote;
