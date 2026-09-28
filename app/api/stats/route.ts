import { NextResponse } from "next/server";
import { createPublicClient, formatEther, http } from "viem";
import { base } from "viem/chains";

import { CHROMIQ_CONTRACT } from "@/src/config";
import { chromiqAbi } from "@/src/abi";

const client = createPublicClient({
  chain: base,
  transport: http(
    "https://mainnet.base.org"
  ),
});

export async function GET() {
  try {
    const [totalMinted, mintPrice, mintOpen] =
      await Promise.all([
        client.readContract({
          address: CHROMIQ_CONTRACT,
          abi: chromiqAbi,
          functionName: "totalMinted",
        }),

        client.readContract({
          address: CHROMIQ_CONTRACT,
          abi: chromiqAbi,
          functionName: "mintPrice",
        }),

        client.readContract({
          address: CHROMIQ_CONTRACT,
          abi: chromiqAbi,
          functionName: "mintOpen",
        }),
      ]);

    return NextResponse.json({
      totalMinted: Number(totalMinted),
      mintPrice: `${formatEther(mintPrice)} ETH`,
      mintOpen,
    });
  } catch (error) {
    console.error("Stats API error:", error);

    return NextResponse.json(
      {
        error: "Could not load stats",
      },
      { status: 500 }
    );
  }
}
