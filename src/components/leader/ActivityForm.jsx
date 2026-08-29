/**
 * ActivityForm Component
 * Handles creating and editing activities
 * Extracted from LeaderDashboard for reusability
 */

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { activitySchemas } from '../../utils/validation';
import { validate } from '../../utils/validation';

export default function ActivityForm({ onSubmit, initialValues = null, isEditing = false }) {
  const [showForm, setShowForm] = useState(false);

  const defaultValues = initialValues || {
    title: '',
    type: 'activity',
    date: '',
    time: '14:00',
    location: '',
    description: '',
    spots: '',
    dues: '',
  };

  const validateForm = (values) => {
    const result = validate(values, activitySchemas.create);
    return result.errors;
  };

  const form = useForm(defaultValues, async (values) => {
    await onSubmit(values);
    setShowForm(false);
  }, validateForm);

  // Reset form when showing/hiding
  if (!showForm) {
    form.resetForm();
  }

  return (
    <div className="activity-form">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {isEditing ? 'Edit Activity' : 'Create Activity'}
        </button>
      )}

      {showForm && (
        <div className="form-card">
          <div className="flex justify-between items-center mb-4">
            <h3>{isEditing ? 'Edit Activity' : 'Create New Activity'}</h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                form.resetForm();
              }}
              className="btn-icon"
              aria-label="Close form"
              title="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={form.handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="label">Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={form.values.title}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="Activity title"
                className={`input ${form.errors.title && form.touched.title ? 'input-error' : ''}`}
              />
              {form.errors.title && form.touched.title && (
                <span className="error-text">{form.errors.title}</span>
              )}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="label">Type *</label>
              <select
                id="type"
                name="type"
                value={form.values.type}
                onChange={form.handleChange}
                className="input"
              >
                <option value="activity">Activity</option>
                <option value="event">Event</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="label">Date *</label>
                <input
                  id="date"
                  type="datetime-local"
                  name="date"
                  value={form.values.date}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  className={`input ${form.errors.date && form.touched.date ? 'input-error' : ''}`}
                />
                {form.errors.date && form.touched.date && (
                  <span className="error-text">{form.errors.date}</span>
                )}
              </div>

              <div>
                <label htmlFor="time" className="label">Time *</label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={form.values.time}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  className={`input ${form.errors.time && form.touched.time ? 'input-error' : ''}`}
                />
                {form.errors.time && form.touched.time && (
                  <span className="error-text">{form.errors.time}</span>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="label">Location *</label>
              <input
                id="location"
                type="text"
                name="location"
                value={form.values.location}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="Activity location"
                className={`input ${form.errors.location && form.touched.location ? 'input-error' : ''}`}
              />
              {form.errors.location && form.touched.location && (
                <span className="error-text">{form.errors.location}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">Description *</label>
              <textarea
                id="description"
                name="description"
                value={form.values.description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="Activity description"
                rows={3}
                className={`input ${form.errors.description && form.touched.description ? 'input-error' : ''}`}
              />
              {form.errors.description && form.touched.description && (
                <span className="error-text">{form.errors.description}</span>
              )}
            </div>

            {/* Spots & Dues */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="spots" className="label">Spots *</label>
                <input
                  id="spots"
                  type="number"
                  name="spots"
                  value={form.values.spots}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  placeholder="25"
                  className={`input ${form.errors.spots && form.touched.spots ? 'input-error' : ''}`}
                />
                {form.errors.spots && form.touched.spots && (
                  <span className="error-text">{form.errors.spots}</span>
                )}
              </div>

              <div>
                <label htmlFor="dues" className="label">Dues (optional)</label>
                <input
                  id="dues"
                  type="number"
                  name="dues"
                  value={form.values.dues}
                  onChange={form.handleChange}
                  placeholder="$0.00"
                  className="input"
                />
              </div>
            </div>

            {form.errors._global && (
              <div className="bg-red-100 text-red-700 p-3 rounded">
                {form.errors._global}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  form.resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.isSubmitting}
                className="btn-primary"
              >
                {form.isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
