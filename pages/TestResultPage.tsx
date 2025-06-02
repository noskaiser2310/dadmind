
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'; // Ensured imports
import { StyledButton } from '../components/StyledButton';
import { LoadingIcon } from '../components/LoadingIcon';
import { 
    IconChevronRight, GEMINI_MODEL_TEXT, 
    IconLightbulb, IconAlertTriangle
} from '../constants.tsx';
import { Page } from '../types.ts';
import { 
  AssessmentResult, 
  assessResults, 
  // generateDetailedReport, // No longer directly used for AI prompt input text
  // generateActionPlan, // No longer directly used for AI prompt input text
  getRiskLevelText,
  getRiskDescription
} from '../services/mockTestData.ts';


export const TestResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const stateFromLocation = location.state as { answers?: { [key: string]: string } } | null | undefined;
  const answers = stateFromLocation?.answers;
  
  const [assessmentData, setAssessmentData] = useState<AssessmentResult | null>(null);
  const [aiGeneratedAdvice, setAiGeneratedAdvice] = useState<string | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) {
      setAdviceError("Không có dữ liệu câu trả lời. Vui lòng thực hiện lại bài test.");
      setIsLoadingAssessment(false);
      return;
    }
    try {
      const result = assessResults(answers);
      setAssessmentData(result);
    } catch (e) {
      console.error("Error assessing results:", e);
      setAdviceError(`Lỗi khi xử lý kết quả: ${e instanceof Error ? e.message : String(e)}`);
    }
    setIsLoadingAssessment(false);
  }, [answers]);

  useEffect(() => {
    const fetchMainAdvice = async () => {
      if (!assessmentData) {
        setAiGeneratedAdvice("Không thể tạo lời khuyên do thiếu dữ liệu đánh giá.");
        return;
      }
      
      setIsLoadingAdvice(true);
      setAdviceError(null); 

      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
        setAdviceError("API Key is not configured. Personalized advice cannot be generated.");
        setAiGeneratedAdvice("Không thể tải lời khuyên do lỗi cấu hình.");
        setIsLoadingAdvice(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Prepare concise, structured data for the prompt
        const topProblematicCategories = Object.entries(assessmentData.categoryScores)
            .filter(([, data]) => data.percentage >= 50) // Example threshold
            .sort(([, a], [, b]) => b.percentage - a.percentage)
            .slice(0, 3) // Take top 2-3
            .map(([categoryKey]) => {
                 // Basic category name mapping (could be more sophisticated)
                const categoryName = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return categoryName;
            });

        let promptDataPoints = `
Mức độ nguy cơ tổng quan: ${getRiskLevelText(assessmentData.riskLevel)} (${getRiskDescription(assessmentData.riskLevel)})
Điểm có trọng số: ${assessmentData.weightedScore.toFixed(1)} / ${assessmentData.maxPossibleWeightedScore.toFixed(1)}`;

        if (topProblematicCategories.length > 0) {
            promptDataPoints += `\nCác lĩnh vực chính cần chú ý (dựa trên điểm số): ${topProblematicCategories.join(', ')}.`;
        }

        if (assessmentData.urgentFlags.length > 0) {
            promptDataPoints += `\nCÁC CẢNH BÁO KHẨN CẤP: ${assessmentData.urgentFlags.join('; ')}.`;
        }

        const prompt = `Là DadMind AI, một chuyên gia tâm lý đồng cảm, hãy phân tích các dữ liệu cốt lõi từ kết quả bài test tâm lý của một người cha.
Dưới đây là các điểm dữ liệu chính:
---
${promptDataPoints}
---

Dựa trên các ĐIỂM DỮ LIỆU CỐT LÕI này, hãy thực hiện các yêu cầu sau:
1.  Bắt đầu bằng một đoạn PHÂN TÍCH VÀ DIỄN GIẢI (khoảng 3-5 câu) về tình trạng của người cha một cách đồng cảm, sâu sắc và chuyên nghiệp. Hãy làm rõ những điểm chính mà các dữ liệu trên cho thấy.
2.  Sau đó, cung cấp từ 1 đến 2 lời khuyên THÊM, ĐỘC ĐÁO, SÁNG TẠO và THỰC TẾ (không phải là các lời khuyên sức khỏe tâm thần chung chung như "ngủ đủ giấc", "ăn uống lành mạnh" hay "tập thể dục"). Các lời khuyên này nên tập trung vào những thách thức hoặc cơ hội đặc biệt dành cho một người cha, có thể là các hoạt động cụ thể, cách thay đổi tư duy, hoặc cách kết nối mới với gia đình/con cái.
3.  Nếu có "CẢNH BÁO KHẨN CẤP", hãy nhấn mạnh tầm quan trọng của việc tìm kiếm sự hỗ trợ chuyên nghiệp ngay lập tức một cách khéo léo trong phần phân tích hoặc lời khuyên của bạn.
4.  Kết thúc bằng một lời động viên ngắn gọn, chân thành và đầy hy vọng (1-2 câu).

YÊU CẦU QUAN TRỌNG VỀ ĐỊNH DẠNG VÀ GIỌNG VĂN:
- Giữ giọng văn cực kỳ thấu cảm, ấm áp, và chuyên nghiệp.
- Đảm bảo lời khuyên mới thực sự khác biệt và bổ sung giá trị.
- Sử dụng định dạng Markdown: 
    - Các đoạn văn cách nhau bằng một dòng trống.
    - Các mục lời khuyên mới (phần 2) phải bắt đầu bằng dấu gạch ngang và một khoảng trắng (ví dụ: "- Lời khuyên...").
    - Sử dụng **in đậm** cho những từ hoặc cụm từ cần nhấn mạnh.
    - Sử dụng *in nghiêng* cho những thuật ngữ hoặc tên riêng (nếu có).
- Không sử dụng HTML.
- Tránh các câu hỏi trực tiếp cho người dùng trong phản hồi của bạn.
`;
        
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL_TEXT,
          contents: prompt,
          config: { safetySettings }
        });
        
        setAiGeneratedAdvice(response.text);

      } catch (err) {
        console.error("Error generating advice with Gemini:", err);
        let specificErrorDetail = "";
        if (err instanceof Error && (err.message.includes("PERMISSION_DENIED") || err.message.includes("403"))) {
            specificErrorDetail = "Lỗi này có thể liên quan đến quyền của API key.";
        }
        const errorMsg = `Xin lỗi, đã có lỗi xảy ra khi tạo lời khuyên. ${specificErrorDetail} Vui lòng thử lại sau. (${err instanceof Error ? err.message : String(err)})`;
        setAdviceError(errorMsg);
        setAiGeneratedAdvice("Không thể tải lời khuyên vào lúc này do lỗi kỹ thuật.");
      } finally {
        setIsLoadingAdvice(false);
      }
    };

    if (assessmentData) {
      fetchMainAdvice();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentData]); 

  const renderInlineMarkdown = (text: string) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(part => part && part.length > 0);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
  };

  const renderMarkdown = (markdownText: string | undefined | null): JSX.Element[] | null => {
    if (typeof markdownText !== 'string' || !markdownText.trim()) {
      return null;
    }

    const normalizedText = markdownText.replace(/\r\n/g, '\n');
    const lines = normalizedText.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('### ')) {
        elements.push(<h3 key={`h3-${elements.length}`}>{renderInlineMarkdown(trimmedLine.substring(4))}</h3>);
        i++;
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(<h2 key={`h2-${elements.length}`}>{renderInlineMarkdown(trimmedLine.substring(3))}</h2>);
        i++;
      } else if (trimmedLine.startsWith('# ')) {
        elements.push(<h1 key={`h1-${elements.length}`}>{renderInlineMarkdown(trimmedLine.substring(2))}</h1>);
        i++;
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const listItems: JSX.Element[] = [];
        while (i < lines.length) {
          const currentItemLine = lines[i].trim();
          if (currentItemLine.startsWith('- ') || currentItemLine.startsWith('* ')) {
            const listItemContent = currentItemLine.substring(currentItemLine.indexOf(' ') + 1);
            if (listItemContent.trim()) {
              listItems.push(<li key={`li-${elements.length}-${listItems.length}`}>{renderInlineMarkdown(listItemContent)}</li>);
            }
            i++;
          } else {
            break; 
          }
        }
        if (listItems.length > 0) {
          elements.push(<ul key={`ul-${elements.length}`}>{listItems}</ul>);
        }
      } else if (trimmedLine !== '') {
        const paragraphLines: string[] = [];
        while (i < lines.length) {
          const currentParaLine = lines[i];
          if (currentParaLine.trim() === '' || currentParaLine.trim().startsWith('#') || currentParaLine.trim().startsWith('- ') || currentParaLine.trim().startsWith('* ')) {
            break; 
          }
          paragraphLines.push(currentParaLine);
          i++;
        }
        if (paragraphLines.length > 0) {
          elements.push(<p key={`p-${elements.length}`}>{renderInlineMarkdown(paragraphLines.join('\n'))}</p>);
        }
      } else {
        i++;
      }
    }
    return elements.length > 0 ? elements : null;
  };
  
  const getRiskColors = (riskLevel: AssessmentResult['riskLevel']) => {
    switch (riskLevel) {
      case 'severe': return 'bg-risk-severe-bg text-risk-severe-text border-risk-severe-border';
      case 'high': return 'bg-risk-high-bg text-risk-high-text border-risk-high-border';
      case 'moderate': return 'bg-risk-moderate-bg text-risk-moderate-text border-risk-moderate-border';
      case 'low': return 'bg-risk-low-bg text-risk-low-text border-risk-low-border';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (isLoadingAssessment) {
    return (
      <div className="text-center py-20">
        <LoadingIcon size="lg" />
        <p className="mt-6 text-lg text-brand-light-text">Đang phân tích kết quả của bạn...</p>
      </div>
    );
  }
  
  if (adviceError && !assessmentData) { 
    return (
        <div className="max-w-3xl mx-auto bg-brand-bg-card p-6 sm:p-10 rounded-2xl shadow-card text-center">
            <IconAlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi Xử Lý Kết Quả</h1>
            <p className="text-brand-light-text mb-6">{adviceError}</p>
            <StyledButton onClick={() => navigate(Page.Test)} size="lg">Làm lại bài test</StyledButton>
        </div>
    );
  }

  if (!assessmentData) { 
    return (
      <div className="text-center py-20">
        <IconAlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <p className="mt-6 text-lg text-red-500">Không thể tải dữ liệu đánh giá. Vui lòng thử lại.</p>
         <StyledButton onClick={() => navigate(Page.Test)} size="lg" className="mt-4">Làm lại bài test</StyledButton>
      </div>
    );
  }

  const riskColors = getRiskColors(assessmentData.riskLevel);

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
      <header className="text-center pt-2 pb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark-text">
          Kết Quả Đánh Giá Tâm Lý 
        </h1>
        <p className="mt-3 text-lg text-brand-light-text">Dành cho bạn, từ DadMind</p>
      </header>
      
      <section className={`p-6 sm:p-8 rounded-xl shadow-xl border ${riskColors}`}>
        <div className="flex flex-col items-center text-center">
            {assessmentData.riskLevel === 'severe' && <IconAlertTriangle className="w-12 h-12 mb-3" />}
            {assessmentData.riskLevel === 'high' && <IconAlertTriangle className="w-10 h-10 mb-3 opacity-80" />}
            {assessmentData.riskLevel === 'moderate' && <IconAlertTriangle className="w-8 h-8 mb-3 opacity-70" />}

            <h2 className="text-xl sm:text-2xl font-bold mb-1">Đánh Giá Tổng Quan</h2>
            <p className="text-sm mb-3 opacity-80">Dựa trên câu trả lời của bạn</p>
            <p className={`text-3xl sm:text-4xl font-bold mb-2 ${assessmentData.riskLevel === 'low' ? 'text-green-600': ''}`}>{getRiskLevelText(assessmentData.riskLevel)}</p>
            <p className="text-base sm:text-lg font-medium mb-4 max-w-xl mx-auto opacity-90">{getRiskDescription(assessmentData.riskLevel)}</p>
            <div className="text-sm opacity-80">
                Điểm có trọng số: <strong className="font-semibold">{assessmentData.weightedScore.toFixed(1)} / {assessmentData.maxPossibleWeightedScore.toFixed(1)}</strong>
            </div>
        </div>
      </section>

      <section className="bg-brand-bg-card p-6 sm:p-8 rounded-xl shadow-card border border-brand-border/50">
        <h2 className="flex items-center text-xl sm:text-2xl font-semibold text-brand-primary mb-4 border-b-2 border-brand-primary/20 pb-3">
          <IconLightbulb className="w-6 h-6 mr-3 text-brand-primary" />
          Phân Tích Chuyên Sâu & Lời Khuyên Từ DadMind AI
        </h2>
        {isLoadingAdvice ? (
          <div className="flex flex-col items-center text-center space-y-3 text-brand-light-text bg-brand-bg-subtle/70 p-6 rounded-lg shadow-sm border border-brand-border/30">
            <LoadingIcon size="md" /> 
            <span className="text-sm font-medium">Đang tạo phân tích và lời khuyên được cá nhân hóa cho bạn...</span>
          </div>
        ) : adviceError && aiGeneratedAdvice === "Không thể tải lời khuyên vào lúc này do lỗi kỹ thuật." ? ( 
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-sm text-red-700">
            <p className="font-semibold mb-1">Lỗi khi tạo phân tích:</p>
            <p>{adviceError}</p>
          </div>
        ) : (
           <div className="prose prose-sm sm:prose-base max-w-none text-brand-light-text prose-headings:text-brand-primary prose-strong:text-brand-dark-text prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-p:my-2 prose-em:italic">
            {renderMarkdown(aiGeneratedAdvice)}
           </div>
        )}
      </section>
      
      <div className="text-center pt-6 border-t border-brand-border/30">
         <Link to={Page.Test} className="text-brand-primary hover:text-brand-accent font-medium hover:underline transition-colors text-sm">
            Làm lại bài test
          </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pb-4">
        <StyledButton 
            onClick={() => navigate(Page.ContactExpert)}
            rightIcon={<IconChevronRight className="w-5 h-5"/>}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
        >
            Liên hệ Chuyên gia
        </StyledButton>
        <StyledButton 
            onClick={() => navigate(Page.Home)}
            rightIcon={<IconChevronRight className="w-5 h-5"/>}
            size="lg"
            className="w-full sm:w-auto"
        >
            Về Trang chủ
        </StyledButton>
      </div>
    </div>
  );
};
