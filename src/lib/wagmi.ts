"use client";

import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId =
  "7ba7589532eefda5ed728e315e6410f9";

export const wagmiConfig = createConfig({
  chains: [base],

  connectors: [
    injected({
      shimDisconnect: true,
    }),

    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],

  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },

  ssr: true,
});
