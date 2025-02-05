import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // BACKEND_URL: "https://task-manager-backend-0gqh.onrender.com/api"
    BACKEND_URL: "http://localhost:4000/api"

  }
  /* config options here */
};

export default nextConfig;
