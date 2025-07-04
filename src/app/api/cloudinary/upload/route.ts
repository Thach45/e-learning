import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Không có file nào được gửi' }, { status: 400 });
    }

    // Convert File object to base64
    const bytes = await (file as File).arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${(file as File).type};base64,${buffer.toString('base64')}`;

    console.log('Uploading file type:', (file as File).type);

    // Determine folder and configuration based on file type
    const isImage = (file as File).type.startsWith('image/');
    const subfolder = isImage ? 'img' : 'file';

    const uploadConfig = {
      folder: `e-learnhub/${subfolder}`,
      resource_type: 'auto' as const, // Use 'auto' for both images and PDFs
      access_mode: 'public',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      type: 'upload',
      flags: 'attachment'
    };

    const uploadResponse = await cloudinary.v2.uploader.upload(fileBase64, uploadConfig);

    console.log('Cloudinary response:', uploadResponse);

    const fileUrl = uploadResponse.secure_url;
    console.log('File URL:', fileUrl);

    return NextResponse.json({ 
      url: fileUrl,
      public_id: uploadResponse.public_id,
      resource_type: uploadResponse.resource_type,
      format: uploadResponse.format
    });
  } catch (error) {
    console.error('Upload error details:', error);
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message,
        details: JSON.stringify(error, null, 2)
      }, { status: 500 });
    } else {
      return NextResponse.json({ 
        error: 'An unknown error occurred',
        details: JSON.stringify(error, null, 2)
      }, { status: 500 });
    }
  }
}
