"use client";

import {
  useAccount,
  useChainId,
  useConnect,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatEther } from "viem";
import { useEffect, useState } from "react";

import {
  CHROMIQ_CONTRACT,
  BASE_CHAIN_ID,
} from "@/src/config";

import { chromiqAbi } from "@/src/abi";
import TopSales from "@/src/components/TopSales";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const {
    connectors,
    connect,
    isPending: isConnecting,
    error: connectError,
    reset: resetConnect,
  } = useConnect();

  const {
    switchChain,
    isPending: isSwitching,
    error: switchError,
  } = useSwitchChain();

  const {
    data: totalMinted,
    refetch: refetchTotalMinted,
  } = useReadContract({
    address: CHROMIQ_CONTRACT,
    abi: chromiqAbi,
    functionName: "totalMinted",
  });

  const { data: mintPrice } = useReadContract({
    address: CHROMIQ_CONTRACT,
    abi: chromiqAbi,
    functionName: "mintPrice",
  });

  const { data: mintOpen } = useReadContract({
    address: CHROMIQ_CONTRACT,
    abi: chromiqAbi,
    functionName: "mintOpen",
  });

  const {
    writeContract,
    data: hash,
    isPending: isMinting,
    error: mintError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [quantity, setQuantity] = useState(1);

  const isBase = chainId === BASE_CHAIN_ID;

  useEffect(() => {
    if (isConfirmed) {
      refetchTotalMinted();
    }
  }, [isConfirmed, refetchTotalMinted]);

  function handleConnect() {
  const connector =
    connectors.find(
      (item) => item.id === "walletConnect"
    ) ?? connectors[0];

  if (!connector) {
    console.error("No wallet connector found.");
    return;
  }

  resetConnect();

  connect(
    { connector },
    {
      onSuccess() {
        console.log("Wallet connected");
      },
      onError(error) {
        console.error(
          "Wallet connection error:",
          error
        );
      },
    }
  );
}

  function handleSwitchNetwork() {
    switchChain(
      { chainId: BASE_CHAIN_ID },
      {
        onError(error) {
          console.error(
            "Network switch error:",
            error
          );
        },
      }
    );
  }

  function handleMint() {
    if (!isConnected) {
      handleConnect();
      return;
    }

    if (!isBase) {
      handleSwitchNetwork();
      return;
    }

    if (!mintOpen) {
      alert("Mint is currently closed.");
      return;
    }

    if (mintPrice === undefined) {
      alert("Mint price is loading.");
      return;
    }

    const maxRemaining =
      10000 - Number(totalMinted ?? 0);

    if (quantity > maxRemaining) {
      alert(
        `Only ${maxRemaining} NFTs remain.`
      );
      return;
    }

    writeContract({
      address: CHROMIQ_CONTRACT,
      abi: chromiqAbi,
      functionName: "mint",
      args: [BigInt(quantity)],
      value: mintPrice * BigInt(quantity),
    });
  }

  const walletLabel = !isConnected
    ? "Connect Wallet"
    : !isBase
      ? "Switch to Base"
      : `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  const mintButtonLabel = !isConnected
    ? "Connect Wallet"
    : !isBase
      ? "Switch to Base"
      : isMinting || isConfirming
        ? "Minting..."
        : `Mint ${quantity} Chromiq`;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">

        <nav className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="text-xl font-black tracking-[0.25em]">
              CHROMIQ
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.35em] text-white/40">
              On-chain animated NFTs
            </div>
          </div>

          <button
            type="button"
            onClick={handleConnect}
            disabled={
              isConnecting ||
              isSwitching ||
              isConnected
            }
            className="rounded-full border border-white/20 bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConnecting
              ? "Connecting..."
              : isSwitching
                ? "Switching..."
                : walletLabel}
          </button>
        </nav>

        <div className="flex flex-1 items-center py-16">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">

            <div>
              <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
                Base · Fully On-Chain
              </div>

              <h1 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                ART
                <br />
                THAT
                <br />
                LIVES
                <br />
                ON-CHAIN.
              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-white/50">
                10,000 generative animated NFTs.
                Every artwork and metadata is generated
                directly by the Chromiq smart contract.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">

                <button
                  type="button"
                  onClick={handleMint}
                  disabled={
                    isMinting ||
                    isConfirming ||
                    mintOpen === false
                  }
                  className="rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {mintButtonLabel}
                </button>

                <a
                  href="/nfts/"
                  className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10 hover:scale-[1.02]"
                >
                  About Chromiq ↗
                </a>

                <div className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-3">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(1, quantity - 1)
                      )
                    }
                    disabled={
                      quantity <= 1 ||
                      isMinting ||
                      isConfirming
                    }
                    className="h-7 w-7 rounded-full bg-white/10 text-sm font-bold disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="min-w-[24px] text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(10, quantity + 1)
                      )
                    }
                    disabled={
                      quantity >= 10 ||
                      isMinting ||
                      isConfirming
                    }
                    className="h-7 w-7 rounded-full bg-white/10 text-sm font-bold disabled:opacity-30"
                  >
                    +
                  </button>

                </div>
              </div>

              {mintPrice !== undefined && (
                <p className="mt-4 text-xs text-white/35">
                  {formatEther(
                    mintPrice * BigInt(quantity)
                  )}{" "}
                  ETH + gas
                </p>
              )}

              {!isConnected && (
                <p className="mt-4 text-xs text-white/35">
                  Connect your wallet to mint on Base.
                </p>
              )}

              {isConnected && !isBase && (
                <p className="mt-4 text-xs text-yellow-400/70">
                  Please switch your wallet to Base Mainnet.
                </p>
              )}

              {connectError && (
                <div className="mt-4 max-w-xl rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-xs font-semibold text-red-300">
                    Wallet connection failed
                  </p>

                  <p className="mt-2 break-all text-xs text-red-300/70">
                    {connectError.message}
                  </p>
                </div>
              )}

              {switchError && (
                <div className="mt-4 max-w-xl rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <p className="text-xs font-semibold text-yellow-300">
                    Network switch failed
                  </p>

                  <p className="mt-2 break-all text-xs text-yellow-300/70">
                    {switchError.message}
                  </p>
                </div>
              )}

              {mintError && (
                <div className="mt-4 max-w-xl rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-xs font-semibold text-red-300">
                    Transaction failed or was rejected
                  </p>

                  <p className="mt-2 break-all text-xs text-red-300/70">
                    {mintError.message}
                  </p>
                </div>
              )}

              {hash && (
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block text-xs text-white/40"
                >
                  View transaction on BaseScan →
                </a>
              )}

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">

                <Stat
                  label="Supply"
                  value="10,000"
                />

                <Stat
                  label="Minted"
                  value={
                    totalMinted !== undefined
                      ? totalMinted.toString()
                      : "—"
                  }
                />

                <Stat
                  label="Price"
                  value={
                    mintPrice !== undefined
                      ? `${formatEther(mintPrice)} ETH`
                      : "—"
                  }
                />

              </div>
            </div>

            <div className="relative flex items-center justify-center">

              <div className="absolute h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[100px]" />

              <div className="relative aspect-square w-full max-w-[560px] overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-3 shadow-2xl">

                <div className="flex h-full items-center justify-center rounded-[30px] border border-white/10 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/10">

                  <div className="text-center">

                    <div className="text-8xl font-black tracking-[-0.08em]">
                      C
                    </div>

                    <div className="mt-4 text-xs uppercase tracking-[0.4em] text-white/40">
                      Chromiq
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

        <TopSales />

         <footer className="mt-20 border-t border-white/10 pt-6 pb-4 text-xs text-white/30">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    <span>CHROMIQ © 2026</span>

    <span>
      Base · Fully On-Chain
    </span>

    <span className="break-all">
      Contract · {CHROMIQ_CONTRACT}
    </span>

  </div>
</footer>

      </section>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
        {label}
      </div>

      <div className="mt-2 text-lg font-bold">
        {value}
      </div>
    </div>
  );
}
