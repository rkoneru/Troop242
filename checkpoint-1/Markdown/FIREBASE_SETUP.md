# Firebase Setup Guide for Troop 242

## Overview
The app has been converted to use Firebase for real authentication and data persistence. Follow these steps to get started.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a new project**
3. Enter project name: `Troop242` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **Create project** and wait for setup to complete

## Step 2: Get Your Firebase Configuration

1. In the Firebase Console, go to **Project Settings** (gear icon top-left)
2. Click the **General** tab
3. Scroll down to find the **Web** app config
4. If no web app exists, click **Add app** and select **Web**
5. Copy the entire config object:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "troop242-xxxxx.firebaseapp.com",
  projectId: "troop242-xxxxx",
  storageBucket: "troop242-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

## Step 3: Add Configuration to .env.local

1. Open `.env.local` in the project root
2. Fill in the values from your Firebase config:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=troop242-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=troop242-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=troop242-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```
3. Save the file

## Step 4: Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** (left menu)
2. Click the **Sign-in method** tab
3. Click **Email/Password** provider
4. Toggle **Enable** and click **Save**

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left menu)
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your region (closest to you)
5. Click **Create**

⚠️ **Security Rules for test mode expire after 30 days. Update to production rules before deploying.**

## Step 6: Create Test Users

In the Firebase Console, go to **Authentication → Users** and create these test accounts:

### Scout Account
- Email: `scout@troop242.com`
- Password: (create a strong password, e.g., `Scout123!@`)

### Leader Account
- Email: `leader@troop242.com`
- Password: (create a strong password, e.g., `Leader123!@`)

### Admin Account
- Email: `admin@troop242.com`
- Password: (create a strong password, e.g., `Admin123!@`)

## Step 7: Create User Profiles in Firestore

After creating the users, create a document for each in the `users` collection:

### Scout Profile
Go to **Firestore → Collections → Create collection "users"**
- Document ID: `[scout-user-uid]` (copy from Authentication page)
- Fields:
  ```
  email: "scout@troop242.com"
  role: "scout"
  name: "Scout Name"
  rank: "Scout"
  status: "approved"
  joinDate: "2024-03-16"
  ```

### Leader Profile
- Document ID: `[leader-user-uid]`
- Fields:
  ```
  email: "leader@troop242.com"
  role: "leader"
  name: "Leader Name"
  status: "approved"
  joinDate: "2024-03-16"
  ```

### Admin Profile
- Document ID: `[admin-user-uid]`
- Fields:
  ```
  email: "admin@troop242.com"
  role: "admin"
  name: "Admin Name"
  status: "approved"
  joinDate: "2024-03-16"
  ```

## Step 8: Initialize Troop Data (Optional)

Create a document `troop/settings` with default data:
```
stats:
  activeScouts: "50+"
  eagleScouts: "25+"
  yearsServing: "20"

leaders:
  [array of leader objects from DEFAULT_LEADERS in adminData.js]

announcements: []
```

## Step 9: Run the App

```bash
npm run dev
```

The app should now start without errors. Try logging in with your test accounts.

## Testing

1. **Login as Scout**: `scout@troop242.com` → should redirect to `/scout-dashboard`
2. **Login as Leader**: `leader@troop242.com` → should redirect to `/leader-dashboard`
3. **Login as Admin**: `admin@troop242.com` → should redirect to `/admin-dashboard`
4. **Invalid credentials**: Should show error message
5. **Logout**: Should redirect to home page

## Firestore Collections Reference

```
/users/{uid}
  - email, role, name, status, joinDate, phone, notes, createdAt

/events/{id}
  - title, description, date, time, location, type, slots, signups

/announcements/{id}
  - title, message, createdBy, pinned, createdAt

/activities/{id}
  - name, description, date, slots, signedUp

/progress/{uid}
  - rankChecks, requirementNotes, trackedSkills, badgeWishlist, scoutSignups

/invitations/{id}
  - email, role, token, used, createdAt

/troop/settings
  - stats, leaders, themeDefault
```

## Security Rules (Production)

⚠️ **Important**: Before deploying, update your Firestore security rules to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['leader', 'admin'];
    }
    match /events/{id} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['leader', 'admin'];
    }
    match /progress/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['leader', 'admin'];
    }
    match /troop/{doc} {
      allow read: if request.auth != null;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Troubleshooting

### "Firebase config is not valid"
- Check `.env.local` for correct values
- Ensure no extra spaces or quotes around values
- Restart `npm run dev` after updating `.env.local`

### "User profile not found in database"
- Check that user document exists in Firestore `/users/{uid}`
- Verify the `role` field is set correctly

### "Authentication disabled"
- Go to Firebase Console → Authentication → Sign-in method
- Ensure Email/Password provider is enabled

## Next Steps

1. ✅ Implement per-scout progress tracking in RankTracker.jsx
2. ✅ Implement activity signups in ScoutSignup.jsx
3. ✅ Update AdminDashboard to read from Firestore
4. ✅ Update LeaderDashboard to read from Firestore
5. ✅ Add logout button to header
6. ✅ Add user profile page
