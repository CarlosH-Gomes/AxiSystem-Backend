

// Update with your config settings.
require('dotenv').config();

const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

module.exports = {
    client: 'mysql',
    connection:  {
      host,
      user,
      port,
      password,
      database
      
    },
    pool: {
      min: 2,
      max: 10
    }
};
