/**
 * ActivityList Component
 * Displays activities or events in a table
 * Extracted from LeaderDashboard for reusability
 */

import { useState } from 'react';
import { MapPin, Users, Calendar, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActivityList({
  items = [],
  type = 'activity',
  onDelete,
  onEdit,
  onShowRoster,
  expandedRosters = {},
}) {
  const [localExpanded, setLocalExpanded] = useState({});

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {type === 'activity' ? 'activities' : 'events'} yet
      </div>
    );
  }

  const handleToggleRoster = (id) => {
    if (onShowRoster) {
      onShowRoster(id);
    } else {
      setLocalExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const isExpanded = (id) =>
    onShowRoster ? !!expandedRosters[id] : !!localExpanded[id];

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{item.title}</h4>

              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={16} aria-hidden="true" />
                  {new Date(item.date).toLocaleDateString()} {item.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} aria-hidden="true" />
                  {item.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} aria-hidden="true" />
                  {item.signedUp?.length || 0} / {item.spots}
                </div>
              </div>

              <p className="text-gray-700 mt-2">{item.description}</p>

              {item.dues > 0 && (
                <div className="mt-2 text-sm font-semibold text-green-600">
                  Dues: ${item.dues.toFixed(2)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="btn-icon text-blue-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:outline-none"
                  aria-label={`Edit ${item.title}`}
                  title="Edit"
                >
                  <Edit2 size={18} aria-hidden="true" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="btn-icon text-red-600 hover:text-red-700 focus-visible:ring-2 focus-visible:outline-none"
                  aria-label={`Delete ${item.title}`}
                  title="Delete"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Roster Toggle */}
          {(item.signedUp?.length || 0) > 0 && (
            <div className="mt-3 border-t pt-3">
              <button
                type="button"
                onClick={() => handleToggleRoster(item.id)}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold focus-visible:ring-2 focus-visible:outline-none rounded"
                aria-expanded={isExpanded(item.id)}
                aria-controls={`roster-${item.id}`}
              >
                {isExpanded(item.id) ? '▼ Hide Roster' : '▶ Show Roster'}
              </button>

              {isExpanded(item.id) && (
                <div id={`roster-${item.id}`} className="mt-2 bg-gray-50 p-3 rounded">
                  <ul className="text-sm space-y-1">
                    {item.signedUp?.map((scout, idx) => (
                      <li key={idx} className="text-gray-700">
                        <span aria-hidden="true">• </span>
                        {scout.name || 'Unknown'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
