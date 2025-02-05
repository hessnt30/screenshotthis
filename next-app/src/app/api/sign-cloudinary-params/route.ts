import { v2 as cloudinary } from "cloudinary";

const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: apiSecret,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  if (apiSecret) {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return Response.json({ signature });
  }

  return Response.json({ signature: "fail" });
}
