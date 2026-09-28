"use client";

import { useEffect, useState } from "react";
import {
  createPublicClient,
  http,
} from "viem";
import { base } from "viem/chains";

import { CHROMIQ_CONTRACT } from "@/src/config";
import { chromiqAbi } from "@/src/abi";

type NFT = {
  tokenId: number;
  image: string;
  owner: string;
  minted: boolean;
};

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

function shorten(address: string) {
  if (!address) return "Unknown";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function decodeMetadata(uri: string) {
  const encoded = uri.split("base64,")[1];

  if (!encoded) {
    throw new Error("Invalid metadata URI");
  }

  const json = atob(encoded);

  return JSON.parse(json);
}

export default function TopSales() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        setLoading(true);
        setError("");

        const loaded: NFT[] = [];

        for (let tokenId = 1; tokenId <= 8; tokenId++) {
          if (cancelled) return;

          try {
            const uri =
              await client.readContract({
                address: CHROMIQ_CONTRACT,
                abi: chromiqAbi,
                functionName:
                  "previewTokenURI",
                args: [BigInt(tokenId)],
              });

            const metadata =
              decodeMetadata(uri);

            let owner = "";
            let minted = false;

            try {
              owner =
                await client.readContract({
                  address:
                    CHROMIQ_CONTRACT,
                  abi: chromiqAbi,
                  functionName: "ownerOf",
                  args: [BigInt(tokenId)],
                });

              minted = true;
            } catch {
              owner = "";
              minted = false;
            }

            loaded.push({
              tokenId,
              image: metadata.image,
              owner,
              minted,
            });

            if (!cancelled) {
              setNfts([...loaded]);
            }
          } catch (err) {
            console.error(
              `NFT #${tokenId} error:`,
              err
            );
          }
        }
      } catch (err) {
        console.error(
          "Featured NFTs error:",
          err
        );

        if (!cancelled) {
          setError(
            "Could not load Chromiq NFTs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-24">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Collection
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            Featured Chromiq
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Explore Chromiq while the collection grows
          </p>
        </div>

        <a
          href="https://opensea.io/collection/chromiq"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-white/50 transition hover:text-white"
        >
          View on OpenSea →
        </a>
      </div>

      {loading && nfts.length === 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                <div className="aspect-square animate-pulse bg-white/[0.06]" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-7 w-1/2 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                </div>
              </div>
            )
          )}
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-sm text-white/50">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:border-white/40"
          >
            Refresh
          </button>
        </div>
      )}

      {nfts.length > 0 && !error && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {nfts.map((nft, index) => (
            <article
              key={nft.tokenId}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-white/25"
            >
              <a
                href={`https://opensea.io/item/base/${CHROMIQ_CONTRACT}/${nft.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    src={nft.image}
                    alt={`Chromiq #${nft.tokenId}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    #{index + 1}
                  </div>

                  <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    #{nft.tokenId}
                  </div>
                </div>
              </a>

              <div className="p-4">
                <h3 className="font-bold">
                  Chromiq #{nft.tokenId}
                </h3>

                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-white/70">
                    {nft.minted
                      ? "Minted"
                      : "Not minted yet"}
                  </p>

                  {nft.minted && (
                    <a
                      href={`https://basescan.org/address/${nft.owner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block truncate font-mono text-xs text-white/40 transition hover:text-white"
                    >
                      {shorten(nft.owner)}
                    </a>
                  )}
                </div>

                <a
                  href={`https://opensea.io/item/base/${CHROMIQ_CONTRACT}/${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block rounded-full border border-white/10 py-2.5 text-center text-xs font-bold text-white/60 transition hover:border-white/25 hover:text-white"
                >
                  View NFT →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
