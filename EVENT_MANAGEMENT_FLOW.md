# Event Management Flow - Leader & Admin

**Current Date**: March 14, 2026
**Status**: Complete and Working

---

## 🔄 Complete Event Flow

### 1. **Where Events Are Created**

#### LeaderDashboard (Leader Portal)
- **URL**: `/leader-dashboard`
- **Tab**: Events tab
- **Form Fields**: Title, Date, Time, Location, Description
- **Storage Key**: `troop_events`
- **Handler**: `handleCreateEvent()`

#### AdminDashboard (Admin Portal)
- **URL**: `/admin-dashboard`
- **Tab**: Events tab
- **Form Fields**: Title, Date, Location, Description (no time field)
- **Storage Key**: `troop_events` (SAME KEY!)
- **Handler**: `handleAddEvent()`

**Important**: Both Leader and Admin create events in the **same localStorage** location (`troop_events`)

---

## 📍 Event Storage Location

### localStorage Key: `troop_events`

**Structure**:
```javascript
// Each event object
{
  id: "item-1710433200000-a1b2c3d",
  title: "Summer Camp 2026",
  date: "2026-07-15",
  time: "8:00 AM",          // Leader adds this
  location: "Mountain Lake",
  description: "3-day camping adventure",
  createdAt: "2026-03-14T10:30:00.000Z",
  createdBy?: "Leader/Admin" // Not currently stored
}
```

**Data Persistence**:
- Auto-saved via `saveData()` utility in `adminData.js`
- Survives page refresh and browser restart
- Shared across both dashboards

---

## 🎯 Where Events Are Displayed

### 1. **LeaderDashboard**
- **Tab**: Events tab
- **Display**: Simple event cards below the create form
- **Shows**: Title, Date, Time, Location, Description
- **Interactions**: View only (no delete button currently)
- **Code Location**: `src/pages/LeaderDashboard.jsx` lines 1050+

### 2. **AdminDashboard**
- **Tab**: Events tab
- **Display**: Upcoming events list with delete button
- **Shows**: Title, Date, Location, Description
- **Interactions**: View, Delete
- **Code Location**: `src/pages/AdminDashboard.jsx` lines 385-540

### 3. **Public Calendar Page** ❌
- **URL**: `/calendar`
- **Current Status**: Does NOT use `troop_events` localStorage
- **What It Shows**: Google Calendar embed from official Troop 242 calendar
- **Code Location**: `src/pages/Calendar.jsx` lines 60-80
- **Issue**: Events created in Leader/Admin dashboards don't appear here

---

## 🔗 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser localStorage                      │
│                                                               │
│  Key: 'troop_events'                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [{id, title, date, time, location, description, ...}] │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────┬──────────────────────────┬──────────────────┬────┘
           │                          │                  │
           │                          │                  │
      ┌────▼─────┐          ┌────────▼────────┐    ┌────▼──────┐
      │  Leader   │          │     Admin      │    │  Calendar  │
      │ Dashboard │          │   Dashboard    │    │    Page    │
      │           │          │                │    │            │
      │ - View    │          │ - Create       │    │ - Google   │
      │ - Create  │          │ - View         │    │   Calendar │
      │ - List    │          │ - Delete       │    │ - NO ACCESS│
      │           │          │ - List         │    │   to local │
      └───────────┘          └────────────────┘    │   storage  │
      (Read/Write)           (Read/Write)          └────────────┘
                                                   (External Only)
```

---

## 📋 Event Lifecycle

### Step 1: Creation
```
Leader/Admin fills event form
          ↓
handleCreateEvent() validates data
          ↓
New event object created with:
  - id: generateId()
  - title, date, time, location, description
  - createdAt: timestamp
          ↓
Event added to state: [...events, newEvent]
          ↓
saveData('troop_events', updatedEvents)
          ↓
Saved to localStorage
```

### Step 2: Display
```
Component mounts → loadData('troop_events', [])
          ↓
Events loaded from localStorage
          ↓
Rendered in component state
          ↓
Displayed in UI with map()
```

### Step 3: Deletion (Admin Only)
```
Admin clicks delete button
          ↓
handleDeleteEvent(eventId)
          ↓
events.filter(e => e.id !== eventId)
          ↓
saveData('troop_events', filtered)
          ↓
Removed from localStorage
```

---

## ⚠️ Current Issues & Gaps

### Issue 1: Public Calendar Doesn't Show Created Events
**Problem**:
- Leader/Admin create events in localStorage
- Calendar page displays Google Calendar embed
- **Result**: Created events don't appear to public scouts

**Root Cause**:
- Calendar page doesn't load from `troop_events` key
- Uses external Google Calendar instead
- No sync between localStorage and Google Calendar

**Solution**:
See "Recommended Fixes" section below

### Issue 2: No Event Deletion in LeaderDashboard ✅ FIXED
**Problem** (FIXED):
- Leaders could create events but NOT delete them
- Only Admins could delete

**Solution Implemented**:
- ✅ Added delete button to each event in LeaderDashboard
- ✅ Leaders can now delete their own events
- ✅ Success message on deletion
- ✅ Event immediately removed from storage

### Issue 3: No Creator Attribution ✅ FIXED
**Problem** (FIXED):
- Events didn't track who created them (Leader vs Admin)
- Couldn't distinguish between sources

**Solution Implemented**:
- ✅ Added `createdBy` field to event object
- ✅ Extracts creator name from logged-in user
- ✅ Displays creator on event card
- ✅ Shows "Created by: [Leader Name]" in event details

### Issue 4: No Scout Signup/RSVP ✅ PARTIALLY FIXED
**Problem** (INFRASTRUCTURE ADDED):
- Events are view-only for scouts
- No way to RSVP or track attendance
- Different from Activities (which have signups)

**Solution Partially Implemented**:
- ✅ Added `signups` array to event objects (empty, ready for scouts)
- ✅ Added `spots` field (event capacity, default 100)
- ✅ Display signup counter on event card ("X scouts interested")
- ⏳ Scout RSVP UI not yet implemented (scouts can't click to RSVP)
- ⏳ Need to add RSVP button on Scout-facing Calendar/Events page

**Next Steps**:
- Add RSVP button on Calendar page for scouts
- Add scout signup tracking similar to Activities
- Show roster of interested scouts

---

## 🛠️ Recommended Fixes - Implementation Status

### Fix 1: Sync Public Calendar with localStorage Events ✅ DONE
**Priority**: HIGH
**Status**: ✅ IMPLEMENTED
**Impact**: Events become visible to all scouts

**What Was Added**:
```javascript
// In Calendar.jsx
const [events, setEvents] = useState([]);

useEffect(() => {
  try {
    const storedEvents = localStorage.getItem('troop_events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  } catch (error) {
    console.error('Failed to load events from localStorage:', error);
  }
}, []);
```

**Display Section**:
- New "📌 Upcoming Troop Events" section on Calendar page
- Appears AFTER Google Calendar embed
- Shows event cards with: Title, Creator, Date, Time, Location, RSVP count, Description
- Events sorted chronologically
- Only displays if events exist (`{events.length > 0 &&}`)

### Fix 2: Add Delete Button to LeaderDashboard Events ✅ DONE
**Priority**: MEDIUM
**Status**: ✅ IMPLEMENTED
**Impact**: Leaders can now manage their own events

**What Was Added**:
```javascript
// In LeaderDashboard.jsx - Events Tab
const handleDeleteEvent = useCallback((eventId) => {
  const updated = events.filter(e => e.id !== eventId)
  setEvents(updated)
  saveData('troop_events', updated)
  showSuccess('Event deleted.')
}, [events, showSuccess])

// Delete button next to each event
<button onClick={() => handleDeleteEvent(event.id)}>
  <Trash2 size={16} />
</button>
```

**Features**:
- Red delete button on event card
- Immediate deletion
- Success message feedback
- Data persists to localStorage

### Fix 3: Add Event Creator Attribution ✅ DONE
**Priority**: MEDIUM
**Status**: ✅ IMPLEMENTED
**Impact**: Can track who created each event

**What Was Added**:
```javascript
// On event creation
const loggedInUser = sessionStorage.getItem('loggedInUser')
const creatorName = loggedInUser ? JSON.parse(loggedInUser).name || 'Leader' : 'Leader'

const event = {
  ...event,
  createdBy: creatorName,
  createdAt: new Date().toISOString()
}
```

**Display on Event Card**:
```
👤 Created by: [Leader Name]
```

### Fix 4: Add Scout Event RSVP Feature ✅ PARTIALLY DONE
**Priority**: MEDIUM
**Status**: ⏳ INFRASTRUCTURE ADDED, UI PENDING
**Impact**: Scouts can eventually confirm attendance

**What Was Added**:
```javascript
// Event object now includes RSVP fields
const event = {
  ...event,
  signups: [],     // Array of scouts who RSVP'd
  spots: 100,      // Event capacity
}

// Display on event card
✓ {event.signups.length} scout(s) interested
```

**What's Still Needed**:
- Add RSVP button on Calendar page for scouts
- Scout signup tracking logic
- Show roster of interested scouts
- Capacity bar like Activities have

---

## 📊 Current Event Management Comparison

| Feature | Leader Dashboard | Admin Dashboard | Calendar Page | Activities |
|---------|------------------|-----------------|---------------|-----------|
| Create | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| View | ✅ Yes | ✅ Yes | ⚠️ Google Calendar only | ✅ Yes |
| Delete | ✅ **Yes** (NEW) | ✅ Yes | ❌ No | ✅ Yes |
| Scout Signup | ⏳ Ready (NEW) | ❌ No | ❌ No | ✅ Yes |
| Capacity Tracking | ⏳ Ready (NEW) | ❌ No | ❌ No | ✅ Yes |
| Creator Tracking | ✅ **Yes** (NEW) | ❌ No | N/A | N/A |
| Roster View | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Public Visibility | ❌ Only on Google Calendar | ❌ Admin only | ⚠️ External calendar | ✅ Yes |

**NEW = Recently Added**
**Ready = Infrastructure in place, UI implementation pending**

---

## 🔐 Data Integrity

### What's Protected
- Events are stored in browser localStorage
- Any user can create/delete (no permissions check)
- No backend validation

### What's Vulnerable
- Events only persist in single browser
- No cross-device sync
- No backup if localStorage is cleared
- No audit trail of changes

### Recommendations
1. Add user role validation before delete
2. Add event edit/update functionality
3. Create backup/export feature
4. Log who created/deleted events
5. Add event edit history

---

## 🚀 Next Steps

### Immediate (Week 1) - ✅ COMPLETE
- [x] Fix 2: Add delete button to LeaderDashboard events ✅
- [x] Fix 3: Add creator attribution to events ✅
- [x] Fix 1: Display `troop_events` on Calendar page ✅

### Short Term (Week 2-3)
- [x] Fix 4: RSVP infrastructure (signups, spots arrays) ✅
- [ ] Complete Fix 4: Scout RSVP UI on Calendar
- [ ] Add event edit functionality (both dashboards)
- [ ] Add event export/backup feature

### Medium Term (Week 4+)
- [ ] Fix 4: Add scout RSVP to events
- [ ] Add capacity management
- [ ] Add email notifications for new events
- [ ] Add recurring events

### Long Term
- [ ] Backend sync (database instead of localStorage)
- [ ] Event categories/tags
- [ ] Event attendance tracking
- [ ] Event feedback/surveys
- [ ] Integration with Google Calendar sync

---

## 📝 How to Test Events Locally

### Test Creating Event in LeaderDashboard
1. Navigate to `/leader-dashboard`
2. Click **Events** tab
3. Fill in: Title, Date, Time, Location, Description
4. Click **"Create Event"**
5. See success message
6. Event appears in list below

### Test Creating Event in AdminDashboard
1. Navigate to `/admin-dashboard`
2. Click **Events** tab
3. Fill in: Title, Date, Location, Description
4. Click **"Add Event"**
5. Event appears in "Upcoming Events" list
6. Can click delete button to remove

### Test localStorage Persistence
1. Create an event (either dashboard)
2. Open DevTools (F12)
3. Go to Application → Local Storage
4. Find key: `troop_events`
5. See event in JSON array
6. Refresh page → event still there ✅
7. Clear localStorage → event gone ✅

### Test Public Calendar Page
1. Navigate to `/calendar`
2. See Google Calendar embed
3. Events created in dashboards **won't appear here** ❌
4. Only official Troop 242 Google Calendar events show

---

## 💡 Summary

**Events Created By Leader/Admin**:
1. ✅ Stored in `troop_events` localStorage key
2. ✅ Displayed in both dashboards
3. ✅ Persist across sessions
4. ✅ Appear on public Calendar page (NEW)
5. ⏳ Scout signup/RSVP infrastructure ready (needs UI)
6. ✅ Can be deleted by leaders

**Completed Priority Fixes**:
1. ✅ Show events on public Calendar page
2. ✅ Add leader event deletion
3. ✅ Add event creator attribution
4. ✅ Scout RSVP infrastructure (signups, spots arrays)

**Remaining Work**:
1. Scout RSVP UI on Calendar page (scouts click to RSVP)
2. Sync with Google Calendar
3. Event edit/update functionality

**Questions?** Check the data flow diagram above or test locally using the test instructions provided.
