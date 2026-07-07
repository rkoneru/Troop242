/**
 * Firebase User Setup Script (ES Module)
 * Run this once to create test users and their Firestore profiles
 *
 * Usage:
 * 1. Download your Firebase service account key from Firebase Console:
 *    - Go to Project Settings → Service Accounts
 *    - Click "Generate New Private Key"
 *    - Save as serviceAccountKey.json in the project root
 * 2. Run: node setup-firebase-users.js
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load service account key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    '❌ serviceAccountKey.json not found!\n\n' +
    'To create test users, you need to download your Firebase service account key:\n' +
    '1. Go to https://console.firebase.google.com\n' +
    '2. Select your "troop242-54e6a" project\n' +
    '3. Click the gear icon (Settings) → Service Accounts\n' +
    '4. Click "Generate New Private Key"\n' +
    '5. Save the downloaded file as serviceAccountKey.json in this directory\n' +
    '6. Then run: node setup-firebase-users.js\n'
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'troop242-54e6a'
});

const auth = admin.auth();
const db = admin.firestore();

// Test users to create
const testUsers = [
  {
    email: 'scout@troop242.com',
    password: 'Scout123!@#',
    profile: {
      email: 'scout@troop242.com',
      role: 'scout',
      name: 'Scout Test User',
      rank: 'Scout',
      status: 'approved',
      joinDate: '2024-03-16',
      phone: '',
      notes: 'Test scout account',
      createdAt: admin.firestore.Timestamp.now()
    }
  },
  {
    email: 'leader@troop242.com',
    password: 'Leader123!@#',
    profile: {
      email: 'leader@troop242.com',
      role: 'leader',
      name: 'Leader Test User',
      status: 'approved',
      joinDate: '2024-03-16',
      phone: '',
      notes: 'Test leader account',
      createdAt: admin.firestore.Timestamp.now()
    }
  },
  {
    email: 'admin@troop242.com',
    password: 'Admin123!@#',
    profile: {
      email: 'admin@troop242.com',
      role: 'admin',
      name: 'Admin Test User',
      status: 'approved',
      joinDate: '2024-03-16',
      phone: '',
      notes: 'Test admin account',
      createdAt: admin.firestore.Timestamp.now()
    }
  }
];

async function setupUsers() {
  console.log('🚀 Creating Firebase test users...\n');

  for (const user of testUsers) {
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: user.email,
        password: user.password,
        displayName: user.profile.name
      });

      console.log(`✅ Created auth user: ${user.email}`);

      // Create user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set(user.profile);

      console.log(`✅ Created Firestore profile for ${user.email}\n`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️  User ${user.email} already exists (skipping)\n`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message);
      }
    }
  }

  console.log('✅ Setup complete!\n');
  console.log('Test Users Created:');
  console.log('─────────────────────────────────────');
  testUsers.forEach(user => {
    console.log(`📧 ${user.email}`);
    console.log(`👤 Role: ${user.profile.role}`);
    console.log('');
  });
  console.log('You can now login at: http://localhost:5176/Troop242/member-login\n');

  await admin.app().delete();
  process.exit(0);
}

setupUsers().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
