"use client";

import { PlayerProfile } from "@/types/profile";

interface StatisticsProps {
  profiles: PlayerProfile[];
  onClose: () => void;
}

export default function Statistics({ profiles, onClose }: StatisticsProps) {
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (b.gamesPlayed === 0 && a.gamesPlayed === 0) return 0;
    if (b.gamesPlayed === 0) return -1;
    if (a.gamesPlayed === 0) return 1;
    return b.winPercentage - a.winPercentage;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Player Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {sortedProfiles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No players yet. Play a game to get started!</p>
          ) : (
            <div className="space-y-4">
              {sortedProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className={`p-4 rounded-lg border-2 ${
                    index === 0 && profile.gamesPlayed > 0
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {profile.name}
                        {index === 0 && profile.gamesPlayed > 0 && (
                          <span className="ml-2 text-yellow-600">👑</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {profile.gamesPlayed} {profile.gamesPlayed === 1 ? "game" : "games"} played
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {profile.winPercentage}%
                      </p>
                      <p className="text-xs text-gray-500">Win Rate</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{profile.wins}</p>
                      <p className="text-xs text-gray-600">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{profile.losses}</p>
                      <p className="text-xs text-gray-600">Losses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-600">{profile.draws}</p>
                      <p className="text-xs text-gray-600">Draws</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

