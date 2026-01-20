import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // You may want to add authentication here
    const { isIframe, vendor_data } = await request.json();

    const url = `${process.env.NEXT_DIDIT_VERIFICATION_BASE_URL}/v3/session/`;

    const body: {
      workflow_id: string;
      vendor_data: string;
      callback?: string;
    } = {
      workflow_id: process.env.NEXT_PUBLIC_DIDIT_VERIFICATION_WORKFLOW_ID ?? "",
      vendor_data: vendor_data ?? "",
    };

    if (!isIframe) {
      body.callback = process.env.NEXT_PUBLIC_DIDIT_VERIFICATION_CALLBACK_URL;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": `${process.env.DIDTIT_API_KEY}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.status === 201 && data) {
      return NextResponse.json(data);
    } else {
      const errorMessage =
        data.message || data.error || data.detail || JSON.stringify(data);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
