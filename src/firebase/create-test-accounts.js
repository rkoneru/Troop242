import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://troop242-54e6a.firebaseio.com"
});

const db = admin.firestore();
const auth = admin.auth();

async function createTestAccounts() {
  try {
    console.log('Setting up test accounts...\n');

    const accounts = [
      {
        email: 'admin@troop242.com',
        password: 'Admin@123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'leader@troop242.com',
        password: 'Leader@123',
        name: 'Leader User',
        role: 'leader'
      },
      {
        email: 'scout@troop242.com',
        password: 'Scout@123',
        name: 'Scout User',
        role: 'scout'
      }
    ];

    for (const account of accounts) {
      try {
        // Try to create Firebase Auth user
        const userRecord = await auth.createUser({
          email: account.email,
          password: account.password
        });

        // Create Firestore user document
        await db.collection('users').doc(userRecord.uid).set({
          uid: userRecord.uid,
          email: account.email,
          name: account.name,
          role: account.role,
          status: 'approved',
          joinDate: new Date().toISOString(),
          phone: '',
          createdAt: new Date().toISOString()
        });

        console.log(`✓ Created ${account.role}: ${account.email}`);
      } catch (error) {
        if (error.code === 'auth/email-already-exists') {
          console.log(`⚠ ${account.role.charAt(0).toUpperCase() + account.role.slice(1)} account already exists: ${account.email}`);

          // Update Firestore document to ensure correct data
          try {
            const usersSnap = await db.collection('users').where('email', '==', account.email).get();
            if (!usersSnap.empty) {
              const docId = usersSnap.docs[0].id;
              await db.collection('users').doc(docId).update({
                name: account.name,
                role: account.role,
                status: 'approved',
                password: admin.firestore.FieldValue.delete()
              });
              console.log(`  → Updated Firestore document`);
            }
          } catch (updateError) {
            console.error(`  → Error updating Firestore:`, updateError.message);
          }
        } else {
          console.error(`✗ Error creating ${account.role}:`, error.message);
        }
      }
    }

    console.log('\n📧 Test Account Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ADMIN:');
    console.log('  Email: admin@troop242.com');
    console.log('  Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('LEADER:');
    console.log('  Email: leader@troop242.com');
    console.log('  Password: Leader@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SCOUT:');
    console.log('  Email: scout@troop242.com');
    console.log('  Password: Scout@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestAccounts();
