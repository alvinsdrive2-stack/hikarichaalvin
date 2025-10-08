// Test login functionality by simulating browser behavior

async function testLogin() {
  try {
    console.log('🔍 Testing login flow for demo@test.com / 123123...');

    // Step 1: Get the login page to extract CSRF token
    console.log('\n1. Getting login page...');
    const loginPageResponse = await fetch('http://localhost:3000/auth/login');
    const loginPageHtml = await loginPageResponse.text();

    // Extract CSRF token from the page
    const csrfMatch = loginPageHtml.match(/name="csrfToken"\s+content="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : null;

    if (!csrfToken) {
      console.log('❌ Could not extract CSRF token from login page');
      console.log('Page content preview:', loginPageHtml.substring(0, 500));
      return;
    }

    console.log('✅ CSRF token extracted:', csrfToken.substring(0, 20) + '...');

    // Step 2: Test the NextAuth sign-in endpoint directly
    console.log('\n2. Testing NextAuth sign-in endpoint...');

    const formData = new URLSearchParams({
      email: 'demo@test.com',
      password: '123123',
      csrfToken: csrfToken,
      callbackUrl: 'http://localhost:3000',
      json: 'true'
    });

    const authResponse = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': `next-auth.csrf-token=${csrfToken}`
      },
      body: formData,
      redirect: 'manual'
    });

    console.log('Auth response status:', authResponse.status);
    console.log('Auth response headers:', Object.fromEntries(authResponse.headers.entries()));

    const authResponseText = await authResponse.text();
    console.log('Auth response body:', authResponseText);

    if (authResponse.status === 302 || authResponse.status === 200) {
      console.log('✅ Login attempt processed');

      // Check if there's a session cookie in the response
      const setCookie = authResponse.headers.get('set-cookie');
      if (setCookie && setCookie.includes('next-auth.session-token')) {
        console.log('✅ Session cookie received - Login successful!');
      } else {
        console.log('❌ No session cookie found');
      }
    } else {
      console.log('❌ Login failed with status:', authResponse.status);
    }

  } catch (error) {
    console.error('❌ Error during login test:', error.message);
  }
}

testLogin();