const mongoose = require('../backend/node_modules/mongoose');
const CallSession = require('../backend/models/CallSession');
const CallSessionStudent = require('../backend/models/CallSessionStudent');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_system';

async function checkSessions() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all call sessions
        const sessions = await CallSession.find({}).sort({ createdAt: -1 }).limit(5);
        console.log('\n📅 Call Sessions:');
        console.log('================');

        for (const session of sessions) {
            const studentCount = await CallSessionStudent.countDocuments({ call_session_id: session._id });
            const completedCount = await CallSessionStudent.countDocuments({
                call_session_id: session._id,
                filter_status: { $ne: '' }
            });

            console.log(`ID: ${session._id}`);
            console.log(`Name: ${session.name}`);
            console.log(`Status: ${session.status}`);
            console.log(`Date: ${session.date}`);
            console.log(`Students: ${studentCount} total, ${completedCount} completed`);
            console.log(`Active Assistants: ${session.assistants?.length || 0}`);
            console.log('---');
        }

        // Check the imported session specifically
        const importedSession = await CallSession.findOne({ name: 'Imported Call Session' });
        if (importedSession) {
            console.log('\n🎯 Imported Call Session Details:');
            console.log('================================');
            console.log(`Session ID: ${importedSession._id}`);
            console.log(`Status: ${importedSession.status}`);
            console.log(`Date: ${importedSession.date}`);

            const students = await CallSessionStudent.find({ call_session_id: importedSession._id }).limit(5);
            console.log(`\nFirst 5 students:`);
            students.forEach((student, i) => {
                console.log(`${i+1}. ${student.name} - Phone: ${student.student_phone} - Status: ${student.filter_status || 'pending'}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkSessions();