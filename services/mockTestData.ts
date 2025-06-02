
import { TestQuestion } from '../types'; // Assuming TestQuestion might be used elsewhere

// --- Interfaces ---

/**
 * Represents a single option for a test question.
 */
interface TestOption {
  id: string;
  text: string;
  value: number; // Score value for selecting this option
}

/**
 * Represents a single question in the psychological test.
 * This interface is defined here as it's specific to the mock test data structure.
 * If TestQuestion from '../types' is more generic, this specific one should be used internally or merged.
 */
export interface MockTestQuestion {
  id: string;
  text: string;
  category: string; // For grouping scores and providing category-specific feedback
  options: TestOption[];
  weight?: number; // Optional weight for the question, defaults to 1
}

/**
 * Represents the overall result of the psychological assessment.
 */
export interface AssessmentResult {
  totalScore: number;
  weightedScore: number;
  maxPossibleScore: number; // Max possible raw score
  maxPossibleWeightedScore: number; // Max possible weighted score
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  categoryScores: { [category: string]: { score: number; maxScore: number; percentage: number } };
  recommendations: string[];
  urgentFlags: string[];
}

// --- Constants for Configuration ---

const MAX_SCORE_PER_QUESTION = 3; // Assuming the highest option value is 3

const SEVERE_RISK_THRESHOLD_WEIGHTED = 60;
const HIGH_RISK_THRESHOLD_WEIGHTED = 40;
const MODERATE_RISK_THRESHOLD_WEIGHTED = 25;

const CATEGORY_RECOMMENDATION_THRESHOLD_PERCENTAGE = 50; // e.g. recommend if category score is >= 50% of its max

// --- Mock Test Questions ---
// Bảng hỏi EPDS đầy đủ 30 câu hỏi thiết kế riêng cho nam giới
export const mockTestQuestions: MockTestQuestion[] = [
  {
    id: 'q1',
    text: 'Bạn có thường xuyên cảm thấy khó ngủ hoặc ngủ không ngon giấc không?',
    category: 'sleep',
    options: [
      { id: 'q1o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q1o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q1o3', text: 'Hiếm khi', value: 1 },
      { id: 'q1o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.2, 
  },
  {
    id: 'q2',
    text: 'Bạn có dễ cảm thấy cáu kỉnh hoặc bực bội với những điều nhỏ nhặt không?',
    category: 'irritability',
    options: [
      { id: 'q2o1', text: 'Luôn luôn', value: 3 },
      { id: 'q2o2', text: 'Thường xuyên', value: 2 },
      { id: 'q2o3', text: 'Đôi khi', value: 1 },
      { id: 'q2o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.5, 
  },
  {
    id: 'q3',
    text: 'Bạn có cảm thấy mệt mỏi, thiếu năng lượng ngay cả khi đã nghỉ ngơi đủ không?',
    category: 'fatigue',
    options: [
      { id: 'q3o1', text: 'Đúng vậy, rất thường xuyên', value: 3 },
      { id: 'q3o2', text: 'Có, nhưng không thường xuyên lắm', value: 2 },
      { id: 'q3o3', text: 'Hiếm khi', value: 1 },
      { id: 'q3o4', text: 'Không, tôi luôn tràn đầy năng lượng', value: 0 },
    ],
    weight: 1.1,
  },
  {
    id: 'q4',
    text: 'Bạn có gặp khó khăn trong việc tập trung vào công việc hoặc các hoạt động hàng ngày không?',
    category: 'concentration',
    options: [
      { id: 'q4o1', text: 'Rất khó khăn', value: 3 },
      { id: 'q4o2', text: 'Thỉnh thoảng gặp khó khăn', value: 2 },
      { id: 'q4o3', text: 'Ít khi', value: 1 },
      { id: 'q4o4', text: 'Hoàn toàn không', value: 0 },
    ],
    weight: 1.3,
  },
  {
    id: 'q5',
    text: 'Bạn có cảm thấy bi quan hoặc mất hứng thú với những điều từng làm bạn vui vẻ không?',
    category: 'anhedonia',
    options: [
      { id: 'q5o1', text: 'Thường xuyên cảm thấy vậy', value: 3 },
      { id: 'q5o2', text: 'Đôi khi', value: 2 },
      { id: 'q5o3', text: 'Rất hiếm', value: 1 },
      { id: 'q5o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.4, 
  },
  {
    id: 'q6',
    text: 'Bạn có cảm thấy áp lực khi phải đảm nhận vai trò của một người cha/chồng không?',
    category: 'role_pressure',
    options: [
      { id: 'q6o1', text: 'Rất có áp lực', value: 3 },
      { id: 'q6o2', text: 'Có một chút áp lực', value: 2 },
      { id: 'q6o3', text: 'Ít áp lực', value: 1 },
      { id: 'q6o4', text: 'Không có áp lực gì', value: 0 },
    ],
    weight: 1.3,
  },
  {
    id: 'q7',
    text: 'Bạn có thường xuyên cảm thấy lo lắng về tương lai tài chính của gia đình không?',
    category: 'financial_anxiety',
    options: [
      { id: 'q7o1', text: 'Rất lo lắng', value: 3 },
      { id: 'q7o2', text: 'Khá lo lắng', value: 2 },
      { id: 'q7o3', text: 'Ít lo lắng', value: 1 },
      { id: 'q7o4', text: 'Không lo lắng', value: 0 },
    ],
    weight: 1.2,
  },
  {
    id: 'q8',
    text: 'Bạn có cảm thấy khó khăn trong việc bày tỏ cảm xúc của mình không?',
    category: 'emotional_expression',
    options: [
      { id: 'q8o1', text: 'Rất khó khăn', value: 3 },
      { id: 'q8o2', text: 'Khá khó khăn', value: 2 },
      { id: 'q8o3', text: 'Ít khó khăn', value: 1 },
      { id: 'q8o4', text: 'Dễ dàng bày tỏ', value: 0 },
    ],
    weight: 1.4, 
  },
  {
    id: 'q9',
    text: 'Bạn có thường xuyên cảm thấy cô đơn ngay cả khi có người xung quanh không?',
    category: 'loneliness',
    options: [
      { id: 'q9o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q9o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q9o3', text: 'Hiếm khi', value: 1 },
      { id: 'q9o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.3,
  },
  {
    id: 'q10',
    text: 'Bạn có xu hướng tránh né các cuộc trò chuyện về cảm xúc với bạn bè hoặc gia đình không?',
    category: 'avoidance',
    options: [
      { id: 'q10o1', text: 'Luôn tránh né', value: 3 },
      { id: 'q10o2', text: 'Thường tránh né', value: 2 },
      { id: 'q10o3', text: 'Đôi khi tránh né', value: 1 },
      { id: 'q10o4', text: 'Không tránh né', value: 0 },
    ],
    weight: 1.2,
  },
  {
    id: 'q11',
    text: 'Bạn có cảm thấy không đủ tốt trong vai trò làm cha/chồng không?',
    category: 'inadequacy',
    options: [
      { id: 'q11o1', text: 'Thường xuyên cảm thấy vậy', value: 3 },
      { id: 'q11o2', text: 'Đôi khi', value: 2 },
      { id: 'q11o3', text: 'Hiếm khi', value: 1 },
      { id: 'q11o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.5, 
  },
  {
    id: 'q12',
    text: 'Bạn có thường xuyên sử dụng rượu bia hoặc các chất kích thích để giảm căng thẳng không?',
    category: 'substance_use',
    options: [
      { id: 'q12o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q12o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q12o3', text: 'Hiếm khi', value: 1 },
      { id: 'q12o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.6, 
  },
  {
    id: 'q13',
    text: 'Bạn có cảm thấy khó kiểm soát cơn giận của mình không?',
    category: 'anger_control',
    options: [
      { id: 'q13o1', text: 'Rất khó kiểm soát', value: 3 },
      { id: 'q13o2', text: 'Khá khó kiểm soát', value: 2 },
      { id: 'q13o3', text: 'Ít khó khăn', value: 1 },
      { id: 'q13o4', text: 'Dễ dàng kiểm soát', value: 0 },
    ],
    weight: 1.5, 
  },
  {
    id: 'q14',
    text: 'Bạn có cảm thấy mình bị cô lập khỏi vợ/bạn đời không?',
    category: 'relationship_isolation',
    options: [
      { id: 'q14o1', text: 'Rất cô lập', value: 3 },
      { id: 'q14o2', text: 'Khá cô lập', value: 2 },
      { id: 'q14o3', text: 'Ít cô lập', value: 1 },
      { id: 'q14o4', text: 'Không cô lập', value: 0 },
    ],
    weight: 1.3,
  },
  {
    id: 'q15',
    text: 'Bạn có thường xuyên cảm thấy căng thẳng về công việc không?',
    category: 'work_stress',
    options: [
      { id: 'q15o1', text: 'Rất căng thẳng', value: 3 },
      { id: 'q15o2', text: 'Khá căng thẳng', value: 2 },
      { id: 'q15o3', text: 'Ít căng thẳng', value: 1 },
      { id: 'q15o4', text: 'Không căng thẳng', value: 0 },
    ],
    weight: 1.1,
  },
  {
    id: 'q16',
    text: 'Bạn có cảm thấy mình không thể chia sẻ lo lắng với ai không?',
    category: 'social_support',
    options: [
      { id: 'q16o1', text: 'Hoàn toàn không thể chia sẻ', value: 3 },
      { id: 'q16o2', text: 'Khó chia sẻ', value: 2 },
      { id: 'q16o3', text: 'Ít khó khăn trong chia sẻ', value: 1 },
      { id: 'q16o4', text: 'Dễ dàng chia sẻ', value: 0 },
    ],
    weight: 1.3,
  },
  {
    id: 'q17',
    text: 'Bạn có thường xuyên cảm thấy mệt mỏi về mặt tinh thần không?',
    category: 'mental_fatigue',
    options: [
      { id: 'q17o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q17o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q17o3', text: 'Hiếm khi', value: 1 },
      { id: 'q17o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.2,
  },
  {
    id: 'q18',
    text: 'Bạn có cảm thấy việc chăm sóc em bé/con cái là một gánh nặng không?',
    category: 'parental_burden',
    options: [
      { id: 'q18o1', text: 'Thường xuyên cảm thấy vậy', value: 3 },
      { id: 'q18o2', text: 'Đôi khi', value: 2 },
      { id: 'q18o3', text: 'Hiếm khi', value: 1 },
      { id: 'q18o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.4,
  },
  {
    id: 'q19',
    text: 'Bạn có cảm thấy không có thời gian cho bản thân không?',
    category: 'personal_time',
    options: [
      { id: 'q19o1', text: 'Hoàn toàn không có thời gian', value: 3 },
      { id: 'q19o2', text: 'Rất ít thời gian', value: 2 },
      { id: 'q19o3', text: 'Có một chút thời gian', value: 1 },
      { id: 'q19o4', text: 'Có đủ thời gian cho bản thân', value: 0 },
    ],
    weight: 1.1,
  },
  {
    id: 'q20',
    text: 'Bạn có thường xuyên cảm thấy lo âu về sức khỏe của con/vợ không?',
    category: 'family_health_anxiety',
    options: [
      { id: 'q20o1', text: 'Rất lo âu', value: 3 },
      { id: 'q20o2', text: 'Khá lo âu', value: 2 },
      { id: 'q20o3', text: 'Ít lo âu', value: 1 },
      { id: 'q20o4', text: 'Không lo âu', value: 0 },
    ],
    weight: 1.2,
  },
  {
    id: 'q21',
    text: 'Bạn có cảm thấy mình không đủ mạnh mẽ để đối phó với các vấn đề không?',
    category: 'resilience',
    options: [
      { id: 'q21o1', text: 'Thường xuyên cảm thấy vậy', value: 3 },
      { id: 'q21o2', text: 'Đôi khi', value: 2 },
      { id: 'q21o3', text: 'Hiếm khi', value: 1 },
      { id: 'q21o4', text: 'Luôn cảm thấy đủ mạnh mẽ', value: 0 },
    ],
    weight: 1.4,
  },
  {
    id: 'q22',
    text: 'Bạn có thường xuyên cảm thấy buồn nôn hoặc mất cảm giác ngon miệng không?',
    category: 'physical_symptoms',
    options: [
      { id: 'q22o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q22o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q22o3', text: 'Hiếm khi', value: 1 },
      { id: 'q22o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.1,
  },
  {
    id: 'q23',
    text: 'Bạn có cảm thấy việc tìm kiếm sự giúp đỡ là dấu hiệu của sự yếu đuối không?',
    category: 'help_seeking_stigma',
    options: [
      { id: 'q23o1', text: 'Hoàn toàn đồng ý', value: 3 },
      { id: 'q23o2', text: 'Phần nào đồng ý', value: 2 },
      { id: 'q23o3', text: 'Ít đồng ý', value: 1 },
      { id: 'q23o4', text: 'Hoàn toàn không đồng ý', value: 0 },
    ],
    weight: 1.3, 
  },
  {
    id: 'q24',
    text: 'Bạn có thường xuyên cảm thấy đau đầu hoặc căng cơ không?',
    category: 'somatic_symptoms',
    options: [
      { id: 'q24o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q24o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q24o3', text: 'Hiếm khi', value: 1 },
      { id: 'q24o4', text: 'Không bao giờ', value: 0 },
    ],
    // weight: 1.0, // Default weight 1 if not specified
  },
  {
    id: 'q25',
    text: 'Bạn có cảm thấy mình đang mất kiểm soát cuộc sống không?',
    category: 'control_loss',
    options: [
      { id: 'q25o1', text: 'Hoàn toàn mất kiểm soát', value: 3 },
      { id: 'q25o2', text: 'Phần lớn mất kiểm soát', value: 2 },
      { id: 'q25o3', text: 'Ít mất kiểm soát', value: 1 },
      { id: 'q25o4', text: 'Hoàn toàn kiểm soát được', value: 0 },
    ],
    weight: 1.5, 
  },
  {
    id: 'q26',
    text: 'Bạn có thường xuyên có những suy nghĩ tiêu cực về bản thân không?',
    category: 'negative_self_talk',
    options: [
      { id: 'q26o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q26o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q26o3', text: 'Hiếm khi', value: 1 },
      { id: 'q26o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.4,
  },
  {
    id: 'q27',
    text: 'Bạn có cảm thấy khó khăn trong việc tận hưởng thời gian bên gia đình không?',
    category: 'family_enjoyment',
    options: [
      { id: 'q27o1', text: 'Rất khó khăn', value: 3 },
      { id: 'q27o2', text: 'Khá khó khăn', value: 2 },
      { id: 'q27o3', text: 'Ít khó khăn', value: 1 },
      { id: 'q27o4', text: 'Dễ dàng tận hưởng', value: 0 },
    ],
    weight: 1.3,
  },
  {
    id: 'q28',
    text: 'Bạn có thường xuyên cảm thấy bồn chồn, không thể ngồi yên không?',
    category: 'restlessness',
    options: [
      { id: 'q28o1', text: 'Rất thường xuyên', value: 3 },
      { id: 'q28o2', text: 'Thỉnh thoảng', value: 2 },
      { id: 'q28o3', text: 'Hiếm khi', value: 1 },
      { id: 'q28o4', text: 'Không bao giờ', value: 0 },
    ],
    weight: 1.1,
  },
  {
    id: 'q29',
    text: 'Bạn có từng nghĩ rằng mọi người sẽ tốt hơn nếu không có bạn không?',
    category: 'suicidal_ideation',
    options: [
      { id: 'q29o1', text: 'Thường xuyên nghĩ vậy', value: 3 },
      { id: 'q29o2', text: 'Đôi khi nghĩ vậy', value: 2 },
      { id: 'q29o3', text: 'Hiếm khi nghĩ vậy', value: 1 },
      { id: 'q29o4', text: 'Không bao giờ nghĩ vậy', value: 0 },
    ],
    weight: 2.0, 
  },
  {
    id: 'q30',
    text: 'Bạn có cảm thấy việc thể hiện tình cảm với con cái là điều khó khăn không?',
    category: 'parental_bonding',
    options: [
      { id: 'q30o1', text: 'Rất khó khăn', value: 3 },
      { id: 'q30o2', text: 'Khá khó khăn', value: 2 },
      { id: 'q30o3', text: 'Ít khó khăn', value: 1 },
      { id: 'q30o4', text: 'Dễ dàng thể hiện', value: 0 },
    ],
    weight: 1.4,
  }
];

// --- Scoring and Assessment Functions ---

/**
 * Calculates the raw score for a given question based on the selected option.
 * @param question The test question object.
 * @param selectedOptionId The ID of the selected option.
 * @returns The score for the selected option, or 0 if not found.
 */
export const scoreAnswer = (question: MockTestQuestion, selectedOptionId: string): number => {
  const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
  return selectedOption ? selectedOption.value : 0;
};

/**
 * Calculates the weighted score for a given question.
 * @param question The test question object.
 * @param selectedOptionId The ID of the selected option.
 * @returns The weighted score.
 */
export const calculateWeightedScore = (question: MockTestQuestion, selectedOptionId: string): number => {
  const baseScore = scoreAnswer(question, selectedOptionId);
  return baseScore * (question.weight || 1); // Default weight is 1
};

/**
 * Assesses the overall results based on user's answers.
 * @param answers A record of question IDs to selected option IDs.
 * @returns An AssessmentResult object.
 */
export const assessResults = (answers: { [questionId: string]: string }): AssessmentResult => {
  let totalScore = 0;
  let weightedScore = 0;
  let maxPossibleScore = 0;
  let maxPossibleWeightedScore = 0;

  const categoryScores: AssessmentResult['categoryScores'] = {};
  const urgentFlags: string[] = [];
  
  mockTestQuestions.forEach(question => {
    maxPossibleScore += MAX_SCORE_PER_QUESTION;
    maxPossibleWeightedScore += MAX_SCORE_PER_QUESTION * (question.weight || 1);

    const selectedOptionId = answers[question.id];
    if (selectedOptionId) {
      const baseScore = scoreAnswer(question, selectedOptionId);
      const weighted = calculateWeightedScore(question, selectedOptionId);
      
      totalScore += baseScore;
      weightedScore += weighted;
      
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, maxScore: 0, percentage: 0 };
      }
      categoryScores[question.category].score += baseScore;
      categoryScores[question.category].maxScore += MAX_SCORE_PER_QUESTION;
      
      // Check for urgent flags based on specific question responses
      if (question.id === 'q29' && baseScore >= 2) { // Suicidal ideation
        urgentFlags.push('Có ý tưởng tự làm hại bản thân - CẦN HỖ TRỢ NGAY LẬP TỨC');
      }
      if (question.id === 'q12' && baseScore >= 2) { // Substance use
        urgentFlags.push('Có dấu hiệu lạm dụng chất gây nghiện ở mức đáng chú ý.');
      }
      if (question.id === 'q13' && baseScore >= 2) { // Anger control
        urgentFlags.push('Khó khăn trong kiểm soát cơn giận - có thể ảnh hưởng đến gia đình.');
      }
      if (question.id === 'q25' && baseScore >= 2) { // Loss of control
        urgentFlags.push('Cảm giác mất kiểm soát cuộc sống ở mức độ cao.');
      }
    } else {
       // If a question wasn't answered, still count its max possible score for category
       if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, maxScore: 0, percentage: 0 };
      }
      categoryScores[question.category].maxScore += MAX_SCORE_PER_QUESTION;
    }
  });

  // Calculate category percentages
  for (const category in categoryScores) {
    if (categoryScores[category].maxScore > 0) {
      categoryScores[category].percentage = Math.round((categoryScores[category].score / categoryScores[category].maxScore) * 100);
    } else {
      categoryScores[category].percentage = 0;
    }
  }

  let riskLevel: AssessmentResult['riskLevel'];
  if (weightedScore >= SEVERE_RISK_THRESHOLD_WEIGHTED || urgentFlags.length > 0) {
    riskLevel = 'severe';
  } else if (weightedScore >= HIGH_RISK_THRESHOLD_WEIGHTED) {
    riskLevel = 'high';
  } else if (weightedScore >= MODERATE_RISK_THRESHOLD_WEIGHTED) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'low';
  }

  const recommendations = generateRecommendations(riskLevel, categoryScores, urgentFlags);

  return {
    totalScore,
    weightedScore,
    maxPossibleScore,
    maxPossibleWeightedScore,
    riskLevel,
    categoryScores,
    recommendations,
    urgentFlags
  };
};

/**
 * Generates recommendations based on risk level, category scores, and urgent flags.
 * @param riskLevel The overall risk level.
 * @param categoryScores Scores for each category.
 * @param urgentFlags Array of urgent flag messages.
 * @returns An array of recommendation strings.
 */
const generateRecommendations = (
  riskLevel: AssessmentResult['riskLevel'], 
  categoryScores: AssessmentResult['categoryScores'],
  urgentFlags: string[]
): string[] => {
  const recommendations: string[] = [];

  if (urgentFlags.length > 0) {
    recommendations.push('🚨 KHẨN CẤP: Do có những dấu hiệu đáng lo ngại, bạn nên liên hệ ngay với chuyên gia tâm lý hoặc đường dây nóng hỗ trợ tâm lý để được tư vấn và can thiệp kịp thời.');
    recommendations.push('📞 Đường dây nóng tham khảo: 1900 636 688 (24/7) hoặc cơ sở y tế gần nhất.');
  }

  switch (riskLevel) {
    case 'severe':
      recommendations.push('⚠️ Mức độ nguy cơ RẤT CAO - Cần tìm kiếm sự can thiệp chuyên môn ngay lập tức. Đừng ngần ngại nói chuyện với bác sĩ tâm thần hoặc chuyên gia tâm lý học lâm sàng.');
      recommendations.push('👨‍👩‍👧‍👦 Chia sẻ với người thân trong gia đình về tình trạng của bạn để họ có thể hỗ trợ bạn trong quá trình này.');
      break;
    case 'high':
      recommendations.push('⚠️ Mức độ nguy cơ KHÁ CAO - Bạn nên tìm kiếm sự hỗ trợ chuyên nghiệp. Hãy cân nhắc tham khảo ý kiến bác sĩ gia đình hoặc một chuyên gia tâm lý.');
      recommendations.push('📚 Tìm hiểu thêm về các kỹ thuật quản lý căng thẳng và áp dụng chúng vào cuộc sống hàng ngày.');
      break;
    case 'moderate':
      recommendations.push('⚠️ Có một số dấu hiệu căng thẳng - Đây là lúc cần chú ý và thực hiện những điều chỉnh tích cực trong lối sống. Thực hành các kỹ thuật thư giãn như thiền, yoga, hoặc các bài tập hít thở sâu có thể hữu ích.');
      recommendations.push('💬 Chia sẻ cảm xúc và những khó khăn bạn đang gặp phải với người thân hoặc bạn bè tin tưởng.');
      break;
    case 'low':
      recommendations.push('✅ Tình trạng tâm lý của bạn hiện tại tương đối ổn định. Hãy tiếp tục duy trì các thói quen tích cực và chăm sóc sức khỏe tinh thần của mình.');
      break;
  }

  Object.entries(categoryScores).forEach(([category, data]) => {
    // Recommend if category percentage score is high
    if (data.percentage >= CATEGORY_RECOMMENDATION_THRESHOLD_PERCENTAGE) { 
      switch (category) {
        case 'sleep':
          recommendations.push('😴 Cải thiện giấc ngủ: Duy trì lịch ngủ đều đặn, tạo không gian ngủ thoải mái, tránh caffeine và thiết bị điện tử trước khi ngủ.');
          break;
        case 'irritability':
          recommendations.push('😤 Kiểm soát cáu kỉnh: Nhận diện yếu tố kích hoạt, thực hành kỹ thuật hít thở sâu, hoặc tạm thời rời khỏi tình huống căng thẳng.');
          break;
        case 'financial_anxiety':
          recommendations.push('💰 Quản lý tài chính: Lập kế hoạch chi tiêu, tìm cách tăng thu nhập hoặc cắt giảm chi phí không cần thiết, tham khảo ý kiến chuyên gia tài chính nếu cần.');
          break;
        case 'emotional_expression':
          recommendations.push('💭 Khuyến khích biểu đạt cảm xúc: Viết nhật ký, nói chuyện cởi mở với người tin cậy, hoặc tham gia các hoạt động giúp giải tỏa cảm xúc.');
          break;
        case 'work_stress':
          recommendations.push('💼 Cân bằng công việc-cuộc sống: Đặt ranh giới rõ ràng, ưu tiên công việc, dành thời gian nghỉ ngơi và tái tạo năng lượng.');
          break;
        case 'substance_use':
          recommendations.push('🚫 Nếu đang dùng chất kích thích để đối phó stress, hãy tìm các giải pháp thay thế lành mạnh hơn và cân nhắc tìm sự hỗ trợ để giảm hoặc ngừng sử dụng.');
          break;
        case 'parental_burden':
          recommendations.push('👶 Chia sẻ trách nhiệm chăm sóc con với bạn đời, tìm kiếm sự giúp đỡ từ gia đình hoặc bạn bè, dành thời gian nghỉ ngơi cho bản thân.');
          break;
        // Add more category-specific recommendations as needed
      }
    }
  });

  recommendations.push('💪 Duy trì hoạt động thể chất đều đặn, dù chỉ là đi bộ ngắn mỗi ngày.');
  recommendations.push('🤝 Xây dựng và duy trì các mối quan hệ xã hội tích cực. Kết nối với bạn bè, đồng nghiệp, hoặc tham gia các nhóm hỗ trợ.');
  recommendations.push('📖 Đọc thêm sách hoặc tài liệu về sức khỏe tâm thần và kỹ năng làm cha để trang bị thêm kiến thức.');
  
  return Array.from(new Set(recommendations)); // Remove duplicate recommendations
};

/**
 * Generates a detailed text report of the assessment results.
 * @param result The AssessmentResult object.
 * @returns A string containing the detailed report.
 */
export const generateDetailedReport = (result: AssessmentResult): string => {
  const reportDate = new Date().toLocaleDateString('vi-VN');
  
  let report = `
📋 BÁO CÁO ĐÁNH GIÁ TÂM LÝ NAM GIỚI DADMIND
Ngày đánh giá: ${reportDate}

📊 KẾT QUẢ TỔNG QUAN:
• Tổng điểm (Raw Score): ${result.totalScore} / ${result.maxPossibleScore}
• Điểm có trọng số (Weighted Score): ${result.weightedScore.toFixed(1)} / ${result.maxPossibleWeightedScore.toFixed(1)}
• Mức độ nguy cơ: ${getRiskLevelText(result.riskLevel)} - ${getRiskDescription(result.riskLevel)}

📈 PHÂN TÍCH CHI TIẾT THEO TỪNG KHÍA CẠNH:
`;

  const categoryNames: { [key: string]: string } = {
    'sleep': 'Chất lượng giấc ngủ',
    'irritability': 'Mức độ cáu kỉnh/bực bội',
    'fatigue': 'Mức độ mệt mỏi/thiếu năng lượng',
    'concentration': 'Khả năng tập trung',
    'anhedonia': 'Mất hứng thú/bi quan',
    'role_pressure': 'Áp lực từ vai trò cha/chồng',
    'financial_anxiety': 'Lo lắng về tài chính',
    'emotional_expression': 'Khả năng bày tỏ cảm xúc',
    'loneliness': 'Cảm giác cô đơn',
    'avoidance': 'Xu hướng tránh né giao tiếp cảm xúc',
    'inadequacy': 'Cảm giác không đủ tốt (vai trò cha/chồng)',
    'substance_use': 'Sử dụng chất kích thích để giảm căng thẳng',
    'anger_control': 'Khả năng kiểm soát cơn giận',
    'relationship_isolation': 'Cảm giác bị cô lập trong mối quan hệ vợ chồng',
    'work_stress': 'Mức độ căng thẳng trong công việc',
    'social_support': 'Khả năng chia sẻ lo lắng/hỗ trợ xã hội',
    'mental_fatigue': 'Mệt mỏi về mặt tinh thần',
    'parental_burden': 'Cảm thấy việc chăm sóc con là gánh nặng',
    'personal_time': 'Thời gian dành cho bản thân',
    'family_health_anxiety': 'Lo lắng về sức khỏe của vợ/con',
    'resilience': 'Khả năng đối phó/mạnh mẽ tinh thần',
    'physical_symptoms': 'Triệu chứng thể chất (buồn nôn, ăn không ngon)',
    'help_seeking_stigma': 'Định kiến về việc tìm kiếm sự giúp đỡ',
    'somatic_symptoms': 'Triệu chứng cơ thể (đau đầu, căng cơ)',
    'control_loss': 'Cảm giác mất kiểm soát cuộc sống',
    'negative_self_talk': 'Tần suất suy nghĩ tiêu cực về bản thân',
    'family_enjoyment': 'Khả năng tận hưởng thời gian bên gia đình',
    'restlessness': 'Cảm giác bồn chồn, không yên',
    'suicidal_ideation': 'Ý nghĩ về việc mọi người sẽ tốt hơn nếu không có mình',
    'parental_bonding': 'Khó khăn trong việc thể hiện tình cảm với con'
  };

  Object.entries(result.categoryScores).forEach(([category, data]) => {
    const categoryName = categoryNames[category] || category.replace(/_/g, ' ');
    const categoryRiskIndicator = data.percentage >= CATEGORY_RECOMMENDATION_THRESHOLD_PERCENTAGE ? '⚠️ (Cần chú ý)' : '✅ (Tốt)';
    report += `• ${categoryName}: ${data.score}/${data.maxScore} điểm (${data.percentage}%) ${categoryRiskIndicator}\n`;
  });

  if (result.urgentFlags.length > 0) {
    report += `\n🚨 CÁC DẤU HIỆU CẤP THIẾT CẦN LƯU Ý NGAY:\n`;
    result.urgentFlags.forEach(flag => {
      report += `• ${flag}\n`;
    });
  }

  report += `\n💡 CÁC GỢI Ý VÀ KHUYẾN NGHỊ CHUNG:\n`;
  if (result.recommendations.length > 0) {
    result.recommendations.forEach(rec => {
      report += `• ${rec}\n`;
    });
  } else {
    report += `• Hiện tại không có khuyến nghị cụ thể nào dựa trên kết quả. Hãy tiếp tục duy trì lối sống lành mạnh.\n`;
  }
  
  report += `\n📞 THÔNG TIN HỖ TRỢ KHI CẦN THIẾT:
• Đường dây nóng hỗ trợ tâm lý (ví dụ): 1900 1234 (Nếu có)
• Chuyên gia tâm lý: Tìm kiếm tại các bệnh viện hoặc phòng khám uy tín.
• DadMind cũng có thể kết nối bạn với chuyên gia nếu bạn muốn.

⚠️ LƯU Ý QUAN TRỌNG:
Báo cáo này dựa trên câu trả lời tự đánh giá của bạn và chỉ mang tính chất sàng lọc, tham khảo ban đầu. Nó không thay thế cho việc chẩn đoán y khoa hoặc tư vấn chuyên nghiệp từ các bác sĩ, chuyên gia tâm lý. Nếu bạn cảm thấy lo lắng hoặc có bất kỳ vấn đề nào về sức khỏe tâm thần, vui lòng tìm kiếm sự giúp đỡ từ các chuyên gia y tế.

Bài test được xây dựng dựa trên các nguyên tắc của thang đánh giá trầm cảm sau sinh Edinburgh (EPDS) và được điều chỉnh cho phù hợp với đối tượng nam giới và các khía cạnh tâm lý chung của người làm cha.
`;

  return report;
};

/**
 * Converts risk level enum to a displayable text.
 * @param riskLevel The risk level enum.
 * @returns A string representing the risk level.
 */
export const getRiskLevelText = (riskLevel: AssessmentResult['riskLevel']): string => {
  switch (riskLevel) {
    case 'low': return 'THẤP ✅';
    case 'moderate': return 'TRUNG BÌNH ⚠️';
    case 'high': return 'CAO ⚠️⚠️';
    case 'severe': return 'RẤT CAO - CẦN CAN THIỆP GẤP 🚨';
    default: return 'KHÔNG XÁC ĐỊNH';
  }
};

/**
 * Provides a textual description for each risk level.
 * @param riskLevel The risk level enum.
 * @returns A string describing the risk level.
 */
export const getRiskDescription = (riskLevel: AssessmentResult['riskLevel']): string => {
  switch (riskLevel) {
    case 'low':
      return 'Kết quả cho thấy mức độ căng thẳng và các vấn đề tâm lý của bạn hiện đang ở mức thấp. Đây là một dấu hiệu tốt. Hãy tiếp tục duy trì những thói quen lành mạnh và chăm sóc bản thân.';
    case 'moderate':
      return 'Kết quả cho thấy bạn có thể đang trải qua một số áp lực hoặc căng thẳng ở mức độ vừa phải. Đây là lúc cần chú ý hơn đến sức khỏe tinh thần và cân nhắc áp dụng các biện pháp thư giãn, tự chăm sóc.';
    case 'high':
      return 'Kết quả cho thấy mức độ căng thẳng hoặc các vấn đề tâm lý của bạn đang ở mức cao. Bạn nên xem xét việc chia sẻ với người tin cậy và tìm kiếm sự tư vấn từ chuyên gia để có những hỗ trợ phù hợp.';
    case 'severe':
      return 'Kết quả cho thấy bạn đang ở mức độ căng thẳng hoặc các vấn đề tâm lý nghiêm trọng. Rất quan trọng để bạn tìm kiếm sự giúp đỡ chuyên nghiệp ngay lập tức. Đừng ngần ngại liên hệ bác sĩ hoặc chuyên gia tâm lý.';
    default:
      return 'Không thể xác định mức độ nguy cơ dựa trên thông tin hiện có.';
  }
};

/**
 * Generates a personalized action plan based on assessment results.
 * @param result The AssessmentResult object.
 * @returns An array of action plan strings.
 */
export const generateActionPlan = (result: AssessmentResult): string[] => {
  const actionPlan: string[] = [];
  
  actionPlan.push('📝 KẾ HOẠCH HÀNH ĐỘNG CÁ NHÂN HÓA DADMIND:');

  if (result.urgentFlags.length > 0) {
    actionPlan.push('\n🆘 HÀNH ĐỘNG ƯU TIÊN CAO NHẤT (NGAY LẬP TỨC):');
    result.urgentFlags.forEach(flag => actionPlan.push(`• ${flag} - Tìm kiếm sự hỗ trợ chuyên nghiệp ngay!`));
    actionPlan.push('• Chia sẻ ngay với người thân hoặc bạn bè mà bạn tin tưởng nhất về những gì bạn đang trải qua.');
    actionPlan.push('• Đảm bảo bạn không ở một mình nếu cảm thấy quá khó khăn.');
  }
  
  actionPlan.push('\n🗓️ TRONG 1-3 NGÀY TỚI:');
  if (result.riskLevel === 'severe' || result.riskLevel === 'high') {
    actionPlan.push('• Đặt lịch hẹn với bác sĩ gia đình hoặc chuyên gia tâm lý để thảo luận chi tiết về kết quả này.');
    actionPlan.push('• Viết ra những suy nghĩ, cảm xúc chính đang làm bạn phiền lòng.');
  }
  actionPlan.push('• Dành ít nhất 30 phút mỗi ngày cho một hoạt động bạn yêu thích hoặc giúp bạn thư giãn (nghe nhạc, đọc sách, đi dạo).');
  actionPlan.push('• Xem xét lại lịch trình hàng ngày, cố gắng giảm bớt những việc không quá cấp thiết để giảm tải áp lực.');


  actionPlan.push('\n📅 TRONG TUẦN TỚI:');
  if (result.riskLevel === 'severe' || result.riskLevel === 'high' || result.riskLevel === 'moderate') {
     actionPlan.push('• Bắt đầu thực hành một kỹ thuật thư giãn đơn giản (ví dụ: hít thở sâu 5 phút mỗi ngày, thiền ngắn).');
     actionPlan.push('• Tìm hiểu về các nhóm hỗ trợ dành cho các ông bố hoặc các vấn đề bạn đang gặp phải (nếu có).');
  }
  actionPlan.push('• Cố gắng ngủ đủ 7-8 tiếng mỗi đêm. Cải thiện vệ sinh giấc ngủ nếu cần.');
  actionPlan.push('• Tăng cường hoạt động thể chất (ví dụ: đi bộ nhanh, chạy bộ, bơi lội) ít nhất 3 lần/tuần.');
  actionPlan.push('• Kết nối lại với một người bạn hoặc người thân mà bạn đã lâu không liên lạc.');

  actionPlan.push('\n🎯 MỤC TIÊU DÀI HẠN (1-3 THÁNG):');
  actionPlan.push('• Xây dựng một thói quen tự chăm sóc bản thân bền vững (thể chất, tinh thần, xã hội).');
  actionPlan.push('• Phát triển các kỹ năng đối phó với căng thẳng hiệu quả hơn.');
  actionPlan.push('• Cải thiện kỹ năng giao tiếp trong gia đình và các mối quan hệ quan trọng.');
  actionPlan.push('• Đánh giá lại tình trạng của bạn bằng bài test này sau khoảng 1 tháng để theo dõi tiến triển.');
  actionPlan.push('• Nếu bạn đang làm việc với chuyên gia, hãy tuân thủ kế hoạch điều trị và thường xuyên trao đổi về tiến trình của mình.');
  
  actionPlan.push('\n💡 LỜI NHẮN TỪ DADMIND: Hành trình làm cha có nhiều thử thách, nhưng bạn không đơn độc. Việc nhận diện vấn đề và tìm kiếm giải pháp là bước đầu tiên rất quan trọng. Hãy kiên nhẫn với bản thân và từng bước thực hiện những thay đổi tích cực.');

  return actionPlan;
};

// Export functions and data for use in components
export {
  mockTestQuestions as epdsQuestions,
  assessResults as performAssessment,
  generateDetailedReport as createReport,
  generateActionPlan as createActionPlan
};
