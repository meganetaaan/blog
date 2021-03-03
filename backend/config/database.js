module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        client: env('DATABASE_CLIENT', 'mongo'),
        host: env('DATABASE_HOST', 'db'),
        port: env.int('DATABASE_PORT', 27017),
        database: env('DTABASE_NAME', 'strapi'),
        username: env('DTABASE_USERNAME', 'strapi'),
        password: env('DTABASE_PASSWORD', 'strapi')
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
