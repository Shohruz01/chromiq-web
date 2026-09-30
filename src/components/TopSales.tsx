"use client";

import { useEffect, useState } from "react";

type Sale = {
  tokenId: number;
  name: string;
  image: string;
  price: number;
  symbol: string;
  seller: string;
  buyer: string;
  transaction: string;
  timestamp: number;
  openseaUrl: string;
  basescanUrl: string;
};

type SalesResponse = {
  contract: string;
  chain: string;
  collection: string;
  count: number;
  sales: Sale[];
  source: string;
};

function formatPrice(price: number, symbol: string) {
  if (price < 0.001) {
    return `${price.toFixed(6)} ${symbol}`;
  }

  if (price < 0.01) {
    return `${price.toFixed(4)} ${symbol}`;
  }

  return `${price.toFixed(3)} ${symbol}`;
}

function formatDate(timestamp: number) {
  if (!timestamp) return "";

  return new Date(timestamp * 1000).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function shortenAddress(address: string) {
  if (!address) return "";

  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function TopSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSales() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/top-sales.json", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Could not load sales (${response.status})`
          );
        }

        const data: SalesResponse =
          await response.json();

        if (!Array.isArray(data.sales)) {
          throw new Error(
            "Invalid top-sales.json format."
          );
        }

        setSales(data.sales);
      } catch (err) {
        console.error("Top Sales error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Could not load top sales."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  if (loading) {
    return (
      <section className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Top Sales
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Loading highest Chromiq sales...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="aspect-square animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-700">
            Top Sales
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (sales.length === 0) {
    return (
      <section className="w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <h2 className="text-xl font-semibold">
            Top Sales
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            No sales found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Top Sales
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Highest real Chromiq NFT sales
          </p>
        </div>

        <div className="text-xs text-gray-400">
          OpenSea
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sales.map((sale, index) => (
          <article
            key={`${sale.tokenId}-${sale.transaction}-${index}`}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {sale.image ? (
                <img
                  src={sale.image}
                  alt={sale.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  loading={
                    index < 4
                      ? "eager"
                      : "lazy"
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}

              <div className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                #{index + 1}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {sale.name}
                </h3>

                <span className="shrink-0 text-xs text-gray-400">
                  #{sale.tokenId}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Sale Price
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatPrice(
                    sale.price,
                    sale.symbol
                  )}
                </p>
              </div>

              {sale.seller && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400">
                    Seller
                  </p>

                  {sale.basescanUrl ? (
                    <a
                      href={sale.basescanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 hover:underline"
                    >
                      {shortenAddress(
                        sale.seller
                      )}
                    </a>
                  ) : (
                    <p className="text-xs text-gray-600">
                      {shortenAddress(
                        sale.seller
                      )}
                    </p>
                  )}
                </div>
              )}

              {sale.timestamp > 0 && (
                <p className="mt-3 text-xs text-gray-400">
                  {formatDate(sale.timestamp)}
                </p>
              )}

              <div className="mt-4">
                <a
                  href={sale.openseaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl bg-black px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  View on OpenSea
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
