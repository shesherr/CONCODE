const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'concode_db',
  port: process.env.DB_PORT || 3306,
});

let lastCount = 0;

async function showData() {
  try {
    console.clear();

    console.log(' CONCODE DATABASE - REAL TIME MONITOR  ');
    console.log(' Auto-refresh every 30 seconds  ');

    console.log('');

    // Show users
    const [users] = await pool.execute(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY id DESC'
    );

    console.log(`👥 USERS TABLE (${users.length} total)`);
    console.log('─'.repeat(90));
    console.log(
      'ID'.padEnd(5),
      'Name'.padEnd(20),
      'Email'.padEnd(32),
      'Role'.padEnd(16),
      'Registered'
    );
    console.log('─'.repeat(90));

    if (users.length === 0) {
      console.log('  (No users yet - register at http://localhost:5173/register)');
    } else {
      users.forEach(u => {
        const date = new Date(u.created_at);
        const time = date.toLocaleString('en-BD', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        });
        const roleLabel = u.role === 'office_member' ? '🏢 Office Member'
          : u.role === 'admin' ? '👑 Admin'
            : '👤 User';
        console.log(
          String(u.id).padEnd(5),
          u.full_name.padEnd(20),
          u.email.padEnd(32),
          roleLabel.padEnd(16),
          time
        );
      });
    }

    console.log('─'.repeat(90));

    // Alert on new user
    if (users.length > lastCount && lastCount > 0) {
      console.log('');
      console.log(`🔔 NEW USER REGISTERED! → ${users[0].full_name} (${users[0].email})`);
    }
    lastCount = users.length;

    console.log('');
    console.log(`Last updated: ${new Date().toLocaleTimeString()}`);
    console.log('Frontend: http://localhost:5173');
    console.log('Backend:  http://localhost:5000');

  } catch (err) {
    console.error('Database error:', err.message);
  }
}

// Run immediately, then every 5 seconds
showData();
setInterval(showData, 5000);

process.on('SIGINT', async () => {
  console.log('\n Monitor stopped.');
  await pool.end();
  process.exit();
});
