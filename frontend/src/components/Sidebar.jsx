import React from 'react';
import { Search, Settings, User, LogOut, MessageSquare } from 'lucide-react';

const Sidebar = ({ currentUser, onUserSelect }) => {
  const users = [
    { id: 'user1', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', status: 'Online' },
    { id: 'user2', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', status: 'Online' },
    { id: 'user3', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', status: 'Away' },
    { id: 'user4', name: 'Diana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana', status: 'Offline' },
  ];

  return (
    <div className="w-80 bg-[#1e1e2e] h-full flex flex-col text-gray-300 border-r border-[#2d2d3d] shadow-2xl">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-[#2d2d3d]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">VibeChat</h1>
          </div>
          <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        </div>
        
        {/* Search Bar (Visual Only) */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            className="w-full bg-[#2a2a3a] border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 px-3">Direct Messages</h2>
        {users?.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect?.(user)}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
              currentUser?.id === user.id 
                ? 'bg-blue-600/10 text-blue-400' 
                : 'hover:bg-[#2a2a3a] text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-11 h-11 rounded-xl mr-3 border-2 border-[#1e1e2e] shadow-lg group-hover:scale-105 transition-transform" 
              />
              <span className={`absolute bottom-0 right-2 w-3 h-3 rounded-full border-2 border-[#1e1e2e] ${
                user.status === 'Online' ? 'bg-green-500' : user.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></span>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-sm ${currentUser?.id === user.id ? 'text-blue-400' : 'text-gray-200'}`}>
                  {user.name}
                </span>
                {currentUser?.id === user.id && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold">YOU</span>}
              </div>
              <p className="text-[11px] text-gray-500 truncate">{user.status}</p>
            </div>
          </button>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 bg-[#1a1a2a] border-t border-[#2d2d3d]">
        <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-[#2a2a3a] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-gray-500 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
              Active
            </p>
          </div>
          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
