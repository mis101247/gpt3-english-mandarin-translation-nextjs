import React, { useState, useEffect } from "react";

const ResponseMsg = (props: { text: string; msgDateTime: string }) => {
  const { text, msgDateTime } = props;
  const [displayTime, setDisplayTime] = useState("");

  const timeDiff = new Date().getTime() - new Date(msgDateTime).getTime();
  const timeDiffInMin = Math.floor(timeDiff / 1000 / 60);
  const timeDiffInHour = Math.floor(timeDiff / 1000 / 60 / 60);

  let dateTime = "";
  if (timeDiffInHour > 24) {
    dateTime = new Date(msgDateTime).toLocaleString();
  }

  useEffect(() => {
    const processDateTime = dateTime
      ? dateTime
      : timeDiffInMin > 60
      ? `${timeDiffInHour} hours ago`
      : `${timeDiffInMin} mins ago`;

    setDisplayTime(processDateTime);
  }, []);

  return (
    <div className="flex w-full mt-2 space-x-3 max-w-xs">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm">{text}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {displayTime}
        </span>
      </div>
    </div>
  );
};

export default ResponseMsg;
