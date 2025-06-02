
import React, { useState, useEffect, useRef } from 'react';
import { Message, Expert } from '../types';
import { ChatMessage } from '../components/ChatMessage';
import { StyledButton } from '../components/StyledButton';
import { IconSend, IconPaperClip, IconChevronLeft, EXPERT_AVATAR_URL, USER_AVATAR_URL } from '../constants';
import { LoadingIcon } from '../components/LoadingIcon';

// Mock list of experts
const mockExperts: Expert[] = [
  {
    id: 'expert1',
    name: 'BS. Nguyễn Văn Minh',
    specialty: 'Tâm lý Gia đình & Trẻ em',
    avatarUrl: EXPERT_AVATAR_URL, 
    online: true,
    bio: 'Với hơn 10 năm kinh nghiệm, tôi chuyên hỗ trợ các ông bố trong việc xây dựng mối quan hệ tích cực với con cái và giải quyết xung đột gia đình.',
    phone: '0901 234 567',
    email: 'bs.minh@dadmind.com'
  },
  {
    id: 'expert2',
    name: 'ThS. Trần Thị Lan Anh',
    specialty: 'Phát triển Kỹ năng Làm cha',
    avatarUrl: "/assets/expert-avatar-2.webp", 
    online: true,
    bio: 'Tôi tập trung vào việc trang bị cho các ông bố những kỹ năng thực tế để đối mặt với thách thức trong từng giai đoạn phát triển của con.',
    phone: '0902 345 678',
    email: 'ths.lananh@dadmind.com'
  },
  {
    id: 'expert3',
    name: 'CN. Lê Hoàng Đức',
    specialty: 'Cân bằng Công việc & Cuộc sống',
    avatarUrl: "/assets/expert-avatar-3.webp", 
    online: false,
    bio: 'Giúp các ông bố tìm thấy sự hài hòa giữa sự nghiệp và gia đình là đam mê của tôi. Hãy cùng nhau tìm giải pháp nhé.',
    phone: '0903 456 789',
    email: 'cn.duc@dadmind.com'
  },
];

const ExpertCard: React.FC<{ expert: Expert; onSelectExpert: (expert: Expert) => void }> = ({ expert, onSelectExpert }) => {
  return (
    <div className="bg-brand-bg-card p-5 rounded-xl shadow-card border border-brand-border/70 flex flex-col items-center text-center transform transition-all duration-200 hover:shadow-interactive-lg hover:scale-[1.02] hover:border-brand-primary/70">
      <img 
        src={expert.avatarUrl} 
        alt={expert.name} 
        className="w-24 h-24 rounded-full mb-4 shadow-lg border-3 border-white object-cover"
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/96/E8F0F9/4A55A2?text=${expert.name.substring(0,1).toUpperCase()}`;
            target.alt = `${expert.name} placeholder avatar`;
        }}
      />
      <h3 className="text-lg font-semibold text-brand-dark-text mb-1.5">{expert.name}</h3>
      <span className="inline-block bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-xs font-semibold mb-3 tracking-wide uppercase shadow-sm">
        {expert.specialty}
      </span>
      <div className="flex items-center my-2">
        <span className={`w-3 h-3 rounded-full mr-2 ${expert.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
        <p className={`text-xs font-semibold ${expert.online ? 'text-green-600' : 'text-gray-500'}`}>
          {expert.online ? 'Đang trực tuyến' : 'Ngoại tuyến'}
        </p>
      </div>
      <p className="text-xs text-brand-light-text mb-4 h-16 overflow-hidden line-clamp-3">{expert.bio}</p>
      <StyledButton 
        onClick={() => onSelectExpert(expert)}
        disabled={!expert.online}
        size="sm"
        fullWidth
        className="mt-auto" 
      >
        {expert.online ? 'Chat ngay' : 'Hiện không trực tuyến'}
      </StyledButton>
    </div>
  );
};


export const ContactExpertPage: React.FC = () => {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isExpertReplying, setIsExpertReplying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onlineExperts = mockExperts.filter(e => e.online);
  const offlineExperts = mockExperts.filter(e => !e.online);


  useEffect(() => {
    if (selectedExpert) {
      setMessages([
        {
          id: 'expert-intro',
          text: `Xin chào bạn, tôi là ${selectedExpert.name}. Rất vui được lắng nghe và hỗ trợ bạn. Bạn có thể bắt đầu chia sẻ vấn đề hoặc câu hỏi của mình.`,
          sender: 'expert',
          timestamp: Date.now(),
          avatar: selectedExpert.avatarUrl,
        }
      ]);
    } else {
      setMessages([]); 
    }
  }, [selectedExpert]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectExpert = (expert: Expert) => {
    setSelectedExpert(expert);
  };

  const handleBackToExpertList = () => {
    setSelectedExpert(null);
  };

  const handleSend = () => {
    if (!input.trim() || !selectedExpert) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
      avatar: USER_AVATAR_URL,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsExpertReplying(true);

    setTimeout(() => {
      const expertReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Cảm ơn bạn đã chia sẻ. Tôi đang xem xét thông tin bạn cung cấp và sẽ phản hồi sớm nhất có thể. Bạn có muốn bổ sung thêm điều gì không?",
        sender: 'expert',
        timestamp: Date.now(),
        avatar: selectedExpert.avatarUrl,
      };
      setMessages(prev => [...prev, expertReply]);
      setIsExpertReplying(false);
    }, 2000 + Math.random() * 1500);
  };
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected for expert chat:", file.name);
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Đã đính kèm: ${file.name} (Tính năng tải file đang được phát triển)`,
        sender: 'user',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, fileMessage]);
    }
  };

  if (!selectedExpert) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark-text text-center mb-4">Kết nối với Chuyên Gia</h1>
        <p className="text-center text-brand-light-text mb-10">Chọn một chuyên gia đang trực tuyến để bắt đầu cuộc trò chuyện của bạn.</p>
        
        {onlineExperts.length > 0 && (
          <>
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-green-600 inline-block">Đang trực tuyến</h2>
            </div>
            <div className="w-24 h-0.5 bg-green-500/50 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {onlineExperts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} onSelectExpert={handleSelectExpert} />
              ))}
            </div>
          </>
        )}

        {offlineExperts.length > 0 && (
           <>
             <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-gray-500 inline-block">Hiện không trực tuyến</h2>
             </div>
             <div className="w-24 h-0.5 bg-gray-500/50 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
              {offlineExperts.map(expert => (
                <ExpertCard key={expert.id} expert={expert} onSelectExpert={handleSelectExpert} />
              ))}
            </div>
           </>
        )}
         {onlineExperts.length === 0 && offlineExperts.length === 0 && (
            <p className="text-center text-brand-light-text py-10">Hiện tại không có chuyên gia nào. Vui lòng quay lại sau.</p>
        )}
      </div>
    );
  }

  // Chat View
  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto bg-brand-bg-card p-4 sm:p-6 rounded-xl shadow-card min-h-[calc(100vh-15rem)]">
      {/* Chat Area */}
      <div className="flex-grow flex flex-col h-[calc(100vh-18rem)] sm:h-[calc(100vh-17rem)] lg:min-h-[calc(100vh-20rem)] lg:max-h-[calc(100vh-20rem)]">
        <div className="flex items-center justify-between mb-4 border-b border-brand-border pb-3">
            <StyledButton 
                variant="subtle" 
                size="sm" 
                onClick={handleBackToExpertList}
                leftIcon={<IconChevronLeft className="w-5 h-5"/>}
                className="!px-3 !py-1.5"
                aria-label="Quay lại danh sách chuyên gia"
            >
                Chọn chuyên gia khác
            </StyledButton>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-dark-text text-right">
              Chat với: <span className="text-brand-primary">{selectedExpert.name}</span>
            </h2>
        </div>
        <div className="flex-grow overflow-y-auto p-1 sm:p-4 space-y-1 bg-brand-bg-subtle/60 rounded-lg mb-4 custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isExpertReplying && (
            <div className="flex items-end space-x-3 my-3">
              <img 
                src={selectedExpert.avatarUrl} 
                alt={`${selectedExpert.name} avatar loading`}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/36/E8F0F9/4A55A2?text=${selectedExpert.name.substring(0,1).toUpperCase()}`;
                    target.alt = `${selectedExpert.name} placeholder avatar`;
                }}
              />
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-border">
                <LoadingIcon size="sm" color="text-brand-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-auto flex items-center gap-2 p-2.5 border-t border-brand-border bg-brand-bg-card/70 rounded-b-lg">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,application/pdf,.doc,.docx"
          />
          <button 
            onClick={handleFileUploadClick}
            className="p-2.5 text-brand-light-text hover:text-brand-primary rounded-full hover:bg-brand-primary/10 transition-colors disabled:opacity-50"
            aria-label="Attach file"
            title="Đính kèm tệp (Tính năng đang phát triển)"
            disabled={isExpertReplying}
          >
            <IconPaperClip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isExpertReplying && handleSend()}
            placeholder={`Nhập tin nhắn cho ${selectedExpert.name}...`}
            className="flex-grow p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm placeholder-gray-500 disabled:bg-gray-100"
            disabled={isExpertReplying}
            aria-label={`Message to ${selectedExpert.name}`}
          />
          <StyledButton 
            onClick={handleSend} 
            className="!p-3 !rounded-lg" 
            disabled={!input.trim() || isExpertReplying}
            aria-label={`Send message to ${selectedExpert.name}`}
          >
            <IconSend className="w-5 h-5" />
          </StyledButton>
        </div>
      </div>

      {/* Sidebar with Selected Expert Info */}
      <div className="lg:w-2/5 xl:w-1/3 p-4 sm:p-5 bg-brand-bg-light rounded-lg flex flex-col shadow-sm border border-brand-border/50">
        <div className="text-center mb-6 pb-6 border-b border-brand-border/70">
          <img 
            src={selectedExpert.avatarUrl} 
            alt={selectedExpert.name} 
            className="w-28 h-28 mx-auto rounded-full mb-4 shadow-xl border-4 border-white object-cover"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/112/E8F0F9/4A55A2?text=${selectedExpert.name.substring(0,1).toUpperCase()}`;
                target.alt = `${selectedExpert.name} placeholder avatar`;
            }}
          />
          <h3 className="text-xl font-semibold text-brand-dark-text">{selectedExpert.name}</h3>
          <span className="inline-block bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-xs font-semibold mt-1.5 tracking-wide uppercase shadow-sm">
            {selectedExpert.specialty}
         </span>
        </div>
        
        <div className="space-y-3 mb-6">
            {selectedExpert.phone && (
                 <div className="p-3.5 bg-brand-bg-card rounded-lg shadow-sm border border-brand-border/70">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Số điện thoại</p>
                    <p className="text-sm text-brand-dark-text font-medium">{selectedExpert.phone}</p>
                </div>
            )}
            {selectedExpert.email && (
                <div className="p-3.5 bg-brand-bg-card rounded-lg shadow-sm border border-brand-border/70">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                    <p className="text-sm text-brand-dark-text font-medium">{selectedExpert.email}</p>
                </div>
            )}
            {selectedExpert.bio && (
                 <div className="p-3.5 bg-brand-bg-card rounded-lg shadow-sm border border-brand-border/70">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Giới thiệu</p>
                    <p className="text-sm text-brand-light-text">{selectedExpert.bio}</p>
                </div>
            )}
             <p className="text-xs text-center text-gray-400 mt-2">Thông tin liên hệ được cung cấp để tham khảo. Cuộc trò chuyện chính diễn ra tại đây.</p>
        </div>
        
        <div className="mt-auto pt-6 border-t border-brand-border/70">
            <p className="text-xs text-brand-light-text text-center">
                Mọi thông tin trao đổi với chuyên gia đều được bảo mật.
            </p>
        </div>
      </div>
    </div>
  );
};
    