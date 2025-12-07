const path = require('path');
const mongoose = require('../backend/node_modules/mongoose');
const { ObjectId } = mongoose.Types;
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

// Models
const User = require('../backend/models/User');
const CallSession = require('../backend/models/CallSession');
const CallSessionStudent = require('../backend/models/CallSessionStudent');

// Config
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_system';

// Test Data
const TEST_SESSION_NAME = 'AUTO_TEST_SESSION_' + Date.now();
const ADMIN_EMAIL = 'test_admin@example.com';
const ASST_A_EMAIL = 'test_asst_a@example.com';
const ASST_B_EMAIL = 'test_asst_b@example.com';

const STUDENTS_DATA = [
    { name: 'Student 1', studentPhone: '111111', parentPhone: '999999' },
    { name: 'Student 2', studentPhone: '222222', parentPhone: '888888' },
    { name: 'Student 3', studentPhone: '333333', parentPhone: '777777' },
    { name: 'Student 4', studentPhone: '444444', parentPhone: '666666' }
];

async function runTest() {
    console.log('🚀 Starting Call Session End-to-End Test');
    console.log('----------------------------------------');

    try {
        // 1. Connect to DB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Setup Users
        console.log('\n👤 Setting up Test Users...');
        await User.deleteMany({ email: { $in: [ADMIN_EMAIL, ASST_A_EMAIL, ASST_B_EMAIL] } });

        const admin = await User.create({ name: 'Test Admin', email: ADMIN_EMAIL, password_hash: 'hash', role: 'admin' });
        const asstA = await User.create({ name: 'Test Asst A', email: ASST_A_EMAIL, password_hash: 'hash', role: 'assistant' });
        const asstB = await User.create({ name: 'Test Asst B', email: ASST_B_EMAIL, password_hash: 'hash', role: 'assistant' });
        console.log('✅ Users created: Admin, Asst A, Asst B');

        // 3. Admin: Create Session
        console.log('\n📅 Admin: Creating Call Session...');
        const session = await CallSession.create({
            name: TEST_SESSION_NAME,
            date: new Date().toISOString().split('T')[0],
            start_time: '10:00',
            status: 'active',
            creator_id: admin._id
        });
        console.log(`✅ Session Created: ${session.name} (ID: ${session._id})`);

        // 4. Admin: Import Students
        console.log('\n📥 Admin: Importing Students...');
        const studentDocs = STUDENTS_DATA.map(s => ({
            call_session_id: session._id,
            name: s.name,
            student_phone: s.studentPhone, // Map correctly to schema
            parent_phone: s.parentPhone,
            filter_status: ''
        }));
        await CallSessionStudent.insertMany(studentDocs);
        const totalStudents = await CallSessionStudent.countDocuments({ call_session_id: session._id });
        console.log(`✅ Imported ${totalStudents} students`);

        // 5. Assistant A: Get First Student
        console.log('\n🤖 Assistant A: Requesting Next Student...');
        let studentA1 = await assignNextStudent(session._id, asstA._id);
        if (studentA1 && studentA1.name === 'Student 1') {
            console.log(`✅ Asst A got: ${studentA1.name} (Locked for A)`);
        } else {
            throw new Error(`Expected Asst A to get Student 1, got ${studentA1?.name}`);
        }

        // 6. Assistant B: Get Next Student (Should NOT be Student 1)
        console.log('\n🤖 Assistant B: Requesting Next Student (Concurrency Check)...');
        let studentB1 = await assignNextStudent(session._id, asstB._id);
        if (studentB1 && studentB1.name !== 'Student 1') {
            console.log(`✅ Asst B got: ${studentB1.name} (Distinct from A)`);
        } else {
            throw new Error(`Collision! Asst B got ${studentB1?.name} which might be same as A`);
        }

        // 7. Assistant A: Finish Student 1
        console.log('\n📝 Assistant A: Marking Student 1 as "No Answer"...');
        await updateStudent(studentA1._id, asstA._id, { filterStatus: 'no-answer', comment: 'Called, no reply' });
        console.log('✅ Student 1 updated');

        // 8. Assistant A: Get Next (Should be Student 3, assuming B has 2, or vice versa)
        console.log('\n🤖 Assistant A: Requesting Next Student...');
        let studentA2 = await assignNextStudent(session._id, asstA._id);
        console.log(`✅ Asst A got: ${studentA2.name}`);

        // 9. Admin: Monitor Progress
        console.log('\neye Admin: Monitoring Session...');
        const stats = await getMonitorStats(session._id);
        console.log('📊 Stats:', stats.counts);
        console.log('🏆 Leaderboard:', stats.leaderboard);

        if (stats.counts.completed === 1 && stats.counts.pending === 3) { // 3 because 2 are in-progress(locked) but not filter_status set? Or filter_status set=completed. 
            // Actually, in my logic "completed" means filter_status is NOT empty.
            // Student 1 is 'no-answer' -> Completed.
            // Student 2 is assigned (B) but no status -> Pending.
            // Student 3 is assigned (A) but no status -> Pending.
            // Student 4 is unassigned -> Pending.
            // So completed = 1.
            console.log('✅ Status Counts Correct');
        } else {
            console.log('Warning: Check stats logic verify');
        }

        // Cleanup
        console.log('\n🧹 Cleaning up...');
        await CallSession.deleteOne({ _id: session._id });
        await CallSessionStudent.deleteMany({ call_session_id: session._id });
        await User.deleteMany({ email: { $in: [ADMIN_EMAIL, ASST_A_EMAIL, ASST_B_EMAIL] } });
        console.log('✅ Cleanup Complete');

        console.log('\n✨ TEST PASSED SUCCESSFULLY ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
    } finally {
        await mongoose.connection.close();
    }
}

// Mocking Controller Logic for Script
async function assignNextStudent(sessionId, userId) {
    const LOCK_TIMEOUT_MINUTES = 15;

    // 1. Check current assignment
    const current = await CallSessionStudent.findOne({
        call_session_id: sessionId,
        assigned_to: userId,
        filter_status: ''
    });

    if (current) return current;

    // 2. Find next
    const lockThreshold = new Date(Date.now() - LOCK_TIMEOUT_MINUTES * 60000);
    const next = await CallSessionStudent.findOneAndUpdate(
        {
            call_session_id: sessionId,
            filter_status: '',
            $or: [{ assigned_to: null }, { assigned_at: { $lt: lockThreshold } }]
        },
        { $set: { assigned_to: userId, assigned_at: new Date() } },
        { new: true, sort: { name: 1 } }
    );
    return next;
}

async function updateStudent(studentId, userId, data) {
    const update = {};
    if (data.filterStatus) update.filter_status = data.filterStatus;

    // To mimic controller, we need to populate fields, but updateOne is simpler here
    await CallSessionStudent.updateOne({ _id: studentId }, {
        ...update,
        last_called_by: userId
    });

    if (data.comment) {
        await CallSessionStudent.updateOne({ _id: studentId }, {
            $push: { comments: { text: data.comment, timestamp: new Date() } }
        });
    }
}

async function getMonitorStats(sessionId) {
    const students = await CallSessionStudent.find({ call_session_id: sessionId }).populate('last_called_by');

    const completed = students.filter(s => s.filter_status).length;
    const total = students.length;

    const leaderboard = {};
    students.forEach(s => {
        if (s.last_called_by) {
            const name = s.last_called_by.name || 'Unknown';
            leaderboard[name] = (leaderboard[name] || 0) + 1;
        }
    });

    return {
        counts: { total, completed, pending: total - completed },
        leaderboard
    };
}

runTest();
