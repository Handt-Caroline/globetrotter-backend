const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

let writeQueue = Promise.resolve();

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(data) {
  // Chain writes so they never overlap (prevents corruption)
  writeQueue = writeQueue.then(() => {
    return new Promise((resolve, reject) => {
      const tmpPath = DB_PATH + '.tmp';
      fs.writeFile(tmpPath, JSON.stringify(data, null, 2), (err) => {
        if (err) return reject(err);
        fs.rename(tmpPath, DB_PATH, (err2) => {
          if (err2) return reject(err2);
          resolve();
        });
      });
    });
  });
  return writeQueue;
}

module.exports = { readDB, writeDB };