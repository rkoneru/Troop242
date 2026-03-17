import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/firebase/serviceAccountKey.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://troop242-54e6a.firebaseio.com"
});

const auth = admin.auth();
const db = admin.firestore();

async function addLeader(name, email, password) {
  try {
    console.log(`Creating leader: ${name} (${email})`);

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name
    });

    // Create Firestore document
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      name: name,
      role: 'leader',
      status: 'approved',
      password: password,
      joinDate: new Date().toISOString(),
      phone: '',
      createdAt: new Date().toISOString()
    });

    console.log(`✓ Leader created successfully!`);
    console.log(`\n📧 Login Credentials:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: Leader`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating leader:', error.message);
    process.exit(1);
  }
}

// Get arguments from command line
const args = process.argv.slice(2);

if (args.length === 3) {
  // Direct arguments: node add-leader.js "John Doe" "john@example.com" "john123"
  addLeader(args[0], args[1], args[2]);
} else {
  console.log('Usage: node add-leader.js "Leader Name" "email@example.com" "password"');
  console.log('\nExample: node add-leader.js "John Doe" "john@troop242.com" "john123"');
  process.exit(1);
}
