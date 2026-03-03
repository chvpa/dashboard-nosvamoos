import { NextRequest, NextResponse } from "next/server";

const BOTMAKER_MESSAGES_URL = "https://api.botmaker.com/v2.0/messages";
const ALLOWED_PARAMS = [
  "from",
  "to",
  "chat-id",
  "channel-id",
  "contact-id",
  "long-term-search",
  "limit",
] as const;

export async function GET(request: NextRequest) {
  const token = process.env.BOTMAKER_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "BOTMAKER_ACCESS_TOKEN is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const nextPageEncoded = searchParams.get("nextPage");

  const url = nextPageEncoded
    ? decodeURIComponent(nextPageEncoded)
    : (() => {
        const upstreamUrl = new URL(BOTMAKER_MESSAGES_URL);
        for (const key of ALLOWED_PARAMS) {
          const value = searchParams.get(key);
          if (value != null && value !== "") {
            upstreamUrl.searchParams.set(key, value);
          }
        }
        return upstreamUrl.toString();
      })();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "access-token": token,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Botmaker API error: ${res.status}`, details: text },
        { status: res.status >= 500 ? 502 : res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch messages", details: message },
      { status: 502 },
    );
  }
}
