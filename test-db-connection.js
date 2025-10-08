const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');

    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'hikaricha_db'
    });

    console.log('✅ Database connected successfully!');

    // Check if border table exists
    const [tables] = await connection.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'hikaricha_db'
      AND table_name = 'border'
    `);

    if (tables.length > 0) {
      console.log('✅ Border table exists');

      // Check border table data
      const [borders] = await connection.execute('SELECT * FROM border LIMIT 5');
      console.log(`✅ Found ${borders.length} borders in database`);

      if (borders.length === 0) {
        console.log('🔧 Initializing default borders...');

        // Insert default borders
        const defaultBorders = [
          {
            id: 'default_' + Date.now(),
            name: 'default',
            description: 'Border default untuk semua user',
            imageUrl: '/borders/default.svg',
            price: null,
            rarity: 'COMMON',
            isActive: true,
            sortOrder: 0
          },
          {
            id: 'bronze_' + Date.now(),
            name: 'Bronze',
            description: 'Border bronze - achievement: FIRST_FORUM_POST',
            imageUrl: '/borders/bronze.svg',
            price: null,
            rarity: 'COMMON',
            isActive: true,
            sortOrder: 10
          },
          {
            id: 'silver_' + Date.now(),
            name: 'Silver',
            description: 'Border silver - achievement: FORUM_REGULAR',
            imageUrl: '/borders/silver.svg',
            price: null,
            rarity: 'RARE',
            isActive: true,
            sortOrder: 20
          },
          {
            id: 'gold_' + Date.now(),
            name: 'Gold',
            description: 'Border gold - achievement: RECIPE_CREATOR',
            imageUrl: '/borders/gold.svg',
            price: 500,
            rarity: 'EPIC',
            isActive: true,
            sortOrder: 30
          },
          {
            id: 'crystal_' + Date.now(),
            name: 'Crystal',
            description: 'Border crystal - achievement: SOCIAL_BUTTERFLY',
            imageUrl: '/borders/crystal.svg',
            price: 1000,
            rarity: 'EPIC',
            isActive: true,
            sortOrder: 40
          },
          {
            id: 'diamond_' + Date.now(),
            name: 'Diamond',
            description: 'Border diamond - achievement: BORDER_COLLECTOR',
            imageUrl: '/borders/diamond.svg',
            price: 2000,
            rarity: 'LEGENDARY',
            isActive: true,
            sortOrder: 50
          }
        ];

        for (const border of defaultBorders) {
          await connection.execute(`
            INSERT INTO border (id, name, description, imageUrl, price, rarity, isActive, sortOrder, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, [border.id, border.name, border.description, border.imageUrl, border.price, border.rarity, border.isActive, border.sortOrder]);
        }

        console.log('✅ Default borders initialized successfully!');
      } else {
        borders.forEach(border => {
          console.log(`  - ${border.name} (${border.rarity}) - Price: ${border.price || 'Free'}`);
        });
      }
    } else {
      console.log('❌ Border table does not exist');
    }

    // Check user table and points
    const [users] = await connection.execute('SELECT id, name, email, points FROM user LIMIT 3');
    console.log(`✅ Found ${users.length} users in database`);
    users.forEach(user => {
      console.log(`  - ${user.name || 'Unknown'} (${user.email}) - Points: ${user.points}`);
    });

    await connection.end();
    console.log('✅ Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
}

testDatabaseConnection();