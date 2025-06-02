
import { SharedStory, StoryComment } from '../types';
import { USER_AVATAR_URL } from '../constants'; // For a generic user avatar

const generateRandomAvatars = (count: number): string[] => {
    const avatars: string[] = [];
    const initials = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const colors = ["7F5283", "4A55A2", "E178C5", "2C3333", "A27B5C"]; // brand-accent, primary, secondary, dark-text, custom
    for(let i = 0; i < count; i++) {
        if (Math.random() < 0.3 && i > 0) { // Some chance of reusing generic user avatar
             avatars.push(USER_AVATAR_URL);
        } else {
            const char = initials[Math.floor(Math.random() * initials.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            avatars.push(`https://via.placeholder.com/30/${color}/FFFFFF?text=${char}`);
        }
    }
    return avatars;
}

const mockCommentsStory1: StoryComment[] = [
  {
    id: 'comment-s1-1',
    authorName: 'Bố Bon',
    avatarUrl: 'https://via.placeholder.com/30/4A55A2/FFFFFF?text=BB',
    content: 'Đồng cảm với bố Gấu! Những đêm như vậy thật sự thử thách nhưng cũng đầy ý nghĩa. Cố lên!',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
  },
  {
    id: 'comment-s1-2',
    authorName: 'Mẹ Kem',
    avatarUrl: 'https://via.placeholder.com/30/E178C5/FFFFFF?text=MK',
    content: 'Cố lên hai bố mẹ! Sức khỏe của con là trên hết. Gửi ngàn yêu thương <3',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
  }
];

const mockCommentsStory4: StoryComment[] = [
  {
    id: 'comment-s4-1',
    authorName: 'Bố Su',
    content: 'Chúc mừng gia đình Papa Tít nhé! Bé giỏi quá.',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
  }
];


export const mockCommunityStories: SharedStory[] = [
  {
    id: 'story1',
    content: "Đêm qua con sốt, cả đêm hai vợ chồng thay nhau trông. Mệt nhưng nhìn con ngủ lại thấy thương. Làm bố thật nhiều cảm xúc!",
    authorName: 'Bố Gấu',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    avatarUrl: 'https://via.placeholder.com/40/7F5283/FFFFFF?text=BG',
    likes: Math.floor(Math.random() * 50) + 5,
    likedByAvatars: generateRandomAvatars(Math.floor(Math.random() * 4) + 1), // 1 to 4 avatars
    comments: mockCommentsStory1,
  },
  {
    id: 'story2',
    content: "Lần đầu đưa con đi công viên, thấy nó cười toe toét chạy nhảy mà lòng mình vui không tả. Khoảnh khắc đơn giản mà ý nghĩa.",
    authorName: 'Ba Bin',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    avatarUrl: USER_AVATAR_URL,
    likes: Math.floor(Math.random() * 80) + 10,
    likedByAvatars: generateRandomAvatars(Math.floor(Math.random() * 3) + 1),
    comments: [],
  },
  {
    id: 'story3',
    content: "Dạo này công việc áp lực quá, về nhà nhiều khi cáu gắt với vợ con. Đọc được chia sẻ của mọi người thấy mình cần thay đổi. Cảm ơn DadMind!",
    authorName: 'Một người cha',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    likes: Math.floor(Math.random() * 30) + 2,
    likedByAvatars: generateRandomAvatars(Math.floor(Math.random() * 2) + 1),
    comments: [],
  },
  {
    id: 'story4',
    content: "Hôm nay con gái khoe được điểm 10 môn Toán. Cảm giác tự hào lắm các bố ạ. Phần thưởng là cuối tuần cả nhà đi ăn kem!",
    authorName: 'Papa Tít',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    avatarUrl: 'https://via.placeholder.com/40/4A55A2/FFFFFF?text=PT',
    likes: Math.floor(Math.random() * 100) + 15,
    likedByAvatars: generateRandomAvatars(Math.floor(Math.random() * 5) + 2),
    comments: mockCommentsStory4,
  },
  {
    id: 'story5',
    content: "Con trai bắt đầu vào tuổi teen, nói chuyện khó hơn hẳn. Có bố nào có kinh nghiệm chia sẻ không ạ?",
    authorName: 'Dad Of Teen',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    avatarUrl: USER_AVATAR_URL,
    likes: Math.floor(Math.random() * 60) + 8,
    likedByAvatars: generateRandomAvatars(Math.floor(Math.random() * 3)),
    comments: [],
  },
  {
    id: 'story6',
    content: "Mới đón bé đầu lòng, còn nhiều bỡ ngỡ nhưng cũng đầy hạnh phúc. Chúc các bố luôn vững vàng nhé!",
    authorName: 'New Dad',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    likes: Math.floor(Math.random() * 120) + 20,
    likedByAvatars: generateRandomAvatars(Math.floor(Math.random() * 4) + 1),
    comments: [],
  },
];

// Short snippets for providing context to AI about the *type* of stories available
export const mockCommunityStoriesShortSnippetsForAI: string[] = mockCommunityStories
    .slice(0, 4) // Take first 4-5 for brevity
    .map(story => {
        const shortContent = story.content.length > 70 ? story.content.substring(0, 70) + "..." : story.content;
        return `'${shortContent}' (bởi ${story.authorName})`;
    });
