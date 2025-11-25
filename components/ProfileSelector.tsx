"use client";

import { useState } from "react";
import { PlayerProfile } from "@/types/profile";

interface ProfileSelectorProps {
  profiles: PlayerProfile[];
  currentProfile: PlayerProfile | null;
  onSelectProfile: (profile: PlayerProfile) => void;
  onCreateProfile: (name: string) => PlayerProfile;
  label: string;
  playerNumber: 1 | 2;
}

export default function ProfileSelector({
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
  label,
  playerNumber,
}: ProfileSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (newName.trim()) {
      const profile = onCreateProfile(newName);
      onSelectProfile(profile);
      setNewName("");
      setIsCreating(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      {currentProfile ? (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">{currentProfile.name}</p>
            <p className="text-xs text-gray-600">
              {currentProfile.gamesPlayed} games • {currentProfile.winPercentage}% win rate
            </p>
          </div>
          <button
            onClick={() => onSelectProfile(null!)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Change
          </button>
        </div>
      ) : (
        <div>
          {!isCreating ? (
            <div className="space-y-2">
              <button
                onClick={() => setIsCreating(true)}
                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                + Create New Player
              </button>
              {profiles.length > 0 && (
                <div className="border-t pt-2">
                  <p className="text-xs text-gray-600 mb-2">Or select existing:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => onSelectProfile(profile)}
                        className="w-full text-left py-2 px-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <span className="font-medium">{profile.name}</span>
                        <span className="text-gray-500 text-xs ml-2">
                          ({profile.winPercentage}% win rate)
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Enter player name"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewName("");
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

