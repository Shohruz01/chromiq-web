import { NextResponse } from "next/server";

const OPENSEA_API =
  "https://api.opensea.io/api/v2/events/collection";

const COLLECTION_SLUG =
  process.env.OPENSEA_SLUG || "chromiq";

export async function GET() {
  try {
    const apiKey = process.env.OPENSEA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        sales: [],
        count: 0,
      });
    }

    const url =
      `${OPENSEA_API}/${COLLECTION_SLUG}` +
      "?event_type=sale&limit=200";

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({
        sales: [],
        count: 0,
      });
    }

    const data = await response.json();

    const events = data.asset_events || [];

    const sales = events
      .filter(
        (event: any) =>
          event.event_type === "sale"
      )
      .map((event: any) => {
        const payment = event.payment || {};

        const quantity = BigInt(
          payment.quantity || "0"
        );

        const decimals = Number(
          payment.decimals ?? 18
        );

        const price =
          Number(quantity) /
          10 ** decimals;

        return {
          tokenId: Number(
            event.nft?.identifier ??
              event.identifier
          ),
          price,
          priceDisplay:
            `${price.toFixed(4)} ${
              payment.symbol || "ETH"
            }`,
          transaction:
            event.transaction ||
            event.transaction_hash ||
            "",
        };
      })
      .filter(
        (sale: any) =>
          sale.tokenId >= 1 &&
          sale.tokenId <= 10000 &&
          sale.price > 0
      )
      .sort(
        (a: any, b: any) =>
          b.price - a.price
      )
      .slice(0, 8);

    return NextResponse.json({
      sales,
      count: sales.length,
    });
  } catch (error) {
    console.error(
      "Top sales API error:",
      error
    );

    return NextResponse.json({
      sales: [],
      count: 0,
    });
  }
}
