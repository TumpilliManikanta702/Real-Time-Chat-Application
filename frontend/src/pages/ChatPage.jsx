import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState({
    id: 'user1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  });

  const handleUserSelect = (user) => {
    setCurrentUser(user);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0f0f1a] selection:bg-blue-500/30">
      {/* Sidebar - User Selection */}
      <Sidebar currentUser={currentUser} onUserSelect={handleUserSelect} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <ChatWindow currentUser={currentUser} />
      </main>
    </div>
  );
};

export default ChatPage;
