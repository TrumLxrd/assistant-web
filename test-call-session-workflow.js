// Test Call Session Workflow
const axios = require('axios');

const BASE_URL = 'https://localhost:5000/api';

// Test user credentials (admin)
const testUser = {
    email: 'admin@example.com',
    password: 'admin123'
};

let authToken = '';
let sessionId = '';

async function login() {
    try {
        console.log('🔐 Logging in as admin...');
        const response = await axios.post(`${BASE_URL}/auth/login`, testUser, {
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        if (response.data.success) {
            authToken = response.data.data.token;
            console.log('✅ Login successful');
            return true;
        }
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
    }
    return false;
}

async function createCallSession() {
    try {
        console.log('📞 Creating call session...');
        const sessionData = {
            name: 'Test Call Session',
            date: new Date().toISOString().split('T')[0], // Today
            start_time: '10:00'
        };

        const response = await axios.post(`${BASE_URL}/activities/call-sessions`, sessionData, {
            headers: { Authorization: `Bearer ${authToken}` },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        if (response.data.success) {
            sessionId = response.data.data.id;
            console.log('✅ Call session created:', sessionId);
            return true;
        }
    } catch (error) {
        console.error('❌ Failed to create call session:', error.response?.data || error.message);
    }
    return false;
}

async function importStudents() {
    try {
        console.log('👥 Importing test students...');
        const students = [
            {
                name: 'Test Student 1',
                studentPhone: '+201234567890',
                parentPhone: '+201234567891'
            },
            {
                name: 'Test Student 2',
                studentPhone: '+201234567892',
                parentPhone: '+201234567893'
            }
        ];

        const response = await axios.post(`${BASE_URL}/activities/call-sessions/${sessionId}/students`, { students }, {
            headers: { Authorization: `Bearer ${authToken}` },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        if (response.data.success) {
            console.log('✅ Students imported successfully');
            return true;
        }
    } catch (error) {
        console.error('❌ Failed to import students:', error.response?.data || error.message);
    }
    return false;
}

async function testAssignStudent() {
    try {
        console.log('🎯 Testing student assignment...');

        // First, start the session
        await axios.post(`${BASE_URL}/activities/call-sessions/${sessionId}/start`, {}, {
            headers: { Authorization: `Bearer ${authToken}` },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        // Now try to assign a student
        const response = await axios.post(`${BASE_URL}/activities/call-sessions/${sessionId}/assign`, {}, {
            headers: { Authorization: `Bearer ${authToken}` },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });

        if (response.data.success && response.data.data) {
            console.log('✅ Student assigned successfully:', response.data.data.name);
            console.log('📱 Student phone:', response.data.data.studentPhone);
            console.log('📞 Parent phone:', response.data.data.parentPhone);
            return true;
        } else {
            console.log('ℹ️ No students available or session not properly set up');
            console.log('Response:', response.data);
        }
    } catch (error) {
        console.error('❌ Student assignment failed:', error.response?.data || error.message);
    }
    return false;
}

async function runTests() {
    console.log('🧪 Starting Call Session Workflow Tests...\n');

    const loginSuccess = await login();
    if (!loginSuccess) return;

    const sessionCreated = await createCallSession();
    if (!sessionCreated) return;

    const studentsImported = await importStudents();
    if (!studentsImported) return;

    const assignmentWorked = await testAssignStudent();

    console.log('\n' + '='.repeat(50));
    if (assignmentWorked) {
        console.log('🎉 ALL TESTS PASSED! Call session functionality is working.');
    } else {
        console.log('⚠️ Some tests failed. Check the output above.');
    }
    console.log('='.repeat(50));
}

// Run the tests
runTests().catch(console.error);