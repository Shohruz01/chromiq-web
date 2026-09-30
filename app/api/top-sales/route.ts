import { NextResponse } from "next/server";

const OPENSEA_API = "https://api.opensea.io/api/v2";

const CHROMIQ_CONTRACT =
  "0xe856f07701f8dc39Ee6B468F57cF190B6319372E";

const CHAIN = "base";

type OpenSeaAsset = {
  identifier?: string;
  collection?: string;
  contract?: string;
  name?: string;
  image_url?: string;
  display_image_url?: string;
  original_image_url?: string;
  opensea_url?: string;
};

type OpenSeaPayment = {
  quantity?: string;
  decimals?: number;
  symbol?: string;
  token_address?: string;
};

type OpenSeaEvent = {
  event_type?: string;
  event_timestamp?: number;
  transaction?: string;
  maker?: string;
  taker?: string | null;

  payment?: OpenSeaPayment;

  asset?: OpenSeaAsset | null;
  nft?: OpenSeaAsset | null;
};

function getAsset(event: OpenSeaEvent) {
  return event.asset ?? event.nft ?? null;
}

function getPrice(payment?: OpenSeaPayment) {
  if (!payment?.quantity) return 0;

  try {
    const quantity = BigInt(payment.quantity);
    const decimals = payment.decimals ?? 18;

    return Number(quantity) / 10 ** decimals;
  } catch {
    return 0;
  }
}

async function openSeaFetch(
  url: string,
  apiKey: string
) {
  const response = await fetch(url, {
    method: "GET",

    headers: {
      accept: "application/json",
      "x-api-key": apiKey,
    },

    cache: "no-store",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `OpenSea ${response.status}: ${text}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `OpenSea returned invalid JSON: ${text}`
    );
  }
}

async function getCollectionSlug(
  apiKey: string
) {
  const url =
    `${OPENSEA_API}/chain/${CHAIN}` +
    `/contract/${CHROMIQ_CONTRACT}` +
    `/nfts/1/collection`;

  const data = await openSeaFetch(
    url,
    apiKey
  );

  if (!data.collection) {
    throw new Error(
      "OpenSea collection slug not found."
    );
  }

  return data.collection as string;
}

export async function GET() {
  try {
    const apiKey =
      process.env.OPENSEA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENSEA_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    /*
     * Find the real OpenSea collection slug.
     */
    const collectionSlug =
      await getCollectionSlug(apiKey);

    const sales: OpenSeaEvent[] = [];

    let next: string | null = null;

    /*
     * OpenSea allows up to 200 events per page.
     *
     * We keep following the cursor so old sales
     * are not missed just because they are not recent.
     */
    const MAX_PAGES = 100;

    let pagesFetched = 0;
    let rawEvents = 0;
    let matchingEvents = 0;

    for (
      let page = 0;
      page < MAX_PAGES;
      page++
    ) {
      const params =
        new URLSearchParams();

      params.set(
        "event_type",
        "sale"
      );

      params.set(
        "limit",
        "200"
      );

      if (next) {
        params.set(
          "next",
          next
        );
      }

      const url =
        `${OPENSEA_API}/events/collection/` +
        `${encodeURIComponent(collectionSlug)}` +
        `?${params.toString()}`;

      const data =
        await openSeaFetch(
          url,
          apiKey
        );

      pagesFetched++;

      const events =
        Array.isArray(
          data.asset_events
        )
          ? data.asset_events
          : [];

      rawEvents += events.length;

      for (const event of events) {
        if (
          event.event_type !==
          "sale"
        ) {
          continue;
        }

        const asset =
          getAsset(event);

        if (!asset) {
          continue;
        }

        const contract =
          asset.contract?.toLowerCase();

        /*
         * Only accept Chromiq NFTs.
         */
        if (
          contract !==
          CHROMIQ_CONTRACT.toLowerCase()
        ) {
          continue;
        }

        /*
         * Some OpenSea responses identify the
         * collection on the asset itself.
         *
         * If it exists, make sure it matches.
         */
        if (
          asset.collection &&
          asset.collection !==
            collectionSlug
        ) {
          continue;
        }

        matchingEvents++;

        sales.push({
          ...event,
          asset,
        });
      }

      next =
        data.next ||
        null;

      if (
        !next ||
        events.length === 0
      ) {
        break;
      }
    }

    /*
     * Convert events to our frontend format.
     */
    const formatted = sales
      .map((sale) => {
        const asset =
          getAsset(sale);

        if (
          !asset?.identifier
        ) {
          return null;
        }

        const tokenId =
          Number(
            asset.identifier
          );

        if (
          !Number.isFinite(
            tokenId
          )
        ) {
          return null;
        }

        const price =
          getPrice(
            sale.payment
          );

        if (
          !Number.isFinite(
            price
          ) ||
          price <= 0
        ) {
          return null;
        }

        return {
          tokenId,

          name:
            asset.name ||
            `Chromiq #${tokenId}`,

          image:
            asset.display_image_url ||
            asset.image_url ||
            asset.original_image_url ||
            "",

          price,

          symbol:
            sale.payment?.symbol ||
            "ETH",

          seller:
            sale.maker ||
            "",

          buyer:
            sale.taker ||
            "",

          transaction:
            sale.transaction ||
            "",

          timestamp:
            sale.event_timestamp ||
            0,

          openseaUrl:
            asset.opensea_url ||
            `https://opensea.io/item/base/${CHROMIQ_CONTRACT}/${tokenId}`,

          basescanUrl:
            sale.transaction
              ? `https://basescan.org/tx/${sale.transaction}`
              : "",
        };
      })
      .filter(
        (
          sale
        ): sale is NonNullable<
          typeof sale
        > =>
          sale !== null
      );

    /*
     * If the same NFT sold multiple times,
     * keep its highest real sale.
     */
    const highestSale =
      new Map<
        number,
        (typeof formatted)[number]
      >();

    for (const sale of formatted) {
      const previous =
        highestSale.get(
          sale.tokenId
        );

      if (
        !previous ||
        sale.price >
          previous.price
      ) {
        highestSale.set(
          sale.tokenId,
          sale
        );
      }
    }

    /*
     * Highest real historical sales first.
     */
    const topSales =
      Array.from(
        highestSale.values()
      )
        .sort(
          (a, b) =>
            b.price - a.price
        )
        .slice(0, 8);

    return NextResponse.json({
      contract:
        CHROMIQ_CONTRACT,

      chain:
        CHAIN,

      collection:
        collectionSlug,

      sales:
        topSales,

      count:
        topSales.length,

      debug: {
        pagesFetched,
        rawEvents,
        matchingEvents,
        formattedSales:
          formatted.length,
      },

      source:
        "OpenSea sale events",
    });
  } catch (error) {
    console.error(
      "Top Sales API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not load OpenSea sales.",
      },
      { status: 500 }
    );
  }
}
