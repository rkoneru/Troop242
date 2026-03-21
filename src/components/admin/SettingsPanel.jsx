/**
 * SettingsPanel Component
 * Admin settings management
 * Extracted from AdminDashboard for reusability
 */

import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { useForm } from '../../hooks/useForm';

export default function SettingsPanel({ settings = {}, onSave }) {
  const [showSettings, setShowSettings] = useState(false);

  const handleSubmit = async (values) => {
    await onSave(values);
    setShowSettings(false);
  };

  const form = useForm(
    {
      troopName: settings.troopName || 'Troop 242',
      troopNumber: settings.troopNumber || '242',
      troopCity: settings.troopCity || 'Sanford',
      troopEmail: settings.troopEmail || 'troop242@example.com',
      troopThemeDefault: settings.troopThemeDefault || 'current',
      troopLogoUrl: settings.troopLogoUrl || '',
      scoutMeetingDay: settings.scoutMeetingDay || 'Monday',
      scoutMeetingTime: settings.scoutMeetingTime || '18:30',
    },
    handleSubmit
  );

  return (
    <div className="settings-panel">
      {!showSettings && (
        <button
          onClick={() => setShowSettings(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Settings size={18} />
          Edit Settings
        </button>
      )}

      {showSettings && (
        <div className="card p-6 space-y-4">
          <h3 className="text-xl font-bold">Troop Settings</h3>

          {/* Troop Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Troop Name</label>
              <input
                type="text"
                name="troopName"
                value={form.values.troopName}
                onChange={form.handleChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Troop Number</label>
              <input
                type="text"
                name="troopNumber"
                value={form.values.troopNumber}
                onChange={form.handleChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                type="text"
                name="troopCity"
                value={form.values.troopCity}
                onChange={form.handleChange}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="troopEmail"
                value={form.values.troopEmail}
                onChange={form.handleChange}
                className="input w-full"
              />
            </div>
          </div>

          {/* Meeting Info */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold">Scout Meeting Schedule</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Day</label>
                <select
                  name="scoutMeetingDay"
                  value={form.values.scoutMeetingDay}
                  onChange={form.handleChange}
                  className="input w-full"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Time</label>
                <input
                  type="time"
                  name="scoutMeetingTime"
                  value={form.values.scoutMeetingTime}
                  onChange={form.handleChange}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="border-t pt-4">
            <label className="label">Default Theme</label>
            <select
              name="troopThemeDefault"
              value={form.values.troopThemeDefault}
              onChange={form.handleChange}
              className="input w-full"
            >
              <option value="current">Current</option>
              <option value="dark">Dark</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end border-t pt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => form.handleSubmit({ preventDefault: () => {} })}
              disabled={form.isSubmitting}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {form.isSubmitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
