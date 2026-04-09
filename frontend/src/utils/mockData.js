// frontend/src/utils/mockData.js
// Robust mock data for v1 demo - 3x bigger with funny Bad Friends content

// Morning Faces Mock Data (15 examples)
const funnyMorningFaces = [
  {
    id: 'mock_face_1',
    user_id: 'sarah_k',
    users: { name: 'sarah_k' },
    image_url: 'https://randomuser.me/api/portraits/women/68.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    reaction_count_bobo: 12,
    reaction_count_cheeto: 5,
    reaction_count_tiger: 2,
    reaction_count_dead: 8,
    caption: "I look like I fought a pillow and lost. And the pillow won."
  },
  {
    id: 'mock_face_2',
    user_id: 'mike_j',
    users: { name: 'mike_j' },
    image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reaction_count_bobo: 3,
    reaction_count_cheeto: 8,
    reaction_count_tiger: 1,
    reaction_count_dead: 4,
    caption: "Morning. Don't look at me. Seriously. I mean it."
  },
  {
    id: 'mock_face_3',
    user_id: 'alex_t',
    users: { name: 'alex_t' },
    image_url: 'https://randomuser.me/api/portraits/men/45.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reaction_count_bobo: 24,
    reaction_count_cheeto: 12,
    reaction_count_tiger: 7,
    reaction_count_dead: 19,
    caption: "My face this morning looks like Bobby Lee after a late night ant trap hunt."
  },
  {
    id: 'mock_face_4',
    user_id: 'jess_w',
    users: { name: 'jess_w' },
    image_url: 'https://randomuser.me/api/portraits/women/23.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    reaction_count_bobo: 18,
    reaction_count_cheeto: 22,
    reaction_count_tiger: 4,
    reaction_count_dead: 15,
    caption: "I woke up like this. Unfortunately."
  },
  {
    id: 'mock_face_5',
    user_id: 'chris_p',
    users: { name: 'chris_p' },
    image_url: 'https://randomuser.me/api/portraits/men/52.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    reaction_count_bobo: 7,
    reaction_count_cheeto: 3,
    reaction_count_tiger: 9,
    reaction_count_dead: 2,
    caption: "Coffee hasn't hit yet. Send help. And ant traps."
  },
  {
    id: 'mock_face_6',
    user_id: 'emma_l',
    users: { name: 'emma_l' },
    image_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    reaction_count_bobo: 34,
    reaction_count_cheeto: 18,
    reaction_count_tiger: 11,
    reaction_count_dead: 27,
    caption: "This is my 'I haven't had my Klondike bar yet' face."
  },
  {
    id: 'mock_face_7',
    user_id: 'david_r',
    users: { name: 'david_r' },
    image_url: 'https://randomuser.me/api/portraits/men/67.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    reaction_count_bobo: 5,
    reaction_count_cheeto: 2,
    reaction_count_tiger: 1,
    reaction_count_dead: 3,
    caption: "I regret everything. Especially last night's decisions."
  },
  {
    id: 'mock_face_8',
    user_id: 'olivia_m',
    users: { name: 'olivia_m' },
    image_url: 'https://randomuser.me/api/portraits/women/89.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    reaction_count_bobo: 45,
    reaction_count_cheeto: 31,
    reaction_count_tiger: 22,
    reaction_count_dead: 38,
    caption: "My ant trap collection is bigger than my will to live this morning."
  },
  {
    id: 'mock_face_9',
    user_id: 'ryan_k',
    users: { name: 'ryan_k' },
    image_url: 'https://randomuser.me/api/portraits/men/23.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    reaction_count_bobo: 9,
    reaction_count_cheeto: 14,
    reaction_count_tiger: 6,
    reaction_count_dead: 11,
    caption: "Is it bedtime yet? No? Okay."
  },
  {
    id: 'mock_face_10',
    user_id: 'sophie_c',
    users: { name: 'sophie_c' },
    image_url: 'https://randomuser.me/api/portraits/women/34.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    reaction_count_bobo: 56,
    reaction_count_cheeto: 42,
    reaction_count_tiger: 28,
    reaction_count_dead: 47,
    caption: "Bobby Lee would be proud of this chaos."
  },
  {
    id: 'mock_face_11',
    user_id: 'tom_b',
    users: { name: 'tom_b' },
    image_url: 'https://randomuser.me/api/portraits/men/78.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    reaction_count_bobo: 2,
    reaction_count_cheeto: 1,
    reaction_count_tiger: 0,
    reaction_count_dead: 1,
    caption: "First morning face. Be gentle."
  },
  {
    id: 'mock_face_12',
    user_id: 'lisa_n',
    users: { name: 'lisa_n' },
    image_url: 'https://randomuser.me/api/portraits/women/56.jpg',
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    reaction_count_bobo: 23,
    reaction_count_cheeto: 19,
    reaction_count_tiger: 14,
    reaction_count_dead: 21,
    caption: "I've seen better days. Also worse days. This is somewhere in between."
  }
];

// Answers Mock Data (15 examples)
const funnyAnswers = [
  {
    id: 'mock_answer_1',
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
    id: 'mock_answer_2',
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
    id: 'mock_answer_3',
    user_id: 'damian',
    users: { name: 'Damian' },
    answer_text: "I'd negotiate. Klondike AND a photo with JLC. The toe is non-negotiable.",
    cmi_score: 94,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    reaction_count_bobo: 42,
    reaction_count_cheeto: 28,
    reaction_count_tiger: 15,
    reaction_count_dead: 37
  },
  {
    id: 'mock_answer_4',
    user_id: 'alex_t',
    users: { name: 'alex_t' },
    answer_text: "I'd do it for free. Then ask for seconds. Don't judge me.",
    cmi_score: 88,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    reaction_count_bobo: 31,
    reaction_count_cheeto: 22,
    reaction_count_tiger: 8,
    reaction_count_dead: 26
  },
  {
    id: 'mock_answer_5',
    user_id: 'jess_w',
    users: { name: 'jess_w' },
    answer_text: "Only if Andrew Santino watches and provides commentary.",
    cmi_score: 91,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reaction_count_bobo: 27,
    reaction_count_cheeto: 34,
    reaction_count_tiger: 6,
    reaction_count_dead: 29
  },
  {
    id: 'mock_answer_6',
    user_id: 'chris_p',
    users: { name: 'chris_p' },
    answer_text: "Is the Klondike from the freezer or just the box? Important distinction.",
    cmi_score: 85,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    reaction_count_bobo: 19,
    reaction_count_cheeto: 11,
    reaction_count_tiger: 4,
    reaction_count_dead: 14
  },
  {
    id: 'mock_answer_7',
    user_id: 'emma_l',
    users: { name: 'emma_l' },
    answer_text: "I'd rather fight 100 ant-sized Bobby Lees than suck any toe. Sorry not sorry.",
    cmi_score: 96,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    reaction_count_bobo: 53,
    reaction_count_cheeto: 41,
    reaction_count_tiger: 22,
    reaction_count_dead: 48
  },
  {
    id: 'mock_answer_8',
    user_id: 'david_r',
    users: { name: 'david_r' },
    answer_text: "My tiredness is a Category 5 hurricane with a side of existential dread.",
    cmi_score: 89,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    reaction_count_bobo: 35,
    reaction_count_cheeto: 18,
    reaction_count_tiger: 27,
    reaction_count_dead: 22
  },
  {
    id: 'mock_answer_9',
    user_id: 'olivia_m',
    users: { name: 'olivia_m' },
    answer_text: "I'm not feeling guilty about that text I sent at 2am. He deserved it.",
    cmi_score: 93,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    reaction_count_bobo: 44,
    reaction_count_cheeto: 38,
    reaction_count_tiger: 12,
    reaction_count_dead: 41
  },
  {
    id: 'mock_answer_10',
    user_id: 'ryan_k',
    users: { name: 'ryan_k' },
    answer_text: "93 ant traps. No more. No less. Bobby's math is flawless.",
    cmi_score: 87,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    reaction_count_bobo: 16,
    reaction_count_cheeto: 23,
    reaction_count_tiger: 9,
    reaction_count_dead: 19
  },
  {
    id: 'mock_answer_11',
    user_id: 'sophie_c',
    users: { name: 'sophie_c' },
    answer_text: "I'm a Rudy in group projects. I'll admit it. I bring snacks and moral support.",
    cmi_score: 82,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
    reaction_count_bobo: 13,
    reaction_count_cheeto: 7,
    reaction_count_tiger: 5,
    reaction_count_dead: 11
  },
  {
    id: 'mock_answer_12',
    user_id: 'tom_b',
    users: { name: 'tom_b' },
    answer_text: "Breakfast tacos are overrated? That's like saying Bobby is too quiet.",
    cmi_score: 79,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    reaction_count_bobo: 21,
    reaction_count_cheeto: 14,
    reaction_count_tiger: 7,
    reaction_count_dead: 16
  },
  {
    id: 'mock_answer_13',
    user_id: 'lisa_n',
    users: { name: 'lisa_n' },
    answer_text: "My morning face movie title: 'Revenge of the Sith: The Bedhead Years'",
    cmi_score: 90,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
    reaction_count_bobo: 28,
    reaction_count_cheeto: 19,
    reaction_count_tiger: 11,
    reaction_count_dead: 24
  },
  {
    id: 'mock_answer_14',
    user_id: 'damian',
    users: { name: 'Damian' },
    answer_text: "My Bobo energy is at an 11 today. Someone call Andrew to roast me.",
    cmi_score: 95,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    reaction_count_bobo: 47,
    reaction_count_cheeto: 36,
    reaction_count_tiger: 19,
    reaction_count_dead: 43
  },
  {
    id: 'mock_answer_15',
    user_id: 'sarah_k',
    users: { name: 'sarah_k' },
    answer_text: "Let the ant keep the cracker. That ant earned it through sheer determination.",
    cmi_score: 88,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    reaction_count_bobo: 32,
    reaction_count_cheeto: 17,
    reaction_count_tiger: 23,
    reaction_count_dead: 28
  }
];

// Discover Candidates Mock Data (10 examples)
const discoverCandidates = [
  {
    id: 'discover_1',
    user_id: 'sarah_k',
    user_name: 'sarah_k',
    answer_text: "Only if she paints it like a Klondike wrapper first.",
    cmi_score: 92,
    morning_face_url: 'https://randomuser.me/api/portraits/women/68.jpg',
    past_funny_answers: [
      "Ants on the counter? That's their house now.",
      "My tiredness is a Category 5 hurricane."
    ]
  },
  {
    id: 'discover_2',
    user_id: 'alex_t',
    user_name: 'alex_t',
    answer_text: "I'd do it for free. Then ask for seconds.",
    cmi_score: 88,
    morning_face_url: 'https://randomuser.me/api/portraits/men/45.jpg',
    past_funny_answers: [
      "93 ant traps. Bobby's math is flawless.",
      "I regret everything about last night."
    ]
  },
  {
    id: 'discover_3',
    user_id: 'jess_w',
    user_name: 'jess_w',
    answer_text: "Only if Andrew Santino watches and provides commentary.",
    cmi_score: 91,
    morning_face_url: 'https://randomuser.me/api/portraits/women/23.jpg',
    past_funny_answers: [
      "I'm a Rudy in group projects. I bring snacks.",
      "Coffee hasn't hit yet. Send help."
    ]
  },
  {
    id: 'discover_4',
    user_id: 'emma_l',
    user_name: 'emma_l',
    answer_text: "I'd rather fight 100 ant-sized Bobby Lees.",
    cmi_score: 96,
    morning_face_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    past_funny_answers: [
      "My Bobo energy is at an 11 today.",
      "Bobby Lee would be proud of this chaos."
    ]
  },
  {
    id: 'discover_5',
    user_id: 'olivia_m',
    user_name: 'olivia_m',
    answer_text: "I'm not feeling guilty about that text I sent at 2am.",
    cmi_score: 93,
    morning_face_url: 'https://randomuser.me/api/portraits/women/89.jpg',
    past_funny_answers: [
      "My ant trap collection is bigger than my will to live.",
      "Is it bedtime yet? No? Okay."
    ]
  },
  {
    id: 'discover_6',
    user_id: 'sophie_c',
    user_name: 'sophie_c',
    answer_text: "I'm a Rudy in group projects. I'll admit it.",
    cmi_score: 82,
    morning_face_url: 'https://randomuser.me/api/portraits/women/34.jpg',
    past_funny_answers: [
      "Breakfast tacos are overrated? Blasphemy.",
      "First morning face. Be gentle."
    ]
  },
  {
    id: 'discover_7',
    user_id: 'mike_j',
    user_name: 'mike_j',
    answer_text: "Which toe? Pinky? Maybe. Big toe? Hard pass.",
    cmi_score: 78,
    morning_face_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    past_funny_answers: [
      "Morning. Don't look at me.",
      "I've seen better days."
    ]
  },
  {
    id: 'discover_8',
    user_id: 'chris_p',
    user_name: 'chris_p',
    answer_text: "Is the Klondike from the freezer or just the box?",
    cmi_score: 85,
    morning_face_url: 'https://randomuser.me/api/portraits/men/52.jpg',
    past_funny_answers: [
      "Coffee hasn't hit yet. Send ant traps.",
      "I regret everything."
    ]
  },
  {
    id: 'discover_9',
    user_id: 'david_r',
    user_name: 'david_r',
    answer_text: "My tiredness is a Category 5 hurricane.",
    cmi_score: 89,
    morning_face_url: 'https://randomuser.me/api/portraits/men/67.jpg',
    past_funny_answers: [
      "First morning face. Be gentle.",
      "Is it bedtime yet?"
    ]
  },
  {
    id: 'discover_10',
    user_id: 'lisa_n',
    user_name: 'lisa_n',
    answer_text: "My morning face movie title: 'Revenge of the Sith'",
    cmi_score: 90,
    morning_face_url: 'https://randomuser.me/api/portraits/women/56.jpg',
    past_funny_answers: [
      "I've seen better days. Also worse days.",
      "This is somewhere in between."
    ]
  }
];

// Export functions
export const getMockFeedData = (type, userName = 'Damian') => {
  if (type === 'faces') return [...funnyMorningFaces];
  if (type === 'answers') return [...funnyAnswers];
  return [];
};

export const getMockDiscoverCandidates = () => {
  return [...discoverCandidates];
};

export const getMockMatches = () => {
  return discoverCandidates.slice(0, 5).map(candidate => ({
    id: `match_${candidate.user_id}`,
    user_id: candidate.user_id,
    name: candidate.user_name,
    matched_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 7)).toISOString(),
    morning_face_url: candidate.morning_face_url
  }));
};

export const getMotivationalMessage = (cmiScore) => {
  if (cmiScore >= 90) return "🔥 You're in the top 5% of funniest people here! Bobby would approve.";
  if (cmiScore >= 75) return "💀 Top 15%! Your humor is officially Worst Friend material.";
  if (cmiScore >= 60) return "🍜 Top 30%! Keep roasting, you're getting there.";
  if (cmiScore >= 40) return "🐯 Middle of the pack. Time to channel your inner Santino.";
  return "🌅 You showed up. That's half the battle. Tomorrow, bring the jokes.";
};