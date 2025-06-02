
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledButton } from '../components/StyledButton';
import { DAD_CHILD_ILLUSTRATION_URL, IconChevronRight } from '../constants';
import { Page } from '../types';

export const PsychologicalTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 xl:gap-16 min-h-[calc(100vh-15rem)] py-8 sm:py-12">
      <div className="lg:w-3/5 text-center lg:text-left bg-brand-bg-card p-8 sm:p-12 rounded-2xl shadow-xl group"> {/* Added group for hover effects */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-dark-text mb-6 leading-tight">
          Bài Test Tâm Lý
        </h1>
        
        {/* Enhanced text block */}
        <div className="animate-fadeInSmooth bg-brand-primary/5 p-6 rounded-xl shadow-lg border border-brand-primary/20 ring-1 ring-brand-primary/10 inset-1 mb-10 transition-all duration-300 group-hover:shadow-xl">
          <div className="prose prose-base max-w-none">
            <p className="text-brand-dark-text/90 leading-relaxed">
              Trong cuộc sống, không ít lần bạn cảm thấy căng thẳng, chán nản vì những khó khăn, thử thách.
              Tuy nhiên, mỗi người sẽ có những mức độ stress khác nhau.
            </p>
            <p className="text-brand-dark-text/90 leading-relaxed">
              <span className="font-semibold text-brand-accent">Còn bạn thì sao? Thử nhé!</span> Bài test này sẽ giúp bạn hiểu rõ hơn về mức độ căng thẳng của mình và đưa ra những gợi ý hữu ích.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 p-6 sm:p-8 rounded-xl shadow-interactive border border-brand-border/30 transition-all duration-300 hover:shadow-interactive-lg group-hover:animate-subtle-glow">
            <p className="text-xl sm:text-2xl font-semibold text-brand-primary mb-5 text-center lg:text-left">
                Đo lường mức độ stress của bạn!
            </p>
            <StyledButton 
                size="lg" 
                onClick={() => navigate(Page.TestQuiz)}
                rightIcon={<IconChevronRight className="w-5 h-5" />}
                className="w-full sm:w-auto mx-auto lg:mx-0 transition-transform duration-200 group-hover:scale-105"
            >
                Bắt đầu Test
            </StyledButton>
        </div>
      </div>
      <div className="lg:w-2/5 mt-12 lg:mt-0 flex justify-center p-4">
        <img 
            src={DAD_CHILD_ILLUSTRATION_URL} 
            alt="Illustration for psychological test" 
            className="rounded-2xl shadow-2xl object-cover w-full max-w-md lg:max-w-lg h-auto aspect-square transition-all duration-300 hover:scale-105 border-4 border-white hover:shadow-interactive-lg"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/500x500.png?text=Test+Illustration")}
        />
      </div>
    </div>
  );
};