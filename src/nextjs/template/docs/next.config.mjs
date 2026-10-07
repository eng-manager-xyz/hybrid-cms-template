/** @type {import('next').NextConfig} */
const nextConfig = {
  // Shiki loads its grammars at runtime; Node resolves them from node_modules.
  serverExternalPackages: ['shiki'],
};

export default nextConfig;
