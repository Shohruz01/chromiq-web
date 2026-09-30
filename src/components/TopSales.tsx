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
};

function shorten(address: string) {
if (!address) return "Unknown";

return "${address.slice(0, 6)}...${address.slice(-4)}";
}

function formatPrice(price: number, symbol: string) {
if (price === 0) return "0 ${symbol}";

return "${price.toLocaleString(undefined, { maximumFractionDigits: 6, })} ${symbol}";
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

export default function TopSales() {
const [sales, setSales] = useState<Sale[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function loadSales() {
try {
setLoading(true);
setError("");

  const response = await fetch(
    "/api/top-sales",
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Could not load sales."
    );
  }

  setSales(data.sales || []);
} catch (error) {
  console.error("Top sales error:", error);

  setError(
    "Could not load real OpenSea sales."
  );
} finally {
  setLoading(false);
}

}

useEffect(() => {
loadSales();
}, []);

return (
<section className="mt-24">
<div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
<div>
<p className="text-xs uppercase tracking-[0.3em] text-white/40">
Marketplace
</p>

      <h2 className="mt-2 text-4xl font-black tracking-tight">
        Top Sales
      </h2>

      <p className="mt-2 text-sm text-white/40">
        Highest recorded Chromiq sales on OpenSea
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

  {loading && (
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

  {!loading && error && (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <p className="text-sm text-white/50">
        {error}
      </p>

      <button
        type="button"
        onClick={loadSales}
        className="mt-5 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:border-white/40"
      >
        Try again
      </button>
    </div>
  )}

  {!loading &&
    !error &&
    sales.length === 0 && (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-sm text-white/50">
          No OpenSea sales found yet.
        </p>
      </div>
    )}

  {!loading &&
    !error &&
    sales.length > 0 && (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {sales.map((sale, index) => (
          <article
            key={`${sale.tokenId}-${sale.transaction}`}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-white/25"
          >
            <a
              href={sale.openseaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-square overflow-hidden bg-black">
                {sale.image ? (
                  <img
                    src={sale.image}
                    alt={sale.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/30">
                    No image
                  </div>
                )}

                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
                  #{index + 1}
                </div>

                <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-bold backdrop-blur">
                  #{sale.tokenId}
                </div>
              </div>
            </a>

            <div className="p-4">
              <h3 className="truncate font-bold">
                {sale.name}
              </h3>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Sale Price
                </p>

                <p className="mt-1 text-xl font-black">
                  {formatPrice(
                    sale.price,
                    sale.symbol
                  )}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  {formatDate(
                    sale.timestamp
                  )}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Seller
                </p>

                <a
                  href={`https://basescan.org/address/${sale.seller}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate font-mono text-xs text-white/40 transition hover:text-white"
                >
                  {shorten(sale.seller)}
                </a>
              </div>

              <a
                href={sale.openseaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-full border border-white/10 py-2.5 text-center text-xs font-bold text-white/60 transition hover:border-white/25 hover:text-white"
              >
                View Sale →
              </a>
            </div>
          </article>
        ))}
      </div>
    )}
</section>

);
}
