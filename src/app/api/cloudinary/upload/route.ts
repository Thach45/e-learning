import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { file } = await req.json(); // Nhận dữ liệu Base64 từ client

    if (!file) {
      return NextResponse.json({ error: 'Không có file nào được gửi' }, { status: 400 });
    }

    const uploadResponse = await cloudinary.v2.uploader.upload(file, {
      upload_preset: 'ml_default',
      
    });

    return NextResponse.json({ 
        url: uploadResponse.secure_url ,
        public_id: uploadResponse.public_id
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
