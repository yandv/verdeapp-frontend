/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.API_URL,
        WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    },
}

module.exports = nextConfig
