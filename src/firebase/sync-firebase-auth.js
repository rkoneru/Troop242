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

const auth = admin.auth();

async function syncFirebaseAuth() {
  try {
    console.log('Syncing Firebase Auth credentials...\n');

    const accounts = [
      { email: 'admin@troop242.com', password: 'Admin@123' },
      { email: 'leader@troop242.com', password: 'Leader@123' },
      { email: 'scout@troop242.com', password: 'Scout@123' }
    ];

    for (const account of accounts) {
      try {
        // Try to get user by email
        const user = await auth.getUserByEmail(account.email);

        // Update password
        await auth.updateUser(user.uid, {
          password: account.password
        });

        console.log(`✓ Updated ${account.email} password`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          console.log(`✗ ${account.email} not found in Firebase Auth`);
          console.log(`  Creating new user...`);

          try {
            const newUser = await auth.createUser({
              email: account.email,
              password: account.password,
              displayName: account.email.split('@')[0]
            });

            console.log(`✓ Created ${account.email} (UID: ${newUser.uid})`);
          } catch (createError) {
            console.error(`✗ Failed to create ${account.email}:`, createError.message);
          }
        } else {
          console.error(`✗ Error updating ${account.email}:`, error.message);
        }
      }
    }

    console.log('\n✅ Firebase Auth sync complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

syncFirebaseAuth();
