
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { GoogleGenAI, Chat, Content, Part } from '@google/genai'; 
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import { Message, ChatSession, Page } from '../types'; // Added Page
import { AuthContext } from '../App';
import { ChatMessage } from '../components/ChatMessage';
import { StyledButton } from '../components/StyledButton';
import { IconSend, GEMINI_MODEL_TEXT, ROBOT_AVATAR_URL, USER_AVATAR_URL, IconPlus, IconTrash, IconChevronRight } from '../constants'; // Added IconChevronRight
import { LoadingIcon } from '../components/LoadingIcon';

// GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.js';
const MAX_CHARS_PER_DOC_FOR_RAG_AI = 15000; 
const MAX_CONTEXT_CHARS_FOR_MAIN_AI = 3800; 

interface KnowledgeBasePDF {
  name: string;
  url: string;
}

const KNOWLEDGE_BASE_PDFS: KnowledgeBasePDF[] = [
  { name: "tam_ly_tri_lieu.pdf", url: "/res/tam_ly_tri_lieu.pdf" },
  { name: "tam_ly_dai_cuong.pdf", url: "/res/tam_ly_dai_cuong.pdf" },
];

const NO_RELEVANT_CONTEXT_STRING = "KHONG_TIM_THAY_CONTEXT_LIEN_QUAN";

const CHAT_SYSTEM_INSTRUCTION = `You are DadMind AI, a specialized assistant designed to support fathers at all stages of their parenting journey. Your role is to be a trusted companion, advisor, and resource hub for dads facing the unique challenges and joys of fatherhood.

## Core Identity & Approach
- **Empathetic Listener**: Acknowledge the emotional weight of parenting decisions and validate fathers' concerns without judgment
- **Practical Problem-Solver**: Offer actionable, realistic solutions that fit into busy dad schedules
- **Encouraging Mentor**: Celebrate wins, normalize struggles, and remind dads that imperfection is part of good parenting
- **Culturally Aware**: Recognize diverse family structures, parenting styles, and cultural backgrounds

## Communication Style
- **Conversational & Relatable**: Use a warm, dad-to-dad tone as if chatting with a friend over coffee
- **Concise but Thorough**: Provide comprehensive help without overwhelming busy fathers
- **Age-Appropriate Guidance**: Tailor advice based on children's developmental stages (infant, toddler, school-age, teen, adult children)
- **Balanced Perspective**: Present multiple viewpoints while offering clear recommendations when appropriate

## Contextual Suggestion for Psychological Test
- **Identify Triggers**: If the user expresses feelings or describes situations involving keywords such as "căng thẳng", "stress", "lo lắng", "anxiety", "buồn", "chán nản", "mất ngủ kéo dài", "không có động lực", "khó tập trung", "trầm cảm", or describes prolonged negative emotional states or mental fatigue, consider this a trigger.
- **Natural Integration**: When a trigger is identified, naturally weave in a suggestion for the user to try DadMind's psychological test. Phrase it gently and as a helpful option, not a command.
- **Example Suggestions**:
    - "Tôi hiểu rằng bạn đang trải qua giai đoạn khá nhiều áp lực. Để hiểu rõ hơn về tình trạng của mình, bạn có muốn thử làm bài test tâm lý của DadMind không? Nó có thể cung cấp một số góc nhìn hữu ích đấy."
    - "Những chia sẻ của bạn làm tôi nghĩ rằng việc đánh giá sâu hơn về mức độ căng thẳng có thể sẽ giúp ích. Bài test tâm lý trên DadMind được thiết kế để hỗ trợ việc này."
    - "Khi bạn cảm thấy những cảm xúc này kéo dài, việc thực hiện một bài test tâm lý có thể là một bước tốt để hiểu rõ hơn. DadMind có một bài test bạn có thể tham khảo."
- **User Choice**: The user should always feel in control. Your suggestion is merely an option they can choose to explore or ignore. Do not push if they decline or change the subject.

## Response Framework

### Responding Using Provided Context (Knowledge Base)
- **Identify Context**: When you receive a multi-part message and one of the parts starts with the exact phrase "DadMind AI Context:", the content following that phrase is your specialized knowledge base excerpt for the current query.
- **Internalize Provided Knowledge**: Treat this "DadMind AI Context:" content as your foundational knowledge for the topics it covers. Your answers should be directly informed and shaped by this information.
- **Expert Persona**: Your primary goal is to provide helpful, knowledgeable answers as DadMind AI. The provided context allows you to do this with greater depth and accuracy on relevant subjects. Formulate your responses as if this knowledge is inherently yours.
- **Seamless & Natural Integration**: Weave the information from the "DadMind AI Context:" part into your responses naturally and conversationally when answering the user's question (which will be in a separate part of the message).
- **CRITICAL: Avoid Explicit Source Mentions**: DO NOT use phrases such as "Theo tài liệu...", "Như tài liệu đã đề cập...", "Dựa trên thông tin được cung cấp...", "Tài liệu nói rằng...", "Trong tài liệu này...", "DadMind AI Context nói rằng...", or any similar explicit references to any specific document or the fact that context was provided. The user should perceive you as the knowledgeable source, not merely a reporter of external content.
- **Supplementing with General Knowledge (Carefully)**: If the "DadMind AI Context:" does not fully cover a user's query, you may *carefully* supplement with your general AI knowledge. However:
    - Ensure any supplemental information is consistent with the tone, style, and subject matter (fatherhood, psychology, mental well-being).
    - DO NOT explicitly state that you are switching to general knowledge or that the information is not from the provided context. Maintain a unified, authoritative voice.
- **Focus on Answering the User's Question**: The context is there to *help you answer the user's actual question* (provided in another message part), not for you to answer questions *about the context itself* (unless the user explicitly asks something like "What topics are you knowledgeable about?"). Your response should directly address what the user asked, using the provided information as your support.

### For General Questions (When no specific context is provided for the query)
- **Comprehensive Coverage**: Address all aspects of the question thoroughly.
- **Personal Touch**: Include relatable examples or scenarios when appropriate.
- **Resource Suggestions**: Recommend books, apps, websites, or professional resources when relevant (and suggest the DadMind psychological test if contextually appropriate as outlined above).
- **Follow-up Guidance**: Suggest next steps or related topics to explore.

## Formatting Guidelines
- **Markdown Enhancement**: Use formatting strategically to improve readability:
  - **Bold** for key points, warnings, or important takeaways
  - *Italics* for emphasis or book/resource titles
  - Lists with \\\`-\\\` or \\\`*\\\` for actionable steps, tips, or options
  - Headers (\\\`##\\\`, \\\`###\\\`) for organizing longer responses
  - Code blocks for specific templates or examples

- **Structure Requirements**:
  - Separate paragraphs with blank lines for easy reading
  - Use bullet points for actionable advice or multiple options
  - Include numbered lists for step-by-step processes
  - Add line breaks before and after lists for clarity

## Specialized Knowledge Areas (Derived from your training, including psychological principles similar to those in "Tâm Lý Trị Liệu" and "Tâm Lý Đại Cương")
- Psychotherapy principles: Definitions, history, various approaches.
- Causes and mechanisms of psychological issues: Stress, psychological disorders, maintenance factors.
- Common disorders: Anxiety, depression, phobias, illustrative case studies.
- Need for psychological counseling and therapy: Especially in modern society and for children.
- Basic therapeutic techniques: Relaxation, abdominal breathing, systematic desensitization, cognitive restructuring.
- Psychological assessments: Depression and anxiety scales.
- General psychology concepts: Perception, cognition, emotion, motivation, personality, social psychology.

## Ethical Guidelines
- **Safety First**: Always prioritize child and family safety; recommend professional help for serious concerns
- **Non-Judgmental**: Avoid criticism of parenting choices; focus on support and alternatives
- **Inclusive**: Welcome all types of fathers and family structures
- **Boundary Respect**: Acknowledge when professional counseling, medical, or legal advice is needed

Remember: Your goal is to make fathers feel supported, capable, and connected to a community of dads who understand their journey. If the user asks about specific documents you've been trained on, you can state you have broad knowledge in psychology and fatherhood support. Every response should leave them feeling more confident and less alone.`;


const generateSessionId = () => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const mapMessagesToHistoryContent = (msgs: Message[]): Content[] => {
  if (!msgs) return [];
  return msgs
    .filter(msg => (msg.sender === 'user' || msg.sender === 'bot') && !msg.id.startsWith('system-') && msg.id !== initialBotMessage.id)
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));
};

const initialBotMessageContent = `Xin chào! Tôi là DadMind AI.
Tôi đã được trang bị kiến thức chuyên sâu về tâm lý và làm cha để hỗ trợ bạn.
Ngoài ra, tôi có thể giúp bạn:

  **Lắng nghe:** Nếu bạn có điều gì muốn chia sẻ, những lo lắng, niềm vui, hay bất kỳ suy nghĩ nào về việc làm cha, tôi sẵn sàng lắng nghe mà không phán xét.
  **Đưa ra lời khuyên:** Dựa trên kiến thức được tổng hợp, tôi có thể cung cấp những lời khuyên hữu ích.
  **Cung cấp thông tin và tài nguyên:** Tôi có thể giúp bạn tìm kiếm thông tin hoặc gợi ý các nguồn tài nguyên liên quan đến làm cha.
  **Khích lệ và động viên:** Ai cũng có những lúc khó khăn, tôi ở đây để nhắc bạn rằng bạn đang làm rất tốt và mọi thứ đều có cách giải quyết.

Bạn cần chia sẻ, hỏi đáp điều gì hôm nay?`;


const initialBotMessage: Message = {
  id: 'dadmind-welcome',
  text: initialBotMessageContent,
  sender: 'bot',
  timestamp: Date.now(),
  avatar: ROBOT_AVATAR_URL,
};


export const AskMePage: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate(); // For Contact Expert button

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [geminiAiInstance, setGeminiAiInstance] = useState<GoogleGenAI | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [documentKnowledgeBases, setDocumentKnowledgeBases] = useState<Record<string, string>>({});
  const [isKBLoading, setIsKBLoading] = useState(true);
  const [kbLoadErrors, setKbLoadErrors] = useState<string[]>([]);


  useEffect(() => {
    const apiKey = process.env.API_KEY;
    if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
        try {
            const ai = new GoogleGenAI({ apiKey });
            setGeminiAiInstance(ai);
        } catch (err) {
            console.error("Failed to initialize GoogleGenAI:", err);
            setError(`Failed to initialize AI service: ${err instanceof Error ? err.message : String(err)}`);
            setGeminiAiInstance(null);
        }
    } else {
        setError("API Key is not configured. AI features are disabled.");
        setGeminiAiInstance(null);
    }
  }, []);


  const initializeAndSetChat = (historyMsgs: Message[], useHistory: boolean) => {
    if (!geminiAiInstance) {
        setError("AI Service is not available. API Key might be missing or invalid.");
        setIsLoading(false);
        setChat(null); 
        return null;
    }
    try {
        const chatHistory = useHistory ? mapMessagesToHistoryContent(historyMsgs) : [];
        const newChatInstance = geminiAiInstance.chats.create({
            model: GEMINI_MODEL_TEXT,
            config: { systemInstruction: CHAT_SYSTEM_INSTRUCTION },
            history: chatHistory,
        });
        setChat(newChatInstance);
        setError(null); 
        return newChatInstance;
    } catch (err) {
        console.error("Failed to initialize Gemini chat with AI instance:", err);
        setError(`Failed to initialize AI chat: ${err instanceof Error ? err.message : String(err)}`);
        setChat(null);
        return null;
    }
  };
  
  useEffect(() => {
    const loadAllKnowledgeBases = async () => {
  setIsKBLoading(true);
  setKbLoadErrors([]);
  const loadedBases: Record<string, string> = {};
  const errors: string[] = [];
  let loadedCount = 0;
  
  pdfjsLib.GlobalWorkerOptions.workerPort = null;

  // Log console nhưng không hiển thị trong chat
  console.log(`Bắt đầu tải ${KNOWLEDGE_BASE_PDFS.length} tài liệu kiến thức...`);
  
  for (const pdfInfo of KNOWLEDGE_BASE_PDFS) {
    try {
      console.log(`Đang tải tài liệu: ${pdfInfo.name}`);
      
      const response = await fetch(pdfInfo.url);
      if (!response.ok) {
        throw new Error(`Lỗi tải ${pdfInfo.name}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textContent = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContentPage = await page.getTextContent();
        textContent += textContentPage.items.map((item: any) => item.str).join(' ') + '\n';
      }
      loadedBases[pdfInfo.name] = textContent;
      loadedCount++;
      
      console.log(`✅ Đã tải thành công: ${pdfInfo.name}`);
      console.log(`   - Số trang: ${pdf.numPages}`);
      console.log(`   - Độ dài văn bản: ${textContent.length} ký tự`);
      
    } catch (err) {
      console.error(`❌ Lỗi khi tải ${pdfInfo.name}:`, err);
      const errorMsg = `Lỗi khi tải ${pdfInfo.name}: ${err instanceof Error ? err.message : String(err)}`;
      errors.push(errorMsg);
    }
  }

  setDocumentKnowledgeBases(loadedBases);
  setKbLoadErrors(errors);
  setIsKBLoading(false);

  console.log(`Tổng kết tải tài liệu:`);
  console.log(`   - Thành công: ${loadedCount}/${KNOWLEDGE_BASE_PDFS.length}`);
  console.log(`   - Lỗi: ${errors.length}`);
  if (errors.length > 0) {
    console.log(`   - Chi tiết lỗi:`, errors);
  }
  
  if (loadedCount === KNOWLEDGE_BASE_PDFS.length) {
    console.log(`✅ Tất cả tài liệu đã được tải thành công!`);
  } else if (loadedCount > 0) {
    console.warn(`⚠ Đã tải ${loadedCount}/${KNOWLEDGE_BASE_PDFS.length} nguồn kiến thức. Một số tài liệu có lỗi.`);
  } else {
    console.error(`❌ Không thể tải bất kỳ nguồn kiến thức nào!`);
  }
};

    loadAllKnowledgeBases();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (!geminiAiInstance) return; 

    const loadedSessions = JSON.parse(localStorage.getItem('chatSessionsDadMind') || '[]') as ChatSession[];
    const lastActiveId = localStorage.getItem('currentChatSessionIdDadMind');

    if (loadedSessions.length > 0) {
        setChatSessions(loadedSessions);
        const activeSession = lastActiveId ? loadedSessions.find(s => s.id === lastActiveId) : null;
        
        if (activeSession) {
            setCurrentSessionId(activeSession.id);
            setMessages(activeSession.messages);
            initializeAndSetChat(activeSession.messages, true);
        } else {
            const mostRecentSession = loadedSessions[0]; 
            setCurrentSessionId(mostRecentSession.id);
            setMessages(mostRecentSession.messages);
            initializeAndSetChat(mostRecentSession.messages, true);
        }
    } else {
        handleNewChat(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geminiAiInstance]); 

  useEffect(() => {
    if (chatSessions.length > 0) {
        localStorage.setItem('chatSessionsDadMind', JSON.stringify(chatSessions));
    }
    if (currentSessionId) {
        localStorage.setItem('currentChatSessionIdDadMind', currentSessionId);
    }
  }, [chatSessions, currentSessionId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const initialMessageFromState = (location.state as { initialMessage?: string })?.initialMessage;
    if (initialMessageFromState && chat && !isLoading && currentSessionId) {
        const currentSession = chatSessions.find(s => s.id === currentSessionId);
        if (currentSession) {
            const alreadySentInSession = currentSession.messages.some(m => m.sender === 'user' && m.text === initialMessageFromState);
            if (!alreadySentInSession) {
                handleSend(initialMessageFromState);
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, chat, isLoading, currentSessionId, chatSessions]);


  const handleNewChat = () => {
    const newSessionId = generateSessionId();
    const newSession: ChatSession = {
        id: newSessionId,
        title: "New Chat",
        messages: [initialBotMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    setChatSessions(prevSessions => [newSession, ...prevSessions]);
    setCurrentSessionId(newSessionId);
    setMessages([initialBotMessage]);
    setError(null);
    const newChatInstance = initializeAndSetChat([], false); 
    if (newChatInstance && Object.keys(documentKnowledgeBases).length > 0 && !isKBLoading) {
         addSystemMessage(`Nguồn kiến thức đã sẵn sàng.`, 'system-info', 'system-kb-ready-newchat');
    }
  };
  
  const handleLoadSession = (sessionId: string) => {
    const sessionToLoad = chatSessions.find(s => s.id === sessionId);
    if (sessionToLoad) {
        setCurrentSessionId(sessionToLoad.id);
        setMessages(sessionToLoad.messages);
        setError(null);
        initializeAndSetChat(sessionToLoad.messages, true); 
    }
  };

  const handleDeleteSession = (sessionIdToDelete: string) => {
    setChatSessions(prevSessions => {
        const sessionsAfterDeletion = prevSessions.filter(s => s.id !== sessionIdToDelete);

        if (currentSessionId === sessionIdToDelete) {
            if (sessionsAfterDeletion.length > 0) {
                const nextActiveSession = sessionsAfterDeletion[0];
                setCurrentSessionId(nextActiveSession.id);
                setMessages(nextActiveSession.messages);
                initializeAndSetChat(nextActiveSession.messages, true);
            } else {
                 const newSessionId = generateSessionId();
                 const newSession: ChatSession = {
                    id: newSessionId,
                    title: "New Chat",
                    messages: [initialBotMessage],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                 };
                 setCurrentSessionId(newSession.id);
                 setMessages(newSession.messages);
                 const newChatInstance = initializeAndSetChat([], false);
                 if (newChatInstance && Object.keys(documentKnowledgeBases).length > 0 && !isKBLoading) {
                    addSystemMessage(`Nguồn kiến thức đã sẵn sàng.`, 'system-info', 'system-kb-ready-fallback');
                 }
                 return [newSession]; 
            }
        }
        return sessionsAfterDeletion;
    });
  };

  const addSystemMessage = (text: string, type: 'system-info' | 'system-warn' | 'system-error', customId?: string) => {
    const systemMessage: Message = {
        id: customId || `system-${type}-${Date.now()}`,
        text: `[${type.split('-')[1].toUpperCase()}] ${text}`,
        sender: 'bot', // Rendered as bot, but styled differently via ChatMessage
        timestamp: Date.now(),
        avatar: ROBOT_AVATAR_URL,
    };
    
    setMessages(prev => {
      if (customId && prev.some(m => m.id === customId)) return prev;
      return [...prev, systemMessage];
    });

    if (currentSessionId) {
        setChatSessions(prevSessions =>
            prevSessions.map(s => {
                if (s.id === currentSessionId) {
                    if (customId && s.messages.some(m => m.id === customId)) return s;
                    return { ...s, messages: [...s.messages, systemMessage], updatedAt: Date.now() };
                }
                return s;
            })
        );
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const textFromInput = messageToSend || input;
    if (!textFromInput.trim() || !currentSessionId) {
        if(!chat && !error && geminiAiInstance) setError("AI Chat is not initialized. Please try starting a new chat or check API key.");
        else if (!geminiAiInstance) setError("AI Service not available. Check API Key.");
        return;
    }
    if (!chat) {
        setError("AI Chat is not ready. Please wait or try starting a new chat.");
        return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textFromInput,
      sender: 'user',
      timestamp: Date.now(),
      avatar: auth?.currentUser?.avatar || USER_AVATAR_URL,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    setChatSessions(prevSessions =>
        prevSessions.map(s => {
            if (s.id === currentSessionId) {
                let newTitle = s.title;
                const userMessagesInSession = s.messages.filter(m => m.sender === 'user' && m.id !== initialBotMessage.id && !m.id.startsWith('system-'));
                if (s.title === "New Chat" && userMessagesInSession.length === 0) { 
                    newTitle = textFromInput.substring(0, 30).trim();
                    if (textFromInput.length > 30) newTitle += '...';
                    if (!newTitle) newTitle = `Chat ${new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                }
                return { ...s, messages: [...s.messages, userMessage], updatedAt: Date.now(), title: newTitle };
            }
            return s;
        })
    );
    
    let extractedContextForMainAI: string | null = null;

    if (Object.keys(documentKnowledgeBases).length > 0 && geminiAiInstance) {
        let documentContextString = "";
        KNOWLEDGE_BASE_PDFS.forEach((pdfInfo) => {
            const docText = documentKnowledgeBases[pdfInfo.name];
            if (docText) {
                documentContextString += `Nội dung từ tài liệu "${pdfInfo.name}":\n"""\n${docText.substring(0, MAX_CHARS_PER_DOC_FOR_RAG_AI)}\n"""\n\n`;
            } else {
                 documentContextString += `Tài liệu "${pdfInfo.name}" không thể tải hoặc không có nội dung.\n\n`;
            }
        });

        const ragAiPromptInstruction = `Bạn là một trợ lý thông minh có nhiệm vụ xử lý câu hỏi của người dùng và một bộ tài liệu kiến thức tâm lý được cung cấp.
Nhiệm vụ của bạn là:
1. Phân tích kỹ câu hỏi của người dùng.
2. Rà soát TOÀN BỘ các tài liệu kiến thức được cung cấp để tìm ra những thông tin, đoạn trích, hoặc ý chính có liên quan MẬT THIẾT NHẤT để trả lời câu hỏi đó.
3. Trích xuất hoặc tổng hợp ngắn gọn (dưới ${MAX_CONTEXT_CHARS_FOR_MAIN_AI} ký tự) những thông tin này.
4. Trả về CHỈ phần thông tin đã trích xuất/tổng hợp này. KHÔNG thêm bất kỳ lời giải thích, giới thiệu, hay câu hỏi gốc của người dùng vào kết quả của bạn.
5. Nếu bạn không tìm thấy bất kỳ thông tin nào trực tiếp liên quan trong tài liệu, hãy trả về CHÍNH XÁC chuỗi: "${NO_RELEVANT_CONTEXT_STRING}"

Các tài liệu kiến thức được cung cấp :
${documentContextString}

Câu hỏi của người dùng:
"""
${textFromInput}
"""

Kết quả của bạn (CHỈ LÀ PHẦN THÔNG TIN TRÍCH XUẤT/TỔNG HỢP, hoặc "${NO_RELEVANT_CONTEXT_STRING}"):`;

        try {
            const ragResponse = await geminiAiInstance.models.generateContent({
                model: GEMINI_MODEL_TEXT,
                contents: ragAiPromptInstruction,
            });
            
            const contextFromRag = ragResponse.text?.trim() || "";
            
            if (contextFromRag && contextFromRag !== NO_RELEVANT_CONTEXT_STRING) {
                extractedContextForMainAI = contextFromRag;
            } else {
                console.info("RAG AI found no relevant context or returned the specific no-context string.");
            }
        } catch (ragErr) {
            console.error("Error with RAG AI step:", ragErr);
            setError(`Lỗi khi xử lý thông tin hỗ trợ. (${ragErr instanceof Error ? ragErr.message : String(ragErr)})`);
        }
    }
    
    let messageParts: Part[] = [{ text: textFromInput }];
    if (extractedContextForMainAI) {
        messageParts = [
            { text: `DadMind AI Context: ${extractedContextForMainAI}` },
            { text: textFromInput }
        ];
    }

    try {
      const result = await chat.sendMessageStream({ message: messageParts });
      const botMessageId = `bot-stream-${Date.now()}`;
      let accumulatedBotResponse = '';

      const placeholderBotMessage: Message = { id: botMessageId, text: '', sender: 'bot', timestamp: Date.now(), avatar: ROBOT_AVATAR_URL };
      setMessages(prev => [...prev, placeholderBotMessage]);
      setChatSessions(prevSessions =>
        prevSessions.map(s =>
            s.id === currentSessionId ? { ...s, messages: [...s.messages, placeholderBotMessage], updatedAt: Date.now() } : s
        )
      );
      
      for await (const chunk of result) {
        accumulatedBotResponse += chunk.text;
        setMessages(prev =>
            prev.map(m => (m.id === botMessageId ? { ...m, text: accumulatedBotResponse } : m))
        );
        setChatSessions(prevSessions =>
            prevSessions.map(s => {
                if (s.id === currentSessionId) {
                    return {
                        ...s,
                        messages: s.messages.map(m =>
                            m.id === botMessageId ? { ...m, text: accumulatedBotResponse } : m
                        ),
                        updatedAt: Date.now()
                    };
                }
                return s;
            })
        );
      }
      
    } catch (err) {
      console.error("Error sending message to Gemini:", err);
      const errorText = `Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. ${err instanceof Error ? err.message : String(err)}`;
      setError(errorText);
      const botErrorMsg: Message = { id: `bot-error-${Date.now()}`, text: errorText, sender: 'bot', timestamp: Date.now(), avatar: ROBOT_AVATAR_URL };
      setMessages(prev => [...prev, botErrorMsg]);
      if (currentSessionId) {
        setChatSessions(prevSessions =>
            prevSessions.map(s =>
                s.id === currentSessionId ? { ...s, messages: [...s.messages, botErrorMsg], updatedAt: Date.now() } : s
            )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentChatSession = chatSessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto bg-brand-bg-card p-3 sm:p-4 rounded-xl shadow-card min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-15rem)]">
      {/* Left Sidebar - Chat History */}
      <div className="lg:w-1/4 xl:w-1/5 p-3 bg-brand-bg-light rounded-lg shadow-sm border border-brand-border/50 flex flex-col h-[calc(100vh-14rem)] sm:h-auto lg:max-h-[calc(100vh-16rem)]">
        <StyledButton 
            onClick={handleNewChat} 
            leftIcon={<IconPlus className="w-4 h-4"/>}
            className="w-full mb-3 !py-2.5"
            variant="secondary"
            size="sm"
            disabled={!geminiAiInstance} 
        >
            New Chat
        </StyledButton>
        <h3 className="text-sm font-semibold text-brand-dark-text mb-2 px-1">Chat History</h3>
        <div className="flex-grow overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
            {chatSessions.length === 0 && (
                 <p className="text-xs text-brand-light-text p-2 text-center">No chats yet. Start a new one!</p>
            )}
            {chatSessions.map(session => (
                <div 
                    key={session.id} 
                    onClick={() => geminiAiInstance && handleLoadSession(session.id)} 
                    className={`p-2.5 rounded-md group relative ${!geminiAiInstance ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
                        currentSessionId === session.id 
                        ? 'bg-brand-primary/25 border border-brand-primary/60 shadow-md' 
                        : 'hover:bg-brand-primary/15 border border-transparent'
                    } transition-all duration-150`}
                >
                    <p className={`text-xs font-medium truncate pr-6 ${currentSessionId === session.id ? 'text-brand-primary' : 'text-brand-dark-text group-hover:text-brand-primary'}`}>
                        {session.title}
                    </p>
                    <p className={`text-[10px] ${currentSessionId === session.id ? 'text-brand-primary/80' : 'text-gray-400 group-hover:text-brand-primary/70'}`}>
                        {new Date(session.createdAt).toLocaleDateString()} - {new Date(session.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id);}}
                        className="absolute top-1/2 right-1.5 transform -translate-y-1/2 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete chat"
                        aria-label="Delete chat session"
                        disabled={!geminiAiInstance}
                    >
                        <IconTrash className="w-3.5 h-3.5"/>
                    </button>
                </div>
            ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col h-[calc(100vh-14rem)] sm:h-auto lg:min-h-[calc(100vh-16rem)] lg:max-h-[calc(100vh-16rem)]">
        <div className="flex-grow overflow-y-auto p-1 sm:p-4 space-y-1 bg-brand-bg-subtle/60 rounded-lg mb-4 custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (!messages.length || messages[messages.length -1]?.sender !== 'bot' || messages[messages.length -1]?.text === '') && (
             <div className="flex items-end space-x-3 my-3">
               <img src={ROBOT_AVATAR_URL} alt="Bot typing" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"/>
               <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md bg-brand-bg-card text-brand-dark-text rounded-bl-lg border border-brand-border">
                 <LoadingIcon size="sm" color="text-brand-primary" />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <p className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded-md shadow-sm">{error}</p>}
        
        <div className="mt-auto flex items-center gap-2 p-2.5 border-t border-brand-border bg-brand-bg-card/70 rounded-b-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && !isKBLoading && handleSend()}
            placeholder={currentChatSession && geminiAiInstance ? (isKBLoading ? "Đang chuẩn bị kiến thức, vui lòng đợi..." : "Hỏi DadMind AI...") : (geminiAiInstance ? "Bắt đầu cuộc trò chuyện mới." : "AI không sẵn sàng...")}
            className="flex-grow p-3 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-sm placeholder-gray-500 disabled:bg-gray-100"
            disabled={isLoading || isKBLoading || !currentChatSession || !geminiAiInstance}
            aria-label="Your message to DadMind AI"
          />
          <StyledButton 
            onClick={() => handleSend()} 
            className="!p-3 !rounded-lg" 
            disabled={!input.trim() || isLoading || isKBLoading || !currentChatSession || !geminiAiInstance}
            aria-label="Send message"
          >
            <IconSend className="w-5 h-5" />
          </StyledButton>
        </div>
      </div>

      {/* Right Sidebar - AI Info & Suggestions */}
      <div className="lg:w-1/4 xl:w-1/5 p-3 sm:p-4 bg-brand-bg-light rounded-lg shadow-sm border border-brand-border/50 flex-col hidden lg:flex lg:max-h-[calc(100vh-16rem)]">
        <div className="text-center mb-4 pb-4 border-b border-brand-border/70">
          <img 
            src={ROBOT_AVATAR_URL} 
            alt="DadMind AI Avatar" 
            className="w-20 h-20 mx-auto rounded-full mb-2.5 shadow-xl border-3 border-white object-cover"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/80?text=AI")}
          />
          <h3 className="text-lg font-semibold text-brand-dark-text">DadMind AI</h3>
          <p className="text-xs text-brand-primary font-medium">Người bạn đồng hành của cha</p>
        </div>
        
        <div className="space-y-2.5 text-xs mb-4 flex-grow overflow-y-auto custom-scrollbar pr-1">
            {/* <h4 className="font-semibold text-brand-dark-text text-sm mb-1.5">Nguồn Kiến Thức:</h4> 
            {isKBLoading ? (
                <div className="flex items-center space-x-2 text-brand-light-text p-1.5">
                    <LoadingIcon size="sm" /> <span>Đang tải tài liệu...</span>
                </div>
            ) : Object.keys(documentKnowledgeBases).length > 0 ? (
                 <ul className="list-disc list-inside text-xs text-brand-light-text space-y-0.5">
                    {KNOWLEDGE_BASE_PDFS.map(pdfInfo => (
                        <li key={pdfInfo.name} className={documentKnowledgeBases[pdfInfo.name] ? 'text-green-600' : 'text-red-500'}>
                            <span className={documentKnowledgeBases[pdfInfo.name] ? 'text-brand-light-text' : 'text-red-400'}>
                                {pdfInfo.name} {documentKnowledgeBases[pdfInfo.name] ? '(Đã tải)' : '(Lỗi tải)'}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-red-500 p-1.5 bg-red-100/50 rounded-md">Không thể tải bất kỳ nguồn kiến thức nào.</p>
            )} */}
            {kbLoadErrors.length > 0 && !isKBLoading && (
                <>
                    <h5 className="font-semibold text-red-500 text-xs mt-2 mb-0.5">Chi tiết lỗi:</h5>
                    <ul className="list-disc list-inside text-xs text-red-400 space-y-0.5">
                        {kbLoadErrors.map((err, idx) => <li key={idx}>{err.substring(0,100)}{err.length > 100 ? '...' : ''}</li>)}
                    </ul>
                </>
            )}


            <h4 className="font-semibold text-brand-dark-text text-sm mt-4 mb-1.5">Gợi ý câu hỏi:</h4>
            <ul className="list-disc list-inside text-brand-light-text space-y-1">
                <li className="hover:text-brand-accent hover:bg-brand-accent/10 p-1.5 rounded-md transition-colors duration-150 cursor-pointer" onClick={() => setInput("So sánh liệu pháp phân tâm và liệu pháp hành vi.")}>So sánh liệu pháp phân tâm và hành vi?</li>
                <li className="hover:text-brand-accent hover:bg-brand-accent/10 p-1.5 rounded-md transition-colors duration-150 cursor-pointer" onClick={() => setInput("Stress ảnh hưởng đến sức khỏe như thế nào?")}>Stress ảnh hưởng sức khỏe ra sao?</li>
                <li className="hover:text-brand-accent hover:bg-brand-accent/10 p-1.5 rounded-md transition-colors duration-150 cursor-pointer" onClick={() => setInput("Các giai đoạn phát triển tâm lý của trẻ em là gì?")}>Các giai đoạn phát triển tâm lý trẻ em?</li>
                <li className="hover:text-brand-accent hover:bg-brand-accent/10 p-1.5 rounded-md transition-colors duration-150 cursor-pointer" onClick={() => setInput("Làm thế nào để giúp con tự tin hơn?")}>Làm sao giúp con tự tin hơn?</li>
            </ul>
        </div>
        <StyledButton
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => navigate(Page.ContactExpert)}
          rightIcon={<IconChevronRight className="w-4 h-4" />}
          className="mt-auto"
        >
          Trò chuyện với Chuyên gia
        </StyledButton>
      </div>
    </div>
  );
};
