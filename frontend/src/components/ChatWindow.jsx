import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import { getMessages, createMessage, deleteMessage, togglePin } from '../services/api';
import { Send, Pin, Trash2, X, User, Phone, Video, Info, MoreVertical, Smile, Paperclip, MessageSquare } from 'lucide-react';

const ChatWindow = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('ChatWindow mounted, current socket status:', socket.connected ? 'connected' : 'disconnected');
    
    if (!socket.connected) {
      console.log('Forcing socket connection...');
      socket.connect();
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await getMessages();
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receiveMessage', (message) => {
      console.log('Received receiveMessage event:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('messageDeleted', (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });

    socket.on('pinToggled', (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id === updatedMessage._id) return updatedMessage;
          if (updatedMessage.isPinned) return { ...msg, isPinned: false };
          return msg;
        })
      );
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receiveMessage');
      socket.off('messageDeleted');
      socket.off('pinToggled');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const pinned = messages.find(m => m.isPinned && !m.isDeleted);
    setPinnedMessage(pinned || null);
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const messageData = { content: inputText, senderId: currentUser.id };
    try {
      await createMessage(messageData);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteMessage(id, { type, userId: currentUser.id });
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await togglePin(id);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const visibleMessages = messages?.filter(msg => !msg.deletedFor?.includes(currentUser?.id)) || [];

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f1a] h-full overflow-hidden">
      {/* Header */}
      <div className="h-20 px-8 bg-[#1a1a2a]/80 backdrop-blur-md border-b border-[#2d2d3d] flex items-center justify-between z-30">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-[#1a1a2a] flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=Global`} alt="Chat" className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1a1a2a] rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Global Channel</h2>
            <div className="flex items-center text-[11px] text-gray-500 font-medium">
              <span className={`${isConnected ? 'text-green-500' : 'text-red-500'} mr-1.5 animate-pulse`}>●</span>
              {isConnected ? 'Connected' : 'Reconnecting...'} • {visibleMessages.length} messages
              <button 
                onClick={() => {
                  console.log('Manual ping triggered');
                  socket.emit('ping');
                }}
                className="ml-2 underline text-blue-400 hover:text-blue-300"
              >
                Ping Debug
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {[Phone, Video, Info].map((Icon, i) => (
            <button key={i} className="p-2.5 text-gray-400 hover:text-white hover:bg-[#2a2a3a] rounded-xl transition-all">
              <Icon className="w-5 h-5" />
            </button>
          ))}
          <div className="w-px h-6 bg-[#2d2d3d] mx-2"></div>
          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-[#2a2a3a] rounded-xl transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pinned Message Banner */}
      {pinnedMessage && (
        <div className="mx-8 mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 backdrop-blur-sm p-3 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center overflow-hidden px-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Pin className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xs truncate">
              <p className="text-blue-400 font-bold uppercase tracking-wider text-[10px] mb-0.5">Pinned Message</p>
              <p className="text-gray-300 truncate italic">"{pinnedMessage.content}"</p>
            </div>
          </div>
          <button 
            onClick={() => handleTogglePin(pinnedMessage._id)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : visibleMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-[#1a1a2a] rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          visibleMessages.map((msg, index) => {
          const isOwn = msg.senderId === currentUser.id;
          const showAvatar = index === 0 || visibleMessages[index-1].senderId !== msg.senderId;
          
          return (
            <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-message`}>
              <div className={`flex items-end max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isOwn && (
                  <div className={`w-8 h-8 rounded-lg bg-[#2a2a3a] flex-shrink-0 mb-1 ${showAvatar ? 'opacity-100' : 'opacity-0'} mr-3`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId}`} className="w-full h-full rounded-lg" alt="" />
                  </div>
                )}
                
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name */}
                  {showAvatar && !isOwn && (
                    <span className="text-[11px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">
                      {msg.senderId}
                    </span>
                  )}
                  
                  {/* Bubble */}
                  <div className="relative group">
                    <div className={`px-4 py-2.5 rounded-2xl shadow-xl transition-all ${
                      isOwn 
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                        : 'bg-[#1a1a2a] text-gray-200 border border-[#2d2d3d] rounded-tl-none'
                    } ${msg.isDeleted ? 'opacity-60 italic' : ''} ${msg.isPinned ? 'ring-2 ring-blue-500/50' : ''}`}>
                      <p className="text-[13.5px] leading-relaxed break-words">{msg.content}</p>
                      
                      {/* Hover Actions */}
                      {!msg.isDeleted && (
                        <div className={`absolute top-0 ${isOwn ? 'right-full mr-3' : 'left-full ml-3'} hidden group-hover:flex items-center bg-[#1a1a2a] border border-[#2d2d3d] rounded-xl p-1 shadow-2xl z-20`}>
                          <button 
                            onClick={() => handleTogglePin(msg._id)}
                            className={`p-1.5 rounded-lg hover:bg-[#2a2a3a] transition-colors ${msg.isPinned ? 'text-blue-400' : 'text-gray-500'}`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(msg._id, 'me')}
                            className="p-1.5 rounded-lg hover:bg-[#2a2a3a] text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {isOwn && (
                            <button 
                              onClick={() => handleDelete(msg._id, 'everyone')}
                              className="p-1.5 rounded-lg hover:bg-[#2a2a3a] text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <span className="text-[9px] font-black px-1">ALL</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp & Meta */}
                    <div className={`flex items-center mt-1.5 px-1 space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                        {formatDate(msg.timestamp)}
                      </span>
                      {msg.isPinned && !msg.isDeleted && (
                        <div className="flex items-center text-blue-500">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#1a1a2a]/80 backdrop-blur-md border-t border-[#2d2d3d]">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-center space-x-3">
          <div className="flex-1 relative flex items-center">
            <button type="button" className="absolute left-4 p-1.5 text-gray-500 hover:text-gray-300 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message #global-channel..."
              className="w-full bg-[#2a2a3a] text-gray-200 pl-14 pr-14 py-4 rounded-[1.5rem] border border-transparent focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm placeholder-gray-600"
            />
            <button type="button" className="absolute right-4 p-1.5 text-gray-500 hover:text-gray-300 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-14 h-14 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex-shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
