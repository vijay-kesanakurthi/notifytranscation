import Image from "next/image";
import React from "react";

interface pageProps {
  notification: any;
}

export default function NotificationCard({ notification }: pageProps) {
  return (
    <div className=" max-w-md items-start  bg-gray-400/25 m-2 p-3 rounded-md">
      <div className="flex items-center space-x-2 mb-2">
        <img
          src={notification.icon}
          alt="logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <h3 className="justify-self-start">
          {notification.notification.title}
        </h3>
      </div>
      <div className="flex flex-col space-y-5 justify-center items-center ">
        {notification.image && (
          <img src={notification.image} className="rounded-xl" />
        )}
        <p>{notification.notification.body}</p>
        <button className=" p-3 bg-black/50 rounded-md">Send</button>
      </div>
    </div>
  );
}
