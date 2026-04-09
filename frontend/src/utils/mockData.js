// Funny mock data for Damian's demo
export const getMockFeedData = (type, userName = 'Damian') => {
  const funnyMorningFaces = [
    {
      id: 'mock1',
      user_id: 'sarah_k',
      users: { name: 'sarah_k' },
      image_url: 'https://randomuser.me/api/portraits/women/68.jpg',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      reaction_count_bobo: 12,
      reaction_count_cheeto: 5,
      reaction_count_tiger: 2,
      reaction_count_dead: 8,
      caption: "I look like I fought a pillow and lost."
    },
    {
      id: 'mock2',
      user_id: 'mike_j',
      users: { name: 'mike_j' },
      image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      reaction_count_bobo: 3,
      reaction_count_cheeto: 8,
      reaction_count_tiger: 1,
      reaction_count_dead: 4,
      caption: "Morning. Don't look at me."
    },
    {
      id: 'mock3',
      user_id: 'alex_t',
      users: { name: 'alex_t' },
      image_url: 'https://randomuser.me/api/portraits/men/45.jpg',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      reaction_count_bobo: 24,
      reaction_count_cheeto: 12,
      reaction_count_tiger: 7,
      reaction_count_dead: 19,
      caption: "My face this morning looks like Bobby Lee after a late night ant trap hunt."
    }
  ];
  
  const funnyAnswers = [
    {
      id: 'mock_a1',
      user_id: 'sarah_k',
      users: { name: 'sarah_k' },
      answer_text: "Only if she paints it like a Klondike wrapper first.",
      cmi_score: 92,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      reaction_count_bobo: 24,
      reaction_count_cheeto: 12,
      reaction_count_tiger: 0,
      reaction_count_dead: 18
    },
    {
      id: 'mock_a2',
      user_id: 'mike_j',
      users: { name: 'mike_j' },
      answer_text: "Which toe? Pinky? Maybe. Big toe? Hard pass, Bobby.",
      cmi_score: 78,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      reaction_count_bobo: 8,
      reaction_count_cheeto: 15,
      reaction_count_tiger: 3,
      reaction_count_dead: 9
    },
    {
      id: 'mock_a3',
      user_id: 'damian',
      users: { name: 'Damian' },
      answer_text: "I'd negotiate. Klondike AND a photo with JLC. The toe is non-negotiable.",
      cmi_score: 94,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      reaction_count_bobo: 42,
      reaction_count_cheeto: 28,
      reaction_count_tiger: 15,
      reaction_count_dead: 37
    }
  ];
  
  if (type === 'faces') return funnyMorningFaces;
  return funnyAnswers;
};

export const getMotivationalMessage = (cmiScore) => {
  if (cmiScore >= 90) return "🔥 You're in the top 5% of funniest people here! Bobby would approve.";
  if (cmiScore >= 75) return "💀 Top 15%! Your humor is officially Worst Friend material.";
  if (cmiScore >= 60) return "🍜 Top 30%! Keep roasting, you're getting there.";
  if (cmiScore >= 40) return "🐯 Middle of the pack. Time to channel your inner Santino.";
  return "🌅 You showed up. That's half the battle. Tomorrow, bring the jokes.";
};