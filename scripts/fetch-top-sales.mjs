const API = "https://api.opensea.io/api/v2";
const CONTRACT = "0xe856f07701f8dc39Ee6B468F57cF190B6319372E";
const COLLECTION = "chromiq";

const apiKey = process.env.OPENSEA_API_KEY;

if (!apiKey) {
  throw new Error("OPENSEA_API_KEY is missing");
}

async function fetchOpenSea(url) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`OpenSea ${response.status}: ${text}`);
  }

  return JSON.parse(text);
}

function getPrice(payment) {
  if (!payment?.quantity) return 0;

  const quantity = BigInt(payment.quantity);
  const decimals = payment.decimals ?? 18;

  return Number(quantity) / 10 ** decimals;
}

const sales = [];
let next = null;

for (let page = 0; page < 100; page++) {
  const params = new URLSearchParams();

  params.set("event_type", "sale");
  params.set("limit", "200");

  if (next) {
    params.set("next", next);
  }

  const data = await fetchOpenSea(
    `${API}/events/collection/${COLLECTION}?${params}`
  );

  const events = Array.isArray(data.asset_events)
    ? data.asset_events
    : [];

  for (const event of events) {
    if (event.event_type !== "sale") continue;

    const asset = event.asset ?? event.nft;
    if (!asset) continue;

    if (
      asset.contract?.toLowerCase() !== CONTRACT.toLowerCase()
    ) {
      continue;
    }

    const tokenId = Number(asset.identifier);
    const price = getPrice(event.payment);

    if (!Number.isFinite(tokenId) || price <= 0) {
      continue;
    }

    sales.push({
      tokenId,
      name: asset.name || `Chromiq #${tokenId}`,
      image:
        asset.display_image_url ||
        asset.image_url ||
        asset.original_image_url ||
        "",
      price,
      symbol: event.payment?.symbol || "ETH",
      seller: event.maker || "",
      buyer: event.taker || "",
      transaction: event.transaction || "",
      timestamp: event.event_timestamp || 0,
      openseaUrl:
        asset.opensea_url ||
        `https://opensea.io/item/base/${CONTRACT}/${tokenId}`,
      basescanUrl: event.transaction
        ? `https://basescan.org/tx/${event.transaction}`
        : "",
    });
  }

  next = data.next || null;

  if (!next || events.length === 0) {
    break;
  }
}

const highestSale = new Map();

for (const sale of sales) {
  const previous = highestSale.get(sale.tokenId);

  if (!previous || sale.price > previous.price) {
    highestSale.set(sale.tokenId, sale);
  }
}

const topSales = Array.from(highestSale.values())
  .sort((a, b) => b.price - a.price)
  .slice(0, 8);

await import("node:fs/promises").then((fs) =>
  fs.writeFile(
    "public/top-sales.json",
    JSON.stringify(
      {
        contract: CONTRACT,
        chain: "base",
        collection: COLLECTION,
        count: topSales.length,
        sales: topSales,
        source: "OpenSea sale events",
      },
      null,
      2
    )
  )
);

console.log(`Saved ${topSales.length} top sales.`);
