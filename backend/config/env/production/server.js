module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://meganetaaan.jp/backend'),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'eb4a472903600c8c8421bbe27bfb023f'),
    },
  },
});
