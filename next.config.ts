import type { NextConfig } from "next";
require('dotenv').config();

const nextConfig: NextConfig = {
  env: {
    INSEE_API_KEY: process.env.INSEE_API_KEY,
    COMPANY_NAME: process.env.COMPANY_NAME,
    COMPANY_SIREN: process.env.COMPANY_SIREN,
    COMPANY_ADDRESS: process.env.COMPANY_ADDRESS,
    COMPANY_POSTAL_CODE: process.env.COMPANY_POSTAL_CODE,
    COMPANY_CITY: process.env.COMPANY_CITY,
    COMPANY_EMAIL: process.env.COMPANY_EMAIL,
    COMPANY_PHONE: process.env.COMPANY_PHONE,
  },
  /* other config options here */
};

export default nextConfig;
