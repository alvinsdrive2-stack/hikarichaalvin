// Using built-in fetch (Node.js 18+)

async function testLogin() {
  try {
    console.log('Testing login with demo@test.com / 123123...');

    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'demo@test.com',
        password: '123123',
        csrfToken: 'test',
        callbackUrl: 'http://localhost:3000',
        json: 'true'
      }),
      redirect: 'manual'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const cookies = response.headers.get('set-cookie');
    console.log('Cookies received:', cookies);

    if (response.status === 302) {
      console.log('✅ Login successful! Redirected to:', response.headers.get('location'));
    } else {
      const text = await response.text();
      console.log('❌ Login failed. Response body:', text);
    }

  } catch (error) {
    console.error('❌ Error testing login:', error.message);
  }
}

testLogin();