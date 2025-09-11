const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'migrations', '20250911_add_fotoUrl', 'migration.sql'), 'utf8');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.exec(sql, (err) => {
    if (err) {
      console.error('Error applying migration:', err.message);
      process.exit(1);
    } else {
      console.log('Migration applied successfully');
    }
  });
});

db.close();
