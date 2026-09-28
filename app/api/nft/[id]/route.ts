import { NextResponse } from "next/server";
import {
  createPublicClient,
  http,
} from "viem";
import { base } from "viem/chains";

import { CHROMIQ_CONTRACT } from "@/src/config";
import { chromiqAbi } from "@/src/abi";

const client = createPublicClient({
  chain: base,
  transport: http(
    "https://mainnet.base.org"
  ),
});

function decodeMetadata(uri: string) {
  if (!uri.startsWith("data:application/json;base64,")) {
    throw new Error("Invalid metadata URI");
  }

  const encoded = uri.split("base64,")[1];

  if (!encoded) {
    throw new Error("Missing metadata");
  }

  return JSON.parse(
    Buffer.from(
      encoded,
      "base64"
    ).toString("utf8")
  );
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const tokenId = BigInt(id);

      if (
  tokenId < BigInt(1) ||
  tokenId > BigInt(10000)
) {
      return NextResponse.json(
        {
          error: "Invalid token ID",
        },
        { status: 400 }
      );
    }

    const uri =
      await client.readContract({
        address: CHROMIQ_CONTRACT,
        abi: chromiqAbi,
        functionName: "tokenURI",
        args: [tokenId],
      });

    const owner =
      await client.readContract({
        address: CHROMIQ_CONTRACT,
        abi: chromiqAbi,
        functionName: "ownerOf",
        args: [tokenId],
      });

    const metadata =
      decodeMetadata(uri);

    return NextResponse.json({
      tokenId: Number(tokenId),
      image: metadata.image,
      name: metadata.name,
      description:
        metadata.description,
      attributes:
        metadata.attributes || [],
      owner,
    });
  } catch (error) {
    console.error(
      "NFT API error:",
      error
    );

    return NextResponse.json(
      {
        error: "NFT not found",
      },
      { status: 404 }
    );
  }
}
