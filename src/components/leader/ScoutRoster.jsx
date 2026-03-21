/**
 * ScoutRoster Component
 * Displays and manages troop scouts
 * Extracted from LeaderDashboard for reusability
 */

import { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';

export default function ScoutRoster({ onAddScout, onSelectScout }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Use custom hook to fetch scouts from Firestore
  const { data: scouts, loading, error } = useFirebaseCollection('users');

  // Filter scouts by role and search
  const filteredScouts = useMemo(() => {
    return scouts
      .filter(u => u.role === 'scout')
      .filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [scouts, searchQuery]);

  if (loading) {
    return <div className="text-center py-4">Loading scouts...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading scouts</div>;
  }

  return (
    <div className="scout-roster space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Troop Scouts</h3>
        {onAddScout && (
          <button onClick={onAddScout} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add Scout
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search scouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      {/* Scout List */}
      <div className="space-y-2">
        {filteredScouts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No scouts found</div>
        ) : (
          filteredScouts.map((scout) => (
            <motion.div
              key={scout.id}
              onClick={() => onSelectScout?.(scout)}
              className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{scout.name || 'Unknown'}</h4>
                  <div className="text-sm text-gray-600">
                    <div>{scout.email}</div>
                    <div className="text-blue-600">Rank: {scout.rank || 'Scout'}</div>
                  </div>
                </div>
                {scout.phone && (
                  <div className="text-sm text-gray-600">{scout.phone}</div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
