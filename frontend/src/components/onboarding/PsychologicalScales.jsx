// frontend/src/components/onboarding/PsychologicalScales.jsx
import React, { useState } from 'react';

const questions = [
  // Big Five - Openness (10 questions)
  { id: 1, scale: "openness", text: "I enjoy trying new things, like Bobby trying a new ant trap placement.", options: 5 },
  { id: 2, scale: "openness", text: "I prefer routine over chaos (unlike the Bad Friends studio).", options: 5 },
  { id: 3, scale: "openness", text: "I enjoy abstract art, even if it looks like a morning face.", options: 5 },
  { id: 4, scale: "openness", text: "I'm curious about different cultures, especially Korean BBQ.", options: 5 },
  { id: 5, scale: "openness", text: "I like to think outside the box, even if the box has ant traps.", options: 5 },
  { id: 6, scale: "openness", text: "I enjoy philosophical debates, like 'Is a hot dog a sandwich?'", options: 5 },
  { id: 7, scale: "openness", text: "I appreciate unconventional humor, like Andrew roasting Bobby.", options: 5 },
  { id: 8, scale: "openness", text: "I'm open to new experiences, even toe-related ones.", options: 5 },
  { id: 9, scale: "openness", text: "I enjoy learning random facts, like how many ants fit on a fridge.", options: 5 },
  { id: 10, scale: "openness", text: "I'm creative when solving problems, like getting a Klondike bar.", options: 5 },
  
  // Big Five - Conscientiousness (10 questions)
  { id: 11, scale: "conscientiousness", text: "I keep my space organized, unlike Bobby's apartment.", options: 5 },
  { id: 12, scale: "conscientiousness", text: "I complete tasks before deadlines, like morning face uploads.", options: 5 },
  { id: 13, scale: "conscientiousness", text: "I pay attention to details, like ant trap placement.", options: 5 },
  { id: 14, scale: "conscientiousness", text: "I follow through on commitments, even to Jamie Lee Curtis.", options: 5 },
  { id: 15, scale: "conscientiousness", text: "I plan ahead for important events, like first dates.", options: 5 },
  { id: 16, scale: "conscientiousness", text: "I'm reliable when people count on me, like a Bad Friend should be.", options: 5 },
  { id: 17, scale: "conscientiousness", text: "I prefer structure over chaos (Rudy vs Bobby energy).", options: 5 },
  { id: 18, scale: "conscientiousness", text: "I take responsibility for my mistakes, even toe-related ones.", options: 5 },
  { id: 19, scale: "conscientiousness", text: "I'm punctual for meetings, unlike podcast start times.", options: 5 },
  { id: 20, scale: "conscientiousness", text: "I maintain good habits, like daily morning faces.", options: 5 },
  
  // Big Five - Extraversion (10 questions)
  { id: 21, scale: "extraversion", text: "I'm the life of the party, like Santino with a mic.", options: 5 },
  { id: 22, scale: "extraversion", text: "I enjoy meeting new people, even potential Bad Friends.", options: 5 },
  { id: 23, scale: "extraversion", text: "I feel energized after social events, not drained.", options: 5 },
  { id: 24, scale: "extraversion", text: "I start conversations with strangers, like at comedy clubs.", options: 5 },
  { id: 25, scale: "extraversion", text: "I enjoy being the center of attention, sometimes.", options: 5 },
  { id: 26, scale: "extraversion", text: "I make friends easily, even with chaotic people.", options: 5 },
  { id: 27, scale: "extraversion", text: "I prefer group activities over solo ones.", options: 5 },
  { id: 28, scale: "extraversion", text: "I talk a lot when I'm comfortable, like Bobby on a rant.", options: 5 },
  { id: 29, scale: "extraversion", text: "I enjoy public speaking, or at least telling stories.", options: 5 },
  { id: 30, scale: "extraversion", text: "I bring energy to quiet rooms, sometimes too much.", options: 5 },
  
  // Big Five - Agreeableness (10 questions)
  { id: 31, scale: "agreeableness", text: "I sympathize with others' feelings, even bad morning faces.", options: 5 },
  { id: 32, scale: "agreeableness", text: "I avoid arguments when possible, unlike the podcast.", options: 5 },
  { id: 33, scale: "agreeableness", text: "I trust people until they give me a reason not to.", options: 5 },
  { id: 34, scale: "agreeableness", text: "I forgive easily, even ant-related transgressions.", options: 5 },
  { id: 35, scale: "agreeableness", text: "I'm a team player, not a solo act.", options: 5 },
  { id: 36, scale: "agreeableness", text: "I put others' needs before mine, sometimes.", options: 5 },
  { id: 37, scale: "agreeableness", text: "I'm polite to strangers, even bad tippers.", options: 5 },
  { id: 38, scale: "agreeableness", text: "I compromise in disagreements, like date planning.", options: 5 },
  { id: 39, scale: "agreeableness", text: "I'm warm and friendly, not cold and distant.", options: 5 },
  { id: 40, scale: "agreeableness", text: "I believe people are generally good, deep down.", options: 5 },
  
  // Big Five - Neuroticism (10 questions - reverse scored)
  { id: 41, scale: "neuroticism", text: "I get stressed easily, like Bobby before a special.", options: 5 },
  { id: 42, scale: "neuroticism", text: "I worry about things I can't control, like ant invasions.", options: 5 },
  { id: 43, scale: "neuroticism", text: "I get upset easily when plans change.", options: 5 },
  { id: 44, scale: "neuroticism", text: "I overthink social situations, like first messages.", options: 5 },
  { id: 45, scale: "neuroticism", text: "I have mood swings, from 🍜 to 💀 energy.", options: 5 },
  { id: 46, scale: "neuroticism", text: "I get irritated by small things, like bad jokes.", options: 5 },
  { id: 47, scale: "neuroticism", text: "I feel anxious about dating, like everyone does.", options: 5 },
  { id: 48, scale: "neuroticism", text: "I struggle to relax, even when I should.", options: 5 },
  { id: 49, scale: "neuroticism", text: "I get jealous sometimes, it happens.", options: 5 },
  { id: 50, scale: "neuroticism", text: "I feel insecure about my morning face, who doesn't?", options: 5 },
];

const PsychologicalScales = ({ onComplete, onProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scaleScores, setScaleScores] = useState({
    openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: []
  });

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    
    // Track scale scores
    const newScaleScores = { ...scaleScores };
    newScaleScores[currentQ.scale].push(value);
    setScaleScores(newScaleScores);
    
    onProgress(progress);
    
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
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1">
            <div className="bg-cheeto h-1 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="bg-[#1a1f2e] rounded-xl border border-gray-800 p-6 mb-4">
          <div className="text-center mb-6">
            <span className="text-cheeto text-xs font-semibold uppercase tracking-wider">
              {currentQ.scale}
            </span>
          </div>
          
          <p className="text-white text-lg text-center mb-8 leading-relaxed">
            {currentQ.text}
          </p>
          
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className="w-full py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white hover:border-cheeto transition"
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