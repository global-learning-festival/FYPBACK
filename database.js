require('dotenv').config();
const pg = require('pg');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 5,
  ssl : {
    rejectUnauthorized: false,
  }
};

let db;

if (process.env.NODE_ENV === 'test') {
  db = new pg.Client(dbConfig);
  db.connect();
} else {
  db = new pg.Pool(dbConfig);
}

module.exports = {
  query: (sql, params) => {
    console.log('SENDING QUERY | ', sql, params);
    return db.query(sql, params);
  },
  end: () => db.end(),
  POSTGRES_ERROR_CODE: {
    UNIQUE_CONSTRAINT: '23505',
  },
};
