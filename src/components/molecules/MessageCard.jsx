import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "react-toastify";
import messageService from "@/services/api/messageService";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent } from "@/components/atoms/Card";

const MessageCard = ({ message, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate or get session ID for tracking likes
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('user-session-id');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('user-session-id', sessionId);
    }
    return sessionId;
  };
  
  // Initialize like state based on current user's like status
  React.useEffect(() => {
    const sessionId = getSessionId();
    const likes = message.likes || [];
    setIsLiked(likes.includes(sessionId));
    setLikeCount(likes.length);
  }, [message.likes]);
  
  // Handle heart click to toggle like
  const handleLikeToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const sessionId = getSessionId();
    
    try {
      const updatedMessage = await messageService.toggleLike(message.Id, sessionId);
      const newLikes = updatedMessage.likes || [];
      const newIsLiked = newLikes.includes(sessionId);
      
      setIsLiked(newIsLiked);
      setLikeCount(newLikes.length);
      
      toast.success(newIsLiked ? '좋아요를 눌렀습니다 ❤️' : '좋아요를 취소했습니다', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('좋아요 처리 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };
  // Generate initials from author name
  const getInitials = (name) => {
    if (!name || name === "익명") return "익";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Format relative time in Korean
const getRelativeTime = (timestamp) => {
    // Validate timestamp input
    if (!timestamp || timestamp === null || timestamp === undefined) {
      return "시간 정보 없음";
    }

    const now = new Date();
    const messageTime = new Date(timestamp);
    
    // Check if the created date is valid
    if (isNaN(messageTime.getTime())) {
      return "시간 정보 없음";
    }
    
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    // Safely call formatDistanceToNow with error handling
    try {
      return formatDistanceToNow(messageTime, {
        addSuffix: true,
        locale: ko,
      });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return "시간 정보 오류";
    }
  };

  const authorName = message.author || "익명";
  const initials = getInitials(authorName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-5 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50">
        <CardContent className="p-0">
          <div className="flex items-start space-x-4">
            {/* Circular Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <span className="text-sm font-semibold text-white">
                  {initials}
                </span>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-200 truncate">
                  {authorName}
                </h4>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {getRelativeTime(message.timestamp)}
                </span>
              </div>
              
<p className="text-gray-100 leading-relaxed whitespace-pre-wrap text-sm break-words">
                {message.content || message.text}
              </p>
              
              {/* Like Section */}
              <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-700/30">
                <button
                  onClick={handleLikeToggle}
                  disabled={isLoading}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200 hover:bg-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed group ${
                    isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                  >
                    <ApperIcon 
                      name={isLiked ? "Heart" : "Heart"} 
                      size={16} 
                      className={`transition-all duration-200 ${
                        isLiked 
                          ? 'fill-current text-red-400' 
                          : 'text-gray-400 group-hover:text-red-400'
                      }`}
                      fill={isLiked ? "currentColor" : "none"}
                    />
                  </motion.div>
                  <span className={`text-xs font-medium transition-colors duration-200 ${
                    isLiked ? 'text-red-400' : 'text-gray-400 group-hover:text-red-400'
                  }`}>
                    {likeCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessageCard;