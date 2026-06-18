import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  await import('fs').then(fs => fs.promises.readFile(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8'))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://troop242-54e6a.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();

async function createAdminAccount() {
  try {
    console.log('Creating admin account...');

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: 'admin@troop242.com',
      password: 'Admin@123'
    });

    console.log('✓ Firebase Auth user created:', userRecord.uid);

    // Create Firestore user document (excluding password)
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: 'admin@troop242.com',
      name: 'Admin User',
      role: 'admin',
      status: 'approved',
      joinDate: new Date().toISOString(),
      phone: '',
      createdAt: new Date().toISOString()
    });

    console.log('✓ Firestore user document created');
    console.log('\n📧 Admin Account Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: admin@troop242.com');
    console.log('Password: Admin@123');
    console.log('Role: Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

createAdminAccount();
