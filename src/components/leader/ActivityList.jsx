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

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isExpanded = expandedRosters[item.id] ?? localExpanded[item.id];

        const handleToggleRoster = () => {
          if (onShowRoster) {
            onShowRoster(item.id);
          }
          setLocalExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
        };

        return (
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
                  <Calendar size={16} />
                  {new Date(item.date).toLocaleDateString()} {item.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {item.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
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
                  onClick={() => onEdit(item)}
                  className="btn-icon text-blue-600 hover:text-blue-700"
                  title="Edit"
                  aria-label={`Edit ${item.title}`}
                >
                  <Edit2 size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  className="btn-icon text-red-600 hover:text-red-700"
                  title="Delete"
                  aria-label={`Delete ${item.title}`}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Roster Toggle */}
          {(item.signedUp?.length || 0) > 0 && (
            <div className="mt-3 border-t pt-3">
              <button
                onClick={handleToggleRoster}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                aria-expanded={Boolean(isExpanded)}
                aria-label={`${isExpanded ? 'Hide' : 'Show'} roster for ${item.title}`}
              >
                {isExpanded ? '▼ Hide Roster' : '▶ Show Roster'}
              </button>

              {isExpanded && (
                <div className="mt-2 bg-gray-50 p-3 rounded">
                  <ul className="text-sm space-y-1">
                    {item.signedUp?.map((scout, idx) => (
                      <li key={idx} className="text-gray-700 flex items-center gap-1.5">
                        <span aria-hidden="true">•</span>
                        <span>{scout.name || 'Unknown'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
        );
      })}
    </div>
  );
}
