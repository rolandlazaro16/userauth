import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'gi1ruooj',
  api_key: process.env.CLOUDINARY_API_KEY || '897293394664828',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'i_T80dy8F89u0k1akt_sNyaZ0sM',
});

export default cloudinary;
