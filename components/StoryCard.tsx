import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { SharedStory, StoryComment, User, Page } from '../types';
import { USER_AVATAR_URL, IconQuote, IconHeart, IconComment } from '../constants';
import { AuthContext } from '../App';
import { StyledButton } from './StyledButton';

const timeAgo = (timestamp: number): string => {
  const now = Date.now();
  const seconds = Math.round((now - timestamp) / 1000);

  if (seconds < 5) return `vài giây trước`;
  if (seconds < 60) return `${seconds} giây trước`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const avatarErrorPlaceholder = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string = "User", size: string = "40") => {
    const target = e.currentTarget;
    const initial = name.substring(0, 1).toUpperCase() || "U";
    target.src = `https://via.placeholder.com/${size}/E8F0F9/4A55A2?text=${initial}`;
    target.alt = `${name} placeholder avatar`;
};

const CommentDisplay: React.FC<{ comment: StoryComment }> = ({ comment }) => {
  return (
    <div className="flex items-start space-x-2.5 py-2.5 border-b border-brand-border/20 last:border-b-0">
      <img 
        src={comment.avatarUrl || USER_AVATAR_URL} 
        alt={`${comment.authorName}'s avatar`}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
        onError={(e) => avatarErrorPlaceholder(e, comment.authorName, "32")}
      />
      <div className="flex-grow">
        <div className="flex items-baseline space-x-1.5 mb-0.5">
          <span className="font-semibold text-xs sm:text-sm text-brand-dark-text">{comment.authorName}</span>
          <span className="text-[10px] sm:text-xs text-brand-light-text/70">{timeAgo(comment.timestamp)}</span>
        </div>
        <p className="text-xs sm:text-sm text-brand-light-text leading-normal whitespace-pre-line">
          {comment.content}
        </p>
      </div>
    </div>
  );
};


export const StoryCard: React.FC<{ story: SharedStory }> = ({ story }) => {
  const auth = useContext(AuthContext);
  const currentUser = auth?.currentUser;

  const storyAvatarSrc = story.avatarUrl || USER_AVATAR_URL;
  
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(story.likes);

  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [storyComments, setStoryComments] = useState<StoryComment[]>(story.comments || []);
  const [isPostingComment, setIsPostingComment] = useState(false);


  const handleLike = () => {
    if (isLiked) {
      setCurrentLikes(prev => prev - 1);
    } else {
      setCurrentLikes(prev => prev + 1);
    }
    setIsLiked(prev => !prev);
    // TODO: API call
  };

  const toggleCommentsSection = () => {
    setShowCommentsSection(prev => !prev);
  };
  
  const handlePostComment = () => {
    if (!newCommentText.trim() || !currentUser) return; // Ensure currentUser exists
    setIsPostingComment(true);

    const newComment: StoryComment = {
        id: `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        authorName: currentUser.name, // Use currentUser directly
        avatarUrl: currentUser.avatar || USER_AVATAR_URL,
        content: newCommentText.trim(),
        timestamp: Date.now(),
    };
    
    // Simulate API delay
    setTimeout(() => {
        setStoryComments(prevComments => [newComment, ...prevComments]);
        setNewCommentText('');
        setIsPostingComment(false);
        // TODO: API Call to actually save the comment
    }, 700);

  };

  const displayedLikedAvatars = story.likedByAvatars?.slice(0, 3) || [];
  const currentUserAvatarForInput = currentUser?.avatar || USER_AVATAR_URL;

  return (
    <div className="bg-brand-bg-card rounded-xl shadow-card p-5 flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-interactive-lg border border-transparent hover:border-brand-primary/30 min-w-[280px] sm:min-w-[300px] max-w-[320px]">
      <div className="flex items-start mb-3">
        <img 
          src={storyAvatarSrc} 
          alt={`${story.authorName}'s avatar`} 
          className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-brand-bg-light shadow-sm flex-shrink-0"
          onError={(e) => avatarErrorPlaceholder(e, story.authorName)}
        />
        <div className="flex-grow">
          <h4 className="font-semibold text-brand-dark-text text-sm">{story.authorName}</h4>
          <p className="text-xs text-brand-light-text/80">{timeAgo(story.timestamp)}</p>
        </div>
        <IconQuote className="w-8 h-8 text-brand-accent/20 ml-auto opacity-70 flex-shrink-0" />
      </div>
      
      <p className="text-sm text-brand-light-text leading-relaxed line-clamp-4 flex-grow mb-4 whitespace-pre-line">
        {story.content}
      </p>

      <div className="mt-auto pt-3 border-t border-brand-border/50">
        <div className="flex justify-between items-center">
          {/* Likes Section */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLike} 
              className={`p-1.5 rounded-full transition-colors duration-150 group ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
              aria-pressed={isLiked}
              aria-label={isLiked ? 'Unlike story' : 'Like story'}
            >
              <IconHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-transparent stroke-current stroke-2 group-hover:fill-red-100/50'}`} />
            </button>
            <span className="text-xs text-brand-light-text font-medium">{currentLikes}</span>
            {displayedLikedAvatars.length > 0 && (
              <div className="hidden sm:flex -space-x-1.5 items-center ml-1">
                {displayedLikedAvatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`User ${index + 1} who liked`}
                    className="w-5 h-5 rounded-full object-cover border border-white"
                    onError={(e) => avatarErrorPlaceholder(e, '?', "20")}
                  />
                ))}
                {story.likes > displayedLikedAvatars.length && (
                    <span className="pl-2 text-[10px] text-gray-400">
                        +{story.likes - displayedLikedAvatars.length}
                    </span>
                )}
              </div>
            )}
          </div>

          {/* Comment Button & Count */}
          <button 
            onClick={toggleCommentsSection}
            className="flex items-center space-x-1 text-xs text-brand-primary hover:text-brand-accent font-semibold py-1.5 px-2.5 rounded-md hover:bg-brand-primary/10 transition-colors"
            aria-expanded={showCommentsSection}
            aria-controls={`comments-section-${story.id}`}
          >
            <IconComment className="w-4 h-4" />
            <span>Bình luận</span>
            {storyComments.length > 0 && <span className="font-normal">({storyComments.length})</span>}
          </button>
        </div>
        
        {/* Comments Section */}
        {showCommentsSection && (
          <div id={`comments-section-${story.id}`} className="mt-3 pt-3 border-t border-brand-border/30">
            {/* Comment Input Area */}
            {currentUser ? (
              <div className="flex items-start space-x-2 mb-3">
                <img 
                  src={currentUserAvatarForInput} 
                  alt={currentUser.name || "Your avatar"}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                  onError={(e) => avatarErrorPlaceholder(e, currentUser.name || "User", "32")}
                />
                <div className="flex-grow">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-2 text-xs border border-brand-border rounded-lg focus:ring-1 focus:ring-brand-primary focus:border-transparent outline-none resize-none placeholder-gray-400 scrollbar-hide"
                    rows={2}
                    aria-label="Viết bình luận của bạn"
                    disabled={isPostingComment}
                  />
                  <StyledButton 
                      onClick={handlePostComment} 
                      size="sm" 
                      className="!px-3 !py-1 mt-1.5 text-xs float-right"
                      disabled={!newCommentText.trim() || isPostingComment}
                  >
                      {isPostingComment ? 'Đang gửi...' : 'Gửi'}
                  </StyledButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 px-2 border-b border-brand-border/20 mb-3">
                <p className="text-xs text-brand-light-text">
                  Vui lòng <Link to={Page.Login} className="font-semibold text-brand-primary hover:underline">đăng nhập</Link> hoặc <Link to={Page.Register} className="font-semibold text-brand-primary hover:underline">đăng ký</Link> để bình luận.
                </p>
              </div>
            )}

            {/* Comments List Area */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {storyComments.length > 0 ? (
                storyComments.map(comment => <CommentDisplay key={comment.id} comment={comment} />)
                ) : (
                <p className="text-xs text-brand-light-text text-center py-3">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};