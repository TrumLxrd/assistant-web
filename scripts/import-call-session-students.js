const path = require('path');
const fs = require('fs');
const mongoose = require('../backend/node_modules/mongoose');
const XLSX = require('../node_modules/xlsx');
require('../backend/node_modules/dotenv').config({ path: '../backend/.env' });

// Models
const CallSession = require('../backend/models/CallSession');
const CallSessionStudent = require('../backend/models/CallSessionStudent');

// Config
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_system';
const CSV_FILE_PATH = '../attendance_report.csv'; // Path to your CSV file

async function importStudents() {
    console.log('🚀 Starting Student Import from CSV');
    console.log('----------------------------------------');

    try {
        // 1. Connect to DB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Check if CSV file exists
        const csvPath = path.resolve(__dirname, CSV_FILE_PATH);
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found at: ${csvPath}`);
        }
        console.log(`📁 Found CSV file: ${csvPath}`);

        // 3. Read and parse CSV
        console.log('📊 Parsing CSV file...');
        const workbook = XLSX.readFile(csvPath);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        console.log(`📋 Found ${jsonData.length} rows in CSV`);

        // 4. Parse and validate data (skip header row)
        const dataRows = jsonData.slice(1); // Skip header
        const students = [];

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const student = {};

            // Map columns based on CSV structure
            Object.keys(row).forEach(key => {
                const cleanKey = key.toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '');
                const val = row[key];

                if (!val && val !== 0) return; // Skip empty values

                // Column mapping based on your CSV
                if (cleanKey === 'studentname') {
                    student.name = val.toString().trim();
                } else if (cleanKey === 'phone') {
                    student.studentPhone = val.toString().replace(/[^0-9+]/g, '');
                } else if (cleanKey === 'parentphone') {
                    student.parentPhone = val.toString().replace(/[^0-9+]/g, '');
                }
            });

            // Validate student data
            if (student.name && student.name.length > 1) {
                // Skip if name looks like header
                const nameLower = student.name.toLowerCase();
                if (!nameLower.includes('name') && !nameLower.includes('student') && !nameLower.includes('id')) {
                    students.push(student);
                }
            }
        }

        console.log(`✅ Parsed ${students.length} valid students from CSV`);
        console.log('Sample students:', students.slice(0, 3));

        // 5. Find or create a call session
        let callSession = await CallSession.findOne({ name: 'Imported Call Session' });
        if (!callSession) {
            callSession = await CallSession.create({
                name: 'Imported Call Session',
                date: new Date().toISOString().split('T')[0],
                start_time: '10:00',
                status: 'active'
            });
            console.log('📅 Created new call session');
        } else {
            console.log('📅 Using existing call session');
        }

        // 6. Clear existing students for this session (optional)
        const deletedCount = await CallSessionStudent.deleteMany({ call_session_id: callSession._id });
        if (deletedCount.deletedCount > 0) {
            console.log(`🗑️ Cleared ${deletedCount.deletedCount} existing students`);
        }

        // 7. Import students
        console.log('💾 Importing students to database...');
        const studentRecords = students.map(student => ({
            call_session_id: callSession._id,
            name: student.name,
            student_phone: student.studentPhone || '',
            parent_phone: student.parentPhone || '',
            filter_status: '' // Not completed
        }));

        const result = await CallSessionStudent.insertMany(studentRecords);
        console.log(`✅ Successfully imported ${result.length} students`);

        // 8. Verify import
        const totalStudents = await CallSessionStudent.countDocuments({ call_session_id: callSession._id });
        console.log(`📊 Total students in session: ${totalStudents}`);

        console.log('\n✨ IMPORT COMPLETED SUCCESSFULLY ✨');
        console.log(`Session ID: ${callSession._id}`);
        console.log(`Session Name: ${callSession.name}`);
        console.log(`Students Imported: ${result.length}`);

    } catch (error) {
        console.error('\n❌ IMPORT FAILED:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

// Run the import
importStudents();