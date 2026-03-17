# Firebase Manual Setup — Create Test Users

If you prefer not to use the automated script, follow these steps to manually create test users.

## Step 1: Create Test Users in Firebase Auth

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `troop242-54e6a` project
3. Go to **Authentication** (left sidebar)
4. Click the **Users** tab
5. Click **Create user** button

### Scout Account
- **Email:** `scout@troop242.com`
- **Password:** `Scout123!@#`
- Click **Create user**

### Leader Account
- **Email:** `leader@troop242.com`
- **Password:** `Leader123!@#`
- Click **Create user**

### Admin Account
- **Email:** `admin@troop242.com`
- **Password:** `Admin123!@#`
- Click **Create user**

After creating each user, **copy the UID** (you'll need it in the next step).

## Step 2: Create Firestore User Profiles

1. Go to **Firestore Database** (left sidebar)
2. Click **Create collection**
3. Collection name: `users`
4. Click **Next**

### Create Scout Profile
1. Document ID: Paste the **UID from scout@troop242.com**
2. Click **Auto ID** → Replace with the copied UID
3. Add these fields (click **Add field**):
   - `email` (string): `scout@troop242.com`
   - `role` (string): `scout`
   - `name` (string): `Scout Test User`
   - `rank` (string): `Scout`
   - `status` (string): `approved`
   - `joinDate` (string): `2024-03-16`
   - `phone` (string): `` (leave blank)
   - `notes` (string): `Test scout account`
4. Click **Save**

### Create Leader Profile
1. Click **Add document** (in users collection)
2. Document ID: Paste the **UID from leader@troop242.com**
3. Add these fields:
   - `email` (string): `leader@troop242.com`
   - `role` (string): `leader`
   - `name` (string): `Leader Test User`
   - `status` (string): `approved`
   - `joinDate` (string): `2024-03-16`
   - `phone` (string): `` (leave blank)
   - `notes` (string): `Test leader account`
4. Click **Save**

### Create Admin Profile
1. Click **Add document** (in users collection)
2. Document ID: Paste the **UID from admin@troop242.com**
3. Add these fields:
   - `email` (string): `admin@troop242.com`
   - `role` (string): `admin`
   - `name` (string): `Admin Test User`
   - `status` (string): `approved`
   - `joinDate` (string): `2024-03-16`
   - `phone` (string): `` (leave blank)
   - `notes` (string): `Test admin account`
4. Click **Save**

## Step 3: Test Login

1. Go to http://localhost:5176/Troop242/member-login
2. Select **Scout** profile
3. Enter email: `scout@troop242.com`
4. Enter password: `Scout123!@#`
5. Click **Login**
6. Should redirect to **Scout Dashboard**

Repeat for **Leader** and **Admin** profiles.

## Troubleshooting

### Login fails with "User profile not found in database"
- Check that you created the Firestore user document with the correct UID
- Verify the `role` field is set correctly (`scout`, `leader`, or `admin`)

### Can't see users in Firebase Console
- Refresh the page (F5)
- Check that Authentication is enabled (should say "Email/Password" in Sign-in providers)

### Port already in use
- The app will automatically use the next available port
- Check the console output for the correct localhost URL

## Password Reference

```
Scout:  scout@troop242.com     / Scout123!@#
Leader: leader@troop242.com    / Leader123!@#
Admin:  admin@troop242.com     / Admin123!@#
```

## Next: Automated Approach

If you want to automate this in the future:
1. Download your Firebase service account key from Project Settings → Service Accounts
2. Save as `serviceAccountKey.json` in the project root
3. Run: `node setup-firebase-users.js`
