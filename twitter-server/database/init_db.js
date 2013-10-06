var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
 
fs.exists('tdp.db', function (exists) {
  db = new sqlite3.Database('tdp.db');
 
  if (!exists) {
    console.info('Creating database and tables. This may take a while...');
    fs.readFile('create_tables.sql', 'utf8', function (err, data) {
      if (err) throw err;
      db.exec(data, function (err) {
        if (err) throw err;
        console.info('Done.');
      });
    });
  }
});