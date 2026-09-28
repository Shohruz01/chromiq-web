"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  WagmiProvider,
} from "wagmi";

import {
  ReactNode,
  useState,
} from "react";

import {
  wagmiConfig,
} from "../src/lib/wagmi";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] =
    useState(
      () => new QueryClient()
    );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider
        client={queryClient}
      >
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
