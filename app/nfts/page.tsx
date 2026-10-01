import type { Metadata } from "next";

const SITE_URL = "https://chromiq.site";
const CONTRACT =
  "0xe856f07701f8dc39Ee6B468F57cF190B6319372E";

const nftIds = Array.from({ length: 20 }, (_, i) => i + 1);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Chromiq NFTs — Fully On-Chain Animated Generative NFTs",

  description:
    "Explore Chromiq, a 10,000-piece fully on-chain animated generative NFT collection built on Base. Discover the collection, its on-chain technology, and selected Chromiq artworks.",

  keywords: [
    "Chromiq",
    "Chromiq NFTs",
    "fully on-chain NFTs",
    "on-chain animated NFTs",
    "generative NFTs",
    "Base NFTs",
    "Base NFT collection",
    "10,000 NFTs",
  ],

  alternates: {
    canonical: "/nfts/",
  },

  openGraph: {
    type: "website",
    url: `${SITE_URL}/nfts/`,
    siteName: "Chromiq",
    title: "Chromiq NFTs — Fully On-Chain Animated Generative NFTs",
    description:
      "Explore Chromiq, a 10,000-piece fully on-chain animated generative NFT collection built on Base.",
    images: [
      {
        url: `${SITE_URL}/nfts/1.svg`,
        width: 1200,
        height: 1200,
        alt: "Chromiq fully on-chain animated generative NFT",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Chromiq NFTs — Fully On-Chain Animated Generative NFTs",
    description:
      "Explore Chromiq, a 10,000-piece fully on-chain animated generative NFT collection built on Base.",
    images: [`${SITE_URL}/nfts/1.svg`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Chromiq NFTs",
  url: `${SITE_URL}/nfts/`,
  description:
    "Chromiq is a 10,000-piece fully on-chain animated generative NFT collection built on Base.",
  isPartOf: {
    "@type": "WebSite",
    name: "Chromiq",
    url: SITE_URL,
  },
  about: {
    "@type": "Thing",
    name: "Chromiq NFT Collection",
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Selected Chromiq NFTs",
    numberOfItems: nftIds.length,
    itemListElement: nftIds.map((id, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Chromiq #${id}`,
      url: `${SITE_URL}/nfts/#chromiq-${id}`,
      image: `${SITE_URL}/nfts/${id}.svg`,
    })),
  },
};

export default function NFTsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <a
                href="/"
                className="text-xl font-black tracking-[0.25em] transition hover:text-white/70"
              >
                CHROMIQ
              </a>

              <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-white/40">
                Fully On-Chain Animated NFTs
              </p>
            </div>

            <nav className="flex flex-wrap gap-3">
              <a
                href="/"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
              >
                Home
              </a>

              <a
                href="https://opensea.io/collection/chromiq"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                OpenSea ↗
              </a>
            </nav>
          </div>
        </header>

        <section className="py-20">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              Base · Fully On-Chain · Generative
            </div>

            <h1 className="text-5xl font-black tracking-[-0.05em] sm:text-7xl">
              Chromiq NFTs
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/55">
              Chromiq is a 10,000-piece fully on-chain animated generative NFT
              collection built on Base. The collection is designed around
              generative artwork and on-chain metadata, with the artwork and
              metadata generated directly by the Chromiq smart contract.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Supply
                </div>
                <div className="mt-2 text-2xl font-bold">10,000</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Network
                </div>
                <div className="mt-2 text-2xl font-bold">Base</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Standard
                </div>
                <div className="mt-2 text-2xl font-bold">ERC-721</div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="gallery-title" className="pb-20">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/35">
              Selected artworks
            </p>

            <h2
              id="gallery-title"
              className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
            >
              Explore Chromiq
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
              A selection of Chromiq artworks from the collection.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {nftIds.map((id) => (
              <article
                key={id}
                id={`chromiq-${id}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                <div className="aspect-square overflow-hidden bg-white/[0.02]">
                  <img
                    src={`/nfts/${id}.svg`}
                    alt={`Chromiq #${id} fully on-chain animated generative NFT`}
                    loading={id <= 5 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold">Chromiq #{id}</h3>

                  <p className="mt-1 text-xs text-white/35">
                    Fully on-chain · Base
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/35">
                About the collection
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Built on-chain
              </h2>
            </div>

            <div className="space-y-5 text-sm leading-7 text-white/50">
              <p>
                Chromiq is a generative NFT collection created for the Base
                blockchain. The collection contains 10,000 NFTs and focuses on
                animated, generative artwork.
              </p>

              <p>
                Chromiq uses on-chain generation so that the collection&apos;s
                artwork and metadata are generated directly by the smart
                contract rather than relying exclusively on a traditional
                centralized NFT metadata server.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                  Contract
                </div>

                <a
                  href={`https://basescan.org/address/${CONTRACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block break-all font-mono text-xs text-white/70 transition hover:text-white"
                >
                  {CONTRACT} ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8">
          <div className="flex flex-col gap-3 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <span>CHROMIQ © 2026</span>

            <span>Base · Fully On-Chain</span>

            <span className="break-all">
              Contract · {CONTRACT}
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
