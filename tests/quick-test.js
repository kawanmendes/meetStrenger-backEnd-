#!/usr/bin/env node

// Quick test script for P2P development
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function quickTest() {
  console.log('🚀 Quick P2P API Test');
  console.log('====================');

  try {
    // Health check
    console.log('1. Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy');

    // Register user
    console.log('2. Register User...');
    const userData = {
      username: `quicktest_${Date.now()}`,
      email: `quick_${Date.now()}@test.com`,
      password: 'test123'
    };
    
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, userData);
    const token = registerRes.data.data.token;
    console.log('✅ User registered');

    // Get profile
    console.log('3. Get Profile...');
    const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved');

    // P2P Queue stats
    console.log('4. P2P Queue Stats...');
    const statsRes = await axios.get(`${BASE_URL}/matching/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Queue stats - Movies: ${statsRes.data.data.movies}, Gaming: ${statsRes.data.data.gaming}, Music: ${statsRes.data.data.music}, Study: ${statsRes.data.data.study}, Active: ${statsRes.data.data.activeRooms}`);

    // Join P2P queue
    console.log('5. Join P2P Queue...');
    const joinRes = await axios.post(`${BASE_URL}/matching/join`, {
      category: 'gaming'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ P2P queue join endpoint works');

    console.log('\n🎉 All P2P tests passed!');
    console.log('📚 Full documentation: http://localhost:3000/docs');
    console.log('🔌 Use WebSocket for real-time P2P matching');
    console.log('💾 Database: PostgreSQL (no message persistence)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.response?.data?.message || error.message);
    process.exit(1);
  }
}

quickTest();
