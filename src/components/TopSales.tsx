"use client";

import { useEffect, useState } from "react";

type Sale = {
  tokenId: number;
  price: number;
  priceDisplay: string;
  transaction: string;
};

type NFT = {
  tokenId: number;
  image: string;
  owner: string;
  price: number;
  priceDisplay: string;
  transaction: string;
};

const CONTRACT =
  "0xe856f07701f8dc39Ee6B468F57cF190B6319372E";

function shorten(address: string) {
  if (!address) return "Unknown";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function TopSales() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [hasSales, setHasSales] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNFTs() {
      try {
        setLoading(true);
        setError("");

        const salesResponse = await fetch(
          "/api/top-sales",
          {
            cache: "no-store",
          }
        );

        const salesData =
          await salesResponse.json();

        if (!salesResponse.ok) {
          throw new Error(
            salesData.error ||
              "Could not load sales"
          );
        }

        const sales: Sale[] =
          salesData.sales || [];

        // Агар sale ҳаст → Top 8 Sales
        // Агар sale нест → NFT #1 - #8
        const selected: Sale[] =
          sales.length > 0
            ? sales
            : Array.from(
                { length: 8 },
                (_, index) => ({
                  tokenId: index + 1,
                  price: 0,
                  priceDisplay: "Featured",
                  transaction: "",
                })
              );

        if (!cancelled) {
          setHasSales(sales.length > 0);
        }

        const loaded: NFT[] = [];

        for (const item of selected) {
          if (cancelled) return;

          try {
            const response = await fetch(
              `/api/nft/${item.tokenId}`,
              {
                cache: "no-store",
              }
            );

            if (!response.ok) {
              continue;
            }

            const nftData =
              await response.json();

            loaded.push({
              tokenId: item.tokenId,
              image: nftData.image,
              owner: nftData.owner,
              price: item.price,
              priceDisplay:
                item.priceDisplay,
              transaction:
                item.transaction,
            });

            if (!cancelled) {
              setNfts([...loaded]);
            }
          } catch (err) {
            console.error(
              `NFT #${item.tokenId} error:`,
              err
            );
          }
        }
      } catch (err) {
        console.error(
          "NFT loading error:",
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

    loadNFTs();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-24">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {hasSales
              ? "Marketplace"
              : "Collection"}
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            {hasSales
              ? "Top 8 Sales"
              : "Featured Chromiq"}
          </h2>

          <p className="mt-2 text-sm text-white/40">
            {hasSales
              ? "Highest recorded Chromiq sales"
              : "Explore Chromiq while the collection grows"}
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
                href={`https://opensea.io/item/base/${CONTRACT}/${nft.tokenId}`}
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
                </div>
              </a>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-bold">
                    Chromiq #{nft.tokenId}
                  </h3>

                  <span className="shrink-0 text-xs text-white/30">
                    #{nft.tokenId}
                  </span>
                </div>

                {hasSales ? (
                  <>
                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Sale price
                      </p>

                      <p className="mt-1 text-xl font-black">
                        {nft.priceDisplay}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Current owner
                      </p>

                      <a
                        href={`https://basescan.org/address/${nft.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block truncate font-mono text-xs text-white/50 transition hover:text-white"
                      >
                        {shorten(nft.owner)}
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-bold text-white/70">
                      Featured
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      No sale recorded yet
                    </p>
                  </div>
                )}

                <a
                  href={`https://opensea.io/item/base/${CONTRACT}/${nft.tokenId}`}
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
