require('dotenv').config()

const connectionString = process.env.DATABASE_URL

if (connectionString) {
    const { Pool } = require('pg')
    const pool = new Pool({ connectionString })
    module.exports = {
        query: (text, params) => pool.query(text, params),
    }
} else {
    module.exports = {
        query: () => Promise.resolve({ rows: [] }),
    }
}
