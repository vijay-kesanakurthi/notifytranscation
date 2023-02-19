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

export default function Home({ call }: any) {
  // const auth = provider;
  const user = useAuth();
  const toastss = (msg: String) => toast(msg);
  const [notifications, setNotifications] = useState<any>([]);
  // const provider=useProvider
  const [externalWallet, showExternalWallet] = useState<Boolean>(false);
  async function send() {
    try {
      const hash = await user.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: user.user?.address,
            gasPrice: 0,
            to: "0xE7dC628B2cCAe4d53e490a2565D4b2bD2c6b3f1e",
            value: 10,
          },
        ],
      });
      toastss(hash.toString());
    } catch (e) {
      console.log(e);
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
  useEffect(() => {
    if (user.user?.address) {
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
        <div>
          <ToastContainer />
          <div className="flex justify-between m-10">
            <h1>{user.user?.email}</h1>
            <button
              className="p-3 rounded-md bg-gray-500/30 text-white"
              onClick={() => send()}
            >
              Send
            </button>
            <button
              className="p-3 rounded-md bg-gray-500/30 text-white"
              onClick={() => Notify()}
            >
              Send Notification
            </button>
          </div>
          <button onClick={() => Reload()}>Reload</button>
          {notifications.map((notification: any, i: any) => (
            <NotificationCard key={i} notification={notification} />
          ))}
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
