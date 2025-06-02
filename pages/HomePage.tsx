
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai'; // Added for AI greeting
import { AuthContext } from '../App';
import { StyledButton } from '../components/StyledButton';
import { IconSearch, DAD_CHILD_ILLUSTRATION_URL, IconChevronRight, IconChevronLeft, USER_AVATAR_URL, GEMINI_MODEL_TEXT } from '../constants';
import { Page, SharedStory } from '../types';
import { StoryCard } from '../components/StoryCard';
import { mockCommunityStories } from '../services/mockCommunityData';
import { LoadingIcon } from '../components/LoadingIcon';


export const HomePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate(); 
  const [storyInput, setStoryInput] = useState('');
  const [communityStories, setCommunityStories] = useState<SharedStory[]>(mockCommunityStories);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [personalizedGreeting, setPersonalizedGreeting] = useState<string | null>(null);
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [greetingError, setGreetingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonalizedGreeting = async () => {
        if (!auth?.currentUser) return;

        setIsLoadingGreeting(true);
        setGreetingError(null);
        setPersonalizedGreeting(null); 

        const apiKey = process.env.API_KEY;
        if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
            setGreetingError("API Key not configured. Cannot generate personalized greeting.");
            setIsLoadingGreeting(false);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Bạn là DadMind AI. Hãy tạo một lời chào cá nhân, ấm áp và thật ngắn gọn (1-2 câu, tối đa 25 từ) để chào mừng người cha tên '${auth.currentUser.name}' quay trở lại DadMind. Ví dụ: "Chào mừng ${auth.currentUser.name} đã quay trở lại DadMind! Hôm nay bạn có điều gì muốn chia sẻ hay cần DadMind hỗ trợ không?" hoặc "DadMind rất vui khi gặp lại bạn, ${auth.currentUser.name}! Ngày hôm nay của bạn thế nào?". Hãy giữ sự tự nhiên và thân thiện.`;
            
            const response = await ai.models.generateContent({
              model: GEMINI_MODEL_TEXT,
              contents: prompt,
            });
        setPersonalizedGreeting(`DadMind rất vui khi gặp lại bạn, ${auth.currentUser.name}! Hôm nay bạn muốn chia sẻ điều gì cùng DadMind?`);

        } catch (err) {
            console.error("Error generating personalized greeting:", err);
            setGreetingError(`Lỗi khi tạo lời chào: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsLoadingGreeting(false);
        }
    };

    if (auth?.currentUser) {
        fetchPersonalizedGreeting();
    } else {
        setPersonalizedGreeting(null); // Clear greeting if user logs out
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.currentUser]);


  const handleShareStory = () => {
    if (storyInput.trim()) {
      const currentUser = auth?.currentUser;
      const newStory: SharedStory = {
        id: `story-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        content: storyInput.trim(),
        authorName: currentUser?.name || "Một người cha ẩn danh",
        timestamp: Date.now(),
        avatarUrl: currentUser?.avatar || USER_AVATAR_URL,
        likes: 0,
        likedByAvatars: [],
        comments: [],
      };
      setCommunityStories(prevStories => [newStory, ...prevStories]);
      setStoryInput('');
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; 
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };


  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 xl:gap-20 min-h-[calc(100vh-20rem)] sm:min-h-[calc(100vh-22rem)] py-8 sm:py-12">
        <div className="lg:w-1/2 text-center lg:text-left">
          {auth?.currentUser ? (
            isLoadingGreeting ? (
              <div className="animate-fadeInSmooth flex flex-col items-center lg:items-start">
                <LoadingIcon size="lg" />
                <p className="mt-4 text-brand-light-text">Đang tải lời chào...</p>
              </div>
            ) : personalizedGreeting ? (
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark-text mb-6 leading-tight animate-fadeInSmooth">
                  {personalizedGreeting}
                </h1>
                <p className="text-lg sm:text-xl text-brand-light-text mb-10 leading-relaxed animate-fadeInSmooth [animation-delay:0.4s]">
                  Bạn muốn chia sẻ điều gì hôm nay, hay cần DadMind hỗ trợ thêm?
                </p>
              </>
            ) : ( // Fallback if greeting fails or error
              <>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark-text mb-6 leading-tight animate-fadeInSmooth">
                  Chào mừng <span className="text-brand-accent">{auth.currentUser.name}</span>,
                  <br />
                  Hôm nay bạn muốn chia sẻ điều gì?
                </h1>
                <p className="text-lg sm:text-xl text-brand-light-text mb-10 leading-relaxed animate-fadeInSmooth [animation-delay:0.4s]">
                  Gõ vào câu chuyện, thắc mắc hoặc bất cứ điều gì bạn đang nghĩ. DadMind luôn sẵn sàng lắng nghe và hỗ trợ.
                </p>
              </>
            )
          ) : (
            <div className="animate-fadeInSmooth" style={{animationDelay: '0.1s'}}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark-text mb-6 leading-tight">
                Làm cha rồi, <span className="animated-gradient-text">vẫn lạc lối?</span>
              </h1>
              <p className="text-lg sm:text-xl text-brand-dark-text/90 mb-10 leading-relaxed animate-fadeInSmooth" style={{animationDelay: '0.3s'}}>
                <span className="font-medium">Đừng lo, hãy để</span> <span className="font-semibold text-brand-accent">DadMind</span> <span className="font-medium">lắng nghe câu chuyện của bạn.</span> Chúng tôi ở đây để hỗ trợ bạn trên hành trình làm cha tuyệt vời này.
              </p>
            </div>
          )}
          
          <div className="relative max-w-xl mx-auto lg:mx-0 group animate-fadeInSmooth" style={{animationDelay: auth?.currentUser ? '0.6s' : '0.5s'}}>
            <input
              type="text"
              value={storyInput}
              onChange={(e) => setStoryInput(e.target.value)}
              placeholder={auth?.currentUser ? "Chia sẻ câu chuyện của bạn để mọi người cùng đọc..." : "Chia sẻ câu chuyện của bạn..."}
              className="w-full py-4 pl-6 pr-20 text-brand-dark-text bg-brand-bg-card border-2 border-brand-border rounded-full shadow-card focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all duration-300 ease-in-out focus:shadow-interactive-lg placeholder-gray-500 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleShareStory()}
              aria-label={auth?.currentUser ? "Enter your story to share with the community" : "Share your story with the community"}
            />
            <StyledButton
              variant="primary"
              size="md"
              onClick={handleShareStory}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 !rounded-full !p-3 sm:!p-3.5 shadow-lg group-hover:shadow-xl group-hover:scale-105 active:shadow-md active:scale-100 transition-all duration-200"
              aria-label={auth?.currentUser ? "Post your story to the community" : "Post story"}
            >
              <IconSearch className="w-5 h-5 sm:w-6 sm:h-6" />
            </StyledButton>
          </div>
          <p className="mt-3 text-xs text-brand-light-text/80 text-center lg:text-left max-w-xl mx-auto lg:mx-0 animate-fadeInSmooth" style={{animationDelay: auth?.currentUser ? '0.7s' : '0.6s'}}>
            Câu chuyện của bạn sẽ được chia sẻ với cộng đồng DadMind.
          </p>
        </div>

        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center p-4 animate-fadeInSmooth" style={{animationDelay: '0.2s'}}>
          <img 
            src={DAD_CHILD_ILLUSTRATION_URL} 
            alt="Father and child bonding" 
            className="rounded-2xl shadow-2xl object-cover w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto aspect-[4/3] transition-all duration-300 border-4 border-white animate-gentle-bob hover:shadow-interactive-lg"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x450.png?text=DadMind+Illustration")}
          />
        </div>
      </div>

      {/* Community Stories Section */}
      <div className="py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-lg sm:text-xl text-brand-primary font-semibold mb-2">Kết Nối & Sẻ Chia</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark-text inline">
            Lời Nhắn Yêu Thương Từ 
          </h2>
          <h2 className="text-3xl sm:text-4xl font-extrabold animated-gradient-text inline ml-2">
            Cộng Đồng Bố Bỉm
          </h2>
          <p className="mt-4 text-brand-light-text max-w-2xl mx-auto text-base sm:text-lg">
            Khám phá những tâm sự, kinh nghiệm quý báu và kết nối với cộng đồng các ông bố tuyệt vời!
          </p>
        </div>

        {communityStories.length > 0 ? (
           <div className="relative">
            <button 
              onClick={() => scroll('left')}
              className="absolute left-[-15px] sm:left-[-20px] top-1/2 -translate-y-1/2 z-20 p-2.5 bg-brand-bg-card/90 hover:bg-brand-bg-card rounded-full shadow-lg text-brand-primary hover:text-brand-accent transition-colors backdrop-blur-sm hover:scale-110 active:scale-100"
              aria-label="Scroll left"
            >
              <IconChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto space-x-5 py-4 px-1 scrollbar-hide" 
            >
              {communityStories.map(story => (
                <StoryCard key={story.id} story={story} />
              ))}
              <div className="flex-shrink-0 w-1"></div>
            </div>
            <button 
              onClick={() => scroll('right')}
              className="absolute right-[-15px] sm:right-[-20px] top-1/2 -translate-y-1/2 z-20 p-2.5 bg-brand-bg-card/90 hover:bg-brand-bg-card rounded-full shadow-lg text-brand-primary hover:text-brand-accent transition-colors backdrop-blur-sm hover:scale-110 active:scale-100"
              aria-label="Scroll right"
            >
              <IconChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-brand-bg-subtle to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-brand-bg-subtle to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <p className="text-center text-brand-light-text">Chưa có chia sẻ nào. Hãy là người đầu tiên!</p>
        )}
      </div>
    </div>
  );
};
