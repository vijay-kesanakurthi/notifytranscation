import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider, CHAIN } from "@arcana/auth";
import { ProvideAuth } from "@arcana/auth-react";
import { useEffect } from "react";

interface ChainConfig {
  chainId: CHAIN;
  rpcUrl?: string;
}

const appId: String = "3fa3f10e1db3bb53d2935a14362690842b1174de";
let provider: AuthProvider;
try {
  provider = new AuthProvider(`${appId}`, {
    position: "right",
    theme: "dark",
    alwaysVisible: true,
    chainConfig: {
      chainId: CHAIN.ETHEREUM_GOERLI,
      rpcUrl:
        "https://goerli.infura.io/v3/3fa3f10e1db3bb53d2935a14362690842b1174de",
    },
  });
} catch (e) {
  console.log(e);
}
let prov: AuthProvider;
export default function App({ Component, pageProps }: AppProps) {
  async function calll() {
    try {
      // const res = await prov.getPublicKey("dirot99239@otanhome.com");
      const res = await prov.getPublicKey("sigeke5630@otaome.com");
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  }
  async function call() {
    prov = await provider.init();

    // prov = await provider.connect();
    console.log("init");
  }
  useEffect(() => {
    call();
  }, []);
  return (
    <ProvideAuth provider={provider}>
      <Component {...pageProps} call={calll} />
    </ProvideAuth>
  );
}
