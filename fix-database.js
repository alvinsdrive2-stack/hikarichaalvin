const mysql = require('mysql2/promise');

async function fixDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('Connected to database');

    // Fix border updatedAt values
    console.log('Fixing border updatedAt values...');
    await connection.execute(
      "UPDATE border SET updatedAt = NOW() WHERE updatedAt IS NULL OR updatedAt = '0000-00-00 00:00:00'"
    );
    console.log('✅ Fixed border updatedAt values');

    // Fix activity table to auto-generate IDs
    console.log('Checking activity table structure...');
    const [activityTable] = await connection.execute("DESCRIBE activity");
    console.log('Activity table structure:', activityTable);

    // Test query to see if borders work
    console.log('Testing border query...');
    const [borders] = await connection.execute("SELECT * FROM border LIMIT 5");
    console.log('✅ Borders query successful:', borders.length, 'borders found');

  } catch (error) {
    console.error('Database fix error:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

fixDatabase();