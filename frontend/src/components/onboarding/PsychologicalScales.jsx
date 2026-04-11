// frontend/src/components/onboarding/PsychologicalScales.jsx
import React, { useState } from 'react';

const questions = [
  // SECTION 1: Chaos Tolerance (Openness) - 10 questions
  { id: 1, scale: "Chaos Tolerance", original: "openness", text: "I enjoy trying new things, like Bobby trying a new ant trap placement." },
  { id: 2, scale: "Chaos Tolerance", original: "openness", text: "I prefer routine over chaos (unlike the Bad Friends studio)." },
  { id: 3, scale: "Chaos Tolerance", original: "openness", text: "I enjoy abstract art, even if it looks like a morning face." },
  { id: 4, scale: "Chaos Tolerance", original: "openness", text: "I'm curious about different cultures, especially Korean BBQ." },
  { id: 5, scale: "Chaos Tolerance", original: "openness", text: "I like to think outside the box, even if the box has ant traps." },
  { id: 6, scale: "Chaos Tolerance", original: "openness", text: "I enjoy philosophical debates, like 'Is a hot dog a sandwich?'" },
  { id: 7, scale: "Chaos Tolerance", original: "openness", text: "I appreciate unconventional humor, like Andrew roasting Bobby." },
  { id: 8, scale: "Chaos Tolerance", original: "openness", text: "I'm open to new experiences, even toe-related ones." },
  { id: 9, scale: "Chaos Tolerance", original: "openness", text: "I enjoy learning random facts, like how many ants fit on a fridge." },
  { id: 10, scale: "Chaos Tolerance", original: "openness", text: "I'm creative when solving problems, like getting a Klondike bar." },
  
  // SECTION 2: Ant Trap Organization (Conscientiousness) - 10 questions
  { id: 11, scale: "Ant Trap Organization", original: "conscientiousness", text: "I keep my space organized, unlike Bobby's apartment." },
  { id: 12, scale: "Ant Trap Organization", original: "conscientiousness", text: "I complete tasks before deadlines, like morning face uploads." },
  { id: 13, scale: "Ant Trap Organization", original: "conscientiousness", text: "I pay attention to details, like ant trap placement." },
  { id: 14, scale: "Ant Trap Organization", original: "conscientiousness", text: "I follow through on commitments, even to Jamie Lee Curtis." },
  { id: 15, scale: "Ant Trap Organization", original: "conscientiousness", text: "I plan ahead for important events, like first dates." },
  { id: 16, scale: "Ant Trap Organization", original: "conscientiousness", text: "I'm reliable when people count on me, like a Bad Friend should be." },
  { id: 17, scale: "Ant Trap Organization", original: "conscientiousness", text: "I prefer structure over chaos (Rudy vs Bobby energy)." },
  { id: 18, scale: "Ant Trap Organization", original: "conscientiousness", text: "I take responsibility for my mistakes, even toe-related ones." },
  { id: 19, scale: "Ant Trap Organization", original: "conscientiousness", text: "I'm punctual for meetings, unlike podcast start times." },
  { id: 20, scale: "Ant Trap Organization", original: "conscientiousness", text: "I maintain good habits, like daily morning faces." },
  
  // SECTION 3: Bobo Energy (Extraversion) - 10 questions
  { id: 21, scale: "Bobo Energy", original: "extraversion", text: "I'm the life of the party, like Santino with a mic." },
  { id: 22, scale: "Bobo Energy", original: "extraversion", text: "I enjoy meeting new people, even potential Bad Friends." },
  { id: 23, scale: "Bobo Energy", original: "extraversion", text: "I feel energized after social events, not drained." },
  { id: 24, scale: "Bobo Energy", original: "extraversion", text: "I start conversations with strangers, like at comedy clubs." },
  { id: 25, scale: "Bobo Energy", original: "extraversion", text: "I enjoy being the center of attention, sometimes." },
  { id: 26, scale: "Bobo Energy", original: "extraversion", text: "I make friends easily, even with chaotic people." },
  { id: 27, scale: "Bobo Energy", original: "extraversion", text: "I prefer group activities over solo ones." },
  { id: 28, scale: "Bobo Energy", original: "extraversion", text: "I talk a lot when I'm comfortable, like Bobby on a rant." },
  { id: 29, scale: "Bobo Energy", original: "extraversion", text: "I enjoy public speaking, or at least telling stories." },
  { id: 30, scale: "Bobo Energy", original: "extraversion", text: "I bring energy to quiet rooms, sometimes too much." },
  
  // SECTION 4: Rudy Energy (Agreeableness) - 10 questions
  { id: 31, scale: "Rudy Energy", original: "agreeableness", text: "I sympathize with others' feelings, even bad morning faces." },
  { id: 32, scale: "Rudy Energy", original: "agreeableness", text: "I avoid arguments when possible, unlike the podcast." },
  { id: 33, scale: "Rudy Energy", original: "agreeableness", text: "I trust people until they give me a reason not to." },
  { id: 34, scale: "Rudy Energy", original: "agreeableness", text: "I forgive easily, even ant-related transgressions." },
  { id: 35, scale: "Rudy Energy", original: "agreeableness", text: "I'm a team player, not a solo act." },
  { id: 36, scale: "Rudy Energy", original: "agreeableness", text: "I put others' needs before mine, sometimes." },
  { id: 37, scale: "Rudy Energy", original: "agreeableness", text: "I'm polite to strangers, even bad tippers." },
  { id: 38, scale: "Rudy Energy", original: "agreeableness", text: "I compromise in disagreements, like date planning." },
  { id: 39, scale: "Rudy Energy", original: "agreeableness", text: "I'm warm and friendly, not cold and distant." },
  { id: 40, scale: "Rudy Energy", original: "agreeableness", text: "I believe people are generally good, deep down." },
  
  // SECTION 5: Worst Friend Anxiety (Neuroticism) - 10 questions
  { id: 41, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I get stressed easily, like Bobby before a special." },
  { id: 42, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I worry about things I can't control, like ant invasions." },
  { id: 43, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I get upset easily when plans change." },
  { id: 44, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I overthink social situations, like first messages." },
  { id: 45, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I have mood swings, from 🍜 to 💀 energy." },
  { id: 46, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I get irritated by small things, like bad jokes." },
  { id: 47, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I feel anxious about dating, like everyone does." },
  { id: 48, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I struggle to relax, even when I should." },
  { id: 49, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I get jealous sometimes, it happens." },
  { id: 50, scale: "Worst Friend Anxiety", original: "neuroticism", text: "I feel insecure about my morning face, who doesn't?" },
];

// Section definitions for intro cards
const sections = [
  { name: "Chaos Tolerance", emoji: "🌀", startIdx: 0, endIdx: 10, description: "How open are you to new experiences? Do you embrace chaos or need a plan?" },
  { name: "Ant Trap Organization", emoji: "🐜", startIdx: 10, endIdx: 20, description: "Are you a Rudy (organized) or a Bobby (chaotic) when it comes to getting things done?" },
  { name: "Bobo Energy", emoji: "🍜", startIdx: 20, endIdx: 30, description: "How much energy do you bring to a room? Are you the life of the party?" },
  { name: "Rudy Energy", emoji: "👕", startIdx: 30, endIdx: 40, description: "How do you handle conflict? Are you a peacemaker or a firestarter?" },
  { name: "Worst Friend Anxiety", emoji: "💀", startIdx: 40, endIdx: 50, description: "How do you handle stress and worry? We've all got a little Worst Friend in us." },
];

// Milestone messages at different progress points
const getMilestoneMessage = (progressPercent) => {
  if (progressPercent < 20) return "Just getting started 🔥";
  if (progressPercent < 40) return "Halfway there! Don't quit like Bobby at the gym.";
  if (progressPercent < 60) return "Almost there... this is where it gets interesting.";
  if (progressPercent < 80) return "Final stretch! Your comedy soulmate is waiting.";
  return "Last few questions! You're a real Bad Friend now 💀";
};

const PsychologicalScales = ({ onComplete, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
  const [showSectionIntro, setShowSectionIntro] = useState(true);
  const [scaleScores, setScaleScores] = useState({
    openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: []
  });

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentSection = sections.find(s => currentIndex >= s.startIdx && currentIndex < s.endIdx);
  const milestoneMessage = getMilestoneMessage(progress);
  
  // Check if we're at the start of a new section
  const isSectionStart = sections.some(s => s.startIdx === currentIndex);
  
  const handleAnswer = (value) => {
    setSelectedValue(value);
    
    // Add subtle delay to show selected state before moving on
    setTimeout(() => {
      const newAnswers = { ...answers, [currentQ.id]: value };
      setAnswers(newAnswers);
      
      // Track scale scores using original scale name for backend compatibility
      const originalScale = currentQ.original;
      const newScaleScores = { ...scaleScores };
      newScaleScores[originalScale].push(value);
      setScaleScores(newScaleScores);
      
      onProgress(progress);
      setSelectedValue(null);
      
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Calculate final scores (average per scale, 1-5 scale)
        const finalScores = {};
        for (const [scale, scores] of Object.entries(newScaleScores)) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          finalScores[scale] = parseFloat(avg.toFixed(2));
        }
        onComplete(finalScores);
      }
    }, 150);
  };

  return (
    <div className="rounded-2xl">
      <div className="max-w-md mx-auto">
        
        {/* Estimated Time Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="estimated-time">
            <span>⏱️</span> About 8 minutes
          </div>
          <div className="estimated-time">
            <span>📊</span> {Math.round(progress)}% complete
          </div>
        </div>
        
        {/* Progress Bar - Thick & Visible */}
        <div className="mb-6">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Milestone Message */}
        <div className="milestone-message">
          {milestoneMessage}
        </div>
        
        {/* Section Intro Card */}
        {isSectionStart && showSectionIntro && currentSection && (
          <div className="section-intro mb-6">
            <div className="section-intro-title">
              {currentSection.emoji} {currentSection.name}
            </div>
            <div className="section-intro-desc">
              {currentSection.description}
            </div>
            <button 
              onClick={() => setShowSectionIntro(false)}
              className="mt-3 text-xs text-orange-500 hover:text-yellow-500 transition"
            >
              Got it, let's go →
            </button>
          </div>
        )}
        
        {/* Question Card */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 mb-4">
          <div className="text-center mb-6">
            <span className="question-category">
              {currentQ.scale}
            </span>
          </div>
          
          <p className="question-text text-center mb-8">
            {currentQ.text}
          </p>
          
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className={`answer-btn ${selectedValue === val ? 'selected' : ''}`}
              >
                {val === 1 && "Strongly Disagree"}
                {val === 2 && "Disagree"}
                {val === 3 && "Neutral"}
                {val === 4 && "Agree"}
                {val === 5 && "Strongly Agree"}
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-xs">
          Your answers help us find your real match. Be honest, you coward.
        </p>
      </div>
    </div>
  );
};

export default PsychologicalScales;