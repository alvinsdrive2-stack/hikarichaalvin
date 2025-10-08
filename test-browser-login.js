// Browser-like login test
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🌐 Testing login with browser flow...');

    // Step 1: Get login page to establish session
    console.log('\n1. Getting login page...');
    const loginPageResponse = await fetch('http://localhost:3000/auth/login', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!loginPageResponse.ok) {
      console.log('❌ Failed to get login page');
      return;
    }

    console.log('✅ Login page loaded');

    // Extract cookies from the login page
    const cookies = loginPageResponse.headers.get('set-cookie') || '';
    console.log('Cookies received:', cookies);

    // Step 2: Submit login form
    console.log('\n2. Submitting login form...');

    const formData = new URLSearchParams({
      email: 'demo@test.com',
      password: '123123',
      redirect: 'false'
    });

    const loginResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: formData
    });

    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));

    const responseText = await loginResponse.text();
    console.log('Login response body:', responseText);

    if (loginResponse.status === 200) {
      try {
        const jsonResponse = JSON.parse(responseText);
        if (jsonResponse.url) {
          console.log('✅ Login successful! Redirecting to:', jsonResponse.url);
          console.log('🎉 Authentication test PASSED!');
        } else {
          console.log('❌ Login failed - no redirect URL in response');
        }
      } catch (e) {
        console.log('❌ Login failed - invalid JSON response');
      }
    } else if (loginResponse.status === 302) {
      console.log('✅ Login successful! Redirected to:', loginResponse.headers.get('location'));
      console.log('🎉 Authentication test PASSED!');
    } else {
      console.log('❌ Login failed with status:', loginResponse.status);
    }

  } catch (error) {
    console.error('❌ Error during login test:', error.message);
  }
}

testLogin();