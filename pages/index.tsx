import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Auth, useAuth } from "@arcana/auth-react";
import { use, useEffect, useState } from "react";
import { useProvider } from "@arcana/auth-react";
import { AuthProvider } from "@arcana/auth";
import * as PushAPI from "@pushprotocol/restapi";
import NotificationCard from "@/components/notification";
const inter = Inter({ subsets: ["latin"] });
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { channelData, getSubscriptions } from "@/components/push";

export default function Home({ call }: any) {
  // const auth = provider;
  const user = useAuth();
  const toastss = (msg: String) => toast(msg);
  const [notifications, setNotifications] = useState<any>([]);
  const [denotifications, setdeNotifications] = useState<any>([]);

  // const provider=useProvider
  const [externalWallet, showExternalWallet] = useState<Boolean>(false);
  async function send(amount: number) {
    try {
      const hash = await user.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: user.user?.address,
            gasPrice: 0,
            to: "0xFeb66e936438bC2fD2c1922808F6b90fd8b646c8",
            value: amount * 10 ** 18,
          },
        ],
      });
      toastss(hash.toString());
    } catch (e) {
      // console.log(e);
      toastss(e.toString());
    }
  }

  async function Stimulate() {
    await call();
  }

  async function getNotification() {
    const notification: Notification[] = await PushAPI.user.getFeeds({
      user: `eip155:5:${user.user?.address}`, // user address in CAIP
      env: "staging",
      // spam: true,
    });
    setNotifications(notification);
    console.log(notification);
  }
  async function getdeNotification() {
    const notification: Notification[] = await PushAPI.user.getFeeds({
      user: `eip155:5:${user.user?.address}`, // user address in CAIP
      env: "staging",
      // spam: true,
    });
    setdeNotifications(notification);
    console.log(notification);
  }
  useEffect(() => {
    if (user.user?.address) {
      const a = getSubscriptions(user.user?.address || "");
      // for (let i = 0; i < a.length; i++) {
      //   console.log(channelData(a[i].channel));
      // }
      getNotification();
    }
  }, [user.isLoggedIn]);

  const Reload = async () => {
    await getNotification();
    console.log("reload");
  };
  async function Notify() {
    try {
      const ApiResponse = await PushAPI.payloads.sendNotification({
        signer: user,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `[SDK-TEST] notification TITLE:`,
          body: `[sdk-test] notification BODY`,
        },
        payload: {
          title: `[sdk-test] payload title`,
          body: `sample msg body`,
          cta: "",
          img: "",
        },
        recipients: "eip155:5:0xFeb66e936438bC2fD2c1922808F6b90fd8b646c8", // recipient address
        channel: "eip155:5:0xFeb66e936438bC2fD2c1922808F6b90fd8b646c8", // your channel address
        env: "staging",
      });
      console.log(ApiResponse);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      {user.isLoggedIn ? (
        <div className="overflow-x-hidden">
          <ToastContainer />
          <div className="flex justify-between m-10 ">
            <h1>{user.user?.email}</h1>

            <button
              className="p-3 rounded-md bg-gray-500/30 text-white"
              onClick={() => send()}
            >
              Logout
            </button>
            {/* <button
              className="p-3 rounded-md bg-gray-500/30 text-white"
              onClick={() => Notify()}
            >
              Send Notification
            </button> */}
          </div>
          <h3 className="text-center font-bold text-xl">Subcribed Groups</h3>
          <div className="flex flex-col w-screen items-center  space-y-5 justify-center">
            <button
              onClick={() => Reload()}
              className="w-20 p-2 mt-5 bg-white/50 rounded-md"
            >
              Reload
            </button>
            {notifications.map((notification: any, i: any) => (
              <NotificationCard
                key={i}
                notification={notification}
                send={send}
              />
            ))}
          </div>
          <h3 className="text-center font-bold text-xl">
            NON Subcribed Groups
          </h3>
          <div className="flex flex-col w-screen items-center  space-y-5 justify-center">
            {denotifications.length == 0 ? (
              <div> You Donot have any Notifications</div>
            ) : (
              denotifications.map((notification: any, i: any) => (
                <NotificationCard
                  key={i}
                  notification={notification}
                  send={send}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div>
          <Auth
            externalWallet={false}
            onLogin={() => console.log(false)}
            theme={"dark"}
          />
        </div>
      )}
    </div>
  );
}
