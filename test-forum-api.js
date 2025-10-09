// Test Forum API Endpoints
console.log('Testing Forum API Endpoints...\n');

// Test Categories
async function testCategories() {
  try {
    const response = await fetch('http://localhost:3000/api/forum/categories');
    const data = await response.json();
    console.log('✅ Categories API:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.success) {
      console.log('   Categories found:', data.data.length);
      console.log('   Sample category:', data.data[0]);
    }
  } catch (error) {
    console.log('❌ Categories API: FAILED -', error.message);
  }
}

// Test Threads
async function testThreads() {
  try {
    const response = await fetch('http://localhost:3000/api/forum/threads');
    const data = await response.json();
    console.log('✅ Threads API:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.success) {
      console.log('   Threads found:', data.data.length);
      console.log('   Sample thread:', {
        id: data.data[0]?.id,
        title: data.data[0]?.title,
        category: data.data[0]?.category?.name
      });
    }
  } catch (error) {
    console.log('❌ Threads API: FAILED -', error.message);
  }
}

// Test Specific Thread
async function testThread() {
  try {
    const response = await fetch('http://localhost:3000/api/forum/threads/t1');
    const data = await response.json();
    console.log('✅ Thread Detail API:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.success) {
      console.log('   Thread title:', data.data.title);
      console.log('   Views:', data.data.views);
    }
  } catch (error) {
    console.log('❌ Thread Detail API: FAILED -', error.message);
  }
}

// Test Replies
async function testReplies() {
  try {
    const response = await fetch('http://localhost:3000/api/forum/threads/t1/replies');
    const data = await response.json();
    console.log('✅ Replies API:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.success) {
      console.log('   Replies found:', data.data.length);
    }
  } catch (error) {
    console.log('❌ Replies API: FAILED -', error.message);
  }
}

// Run all tests
async function runTests() {
  await testCategories();
  console.log('');
  await testThreads();
  console.log('');
  await testThread();
  console.log('');
  await testReplies();
  console.log('\n🎉 Forum API testing completed!');
}

runTests();