const axios = require('axios');

async function testBackend() {
  try {
    console.log('Testing backend connectivity...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:8080/api/users/health');
    console.log('✅ Health endpoint:', healthResponse.data);
    
    // Test CORS preflight
    const preflightResponse = await axios.options('http://localhost:8080/api/users/health', {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization'
      }
    });
    console.log('✅ CORS preflight successful:', preflightResponse.status);
    console.log('CORS headers:', preflightResponse.headers);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBackend();
