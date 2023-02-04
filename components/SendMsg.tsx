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
    <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
      <div>
        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">{text}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {displayTime}
        </span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
    </div>
  );
};

export default ResponseMsg;
