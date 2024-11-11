const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database instance
const db = new sqlite3.Database(':memory:');

// Wrap database operations in promises for easier async/await usage
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database
const initDb = async () => {
  try {
    // Create tables
    await run(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        dni TEXT NOT NULL,
        telefono TEXT,
        telefonoConocido TEXT,
        precioPieza DECIMAL(10,2),
        estadoPago TEXT CHECK(estadoPago IN ('al_dia', 'debe')),
        fechaRecibo DATE,
        FOREIGN KEY (property_id) REFERENCES properties (id)
      )
    `);

    // Insert initial properties
    await run(`
      INSERT OR IGNORE INTO properties (id, name) VALUES 
      (1, 'Neuquen 266'),
      (2, 'Neuquen 274'),
      (3, 'Santa Rosa 1459')
    `);
  } catch (err) {
    console.error('Database initialization error:', err);
    throw err;
  }
};

// Initialize the database
initDb();

module.exports = {
  all,
  run,
  db
};