export interface Concept {
  id: string;
  name: string;
  mastery: number;
  confidence: 'high' | 'medium' | 'low';
  status: 'mastered' | 'learning' | 'needs-review' | 'just-started' | 'not-started';
  lastStudied?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface Lesson {
  id: string;
  title: string;
  module: string;
  moduleNumber: number;
  lessonNumber: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
}

export interface SubjectData {
  id: 'programming' | 'writing' | 'science';
  name: string;
  concepts: Concept[];
  lessons: Lesson[];
  quizQuestions: QuizQuestion[];
  hobbyExamples: {
    hobby: string;
    concept: string;
    example: string;
    code?: string;
  }[];
}

export const subjectData: Record<string, SubjectData> = {
  programming: {
    id: 'programming',
    name: 'Introductory Programming',
    concepts: [
      { id: 'variables', name: 'Variables & Data Types', mastery: 85, confidence: 'high', status: 'mastered', lastStudied: '1 day ago' },
      { id: 'functions', name: 'Functions', mastery: 70, confidence: 'medium', status: 'learning', lastStudied: '2 hours ago' },
      { id: 'loops', name: 'Loops', mastery: 45, confidence: 'low', status: 'needs-review', lastStudied: '3 days ago', priority: 'high' },
      { id: 'arrays', name: 'Arrays', mastery: 30, confidence: 'low', status: 'just-started', lastStudied: '1 week ago', priority: 'medium' },
      { id: 'objects', name: 'Objects', mastery: 60, confidence: 'medium', status: 'learning', lastStudied: '2 days ago' },
      { id: 'conditionals', name: 'Conditionals', mastery: 75, confidence: 'medium', status: 'learning', lastStudied: '1 day ago' },
    ],
    lessons: [
      {
        id: 'prog-1',
        title: 'Introduction to Variables',
        module: 'Fundamentals',
        moduleNumber: 1,
        lessonNumber: 1,
        duration: '25 min',
        difficulty: 'Beginner',
        description: 'Learn about variables, data types, and how to store information in your programs.',
        icon: '📦'
      },
      {
        id: 'prog-2',
        title: 'JavaScript Functions Deep Dive',
        module: 'Core Concepts',
        moduleNumber: 2,
        lessonNumber: 3,
        duration: '30 min',
        difficulty: 'Intermediate',
        description: 'Master function declarations, expressions, and arrow functions.',
        icon: '⚡'
      },
      {
        id: 'prog-3',
        title: 'Working with Loops',
        module: 'Control Flow',
        moduleNumber: 2,
        lessonNumber: 5,
        duration: '35 min',
        difficulty: 'Intermediate',
        description: 'Understand for loops, while loops, and iteration patterns.',
        icon: '🔁'
      },
    ],
    quizQuestions: [
      {
        id: 'prog-q1',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['let x = 5;', 'variable x = 5;', 'var: x = 5;', 'int x = 5;'],
        correctAnswer: 0,
        explanation: 'In JavaScript, we use "let" or "const" to declare variables. "let" is used for variables that can be reassigned.',
        concept: 'Variables'
      },
      {
        id: 'prog-q2',
        question: 'What does a function return if no return statement is specified?',
        options: ['0', 'null', 'undefined', 'false'],
        correctAnswer: 2,
        explanation: 'JavaScript functions return "undefined" by default if no return statement is provided.',
        concept: 'Functions'
      },
      {
        id: 'prog-q3',
        question: 'Which loop is best when you know the number of iterations in advance?',
        options: ['while loop', 'for loop', 'do-while loop', 'forEach loop'],
        correctAnswer: 1,
        explanation: 'A for loop is ideal when you know exactly how many times you want to iterate.',
        concept: 'Loops'
      },
      {
        id: 'prog-q4',
        question: 'What is the output of: console.log(typeof [1, 2, 3])?',
        options: ['array', 'object', 'list', 'collection'],
        correctAnswer: 1,
        explanation: 'In JavaScript, arrays are actually objects. The typeof operator returns "object" for arrays.',
        concept: 'Arrays'
      },
      {
        id: 'prog-q5',
        question: 'How do you access a property called "name" in an object "user"?',
        options: ['user->name', 'user.name', 'user[name]', 'user::name'],
        correctAnswer: 1,
        explanation: 'You can access object properties using dot notation: object.property',
        concept: 'Objects'
      },
    ],
    hobbyExamples: [
      {
        hobby: 'gaming',
        concept: 'Variables',
        example: 'Think of variables like a player\'s health bar. Just like health can increase or decrease during gameplay, a variable\'s value can change throughout your program.',
        code: `let playerHealth = 100;\nplayerHealth -= 20; // Takes damage\nplayerHealth += 15; // Healing potion\nconsole.log(playerHealth); // 95`
      },
      {
        hobby: 'gaming',
        concept: 'Functions',
        example: 'Functions are like power-ups in a game. You define them once and can use them whenever you need that ability!',
        code: `function calculateDamage(base, isCritical) {\n  return isCritical ? base * 2 : base;\n}\n\nlet damage = calculateDamage(50, true);\nconsole.log(damage); // 100`
      },
      {
        hobby: 'music',
        concept: 'Arrays',
        example: 'Think of arrays as playlists. Just like a playlist contains multiple songs in order, an array stores multiple values in sequence.',
        code: `let playlist = ['Song 1', 'Song 2', 'Song 3'];\nconsole.log(playlist[0]); // 'Song 1'\nplaylist.push('Song 4'); // Add to end`
      },
    ]
  },

  writing: {
    id: 'writing',
    name: 'Academic Writing',
    concepts: [
      { id: 'thesis', name: 'Thesis Statements', mastery: 70, confidence: 'medium', status: 'learning', lastStudied: '1 day ago' },
      { id: 'structure', name: 'Essay Structure', mastery: 85, confidence: 'high', status: 'mastered', lastStudied: '2 days ago' },
      { id: 'citation', name: 'Citation & References', mastery: 50, confidence: 'low', status: 'needs-review', lastStudied: '5 days ago', priority: 'high' },
      { id: 'analysis', name: 'Critical Analysis', mastery: 40, confidence: 'low', status: 'just-started', lastStudied: '1 week ago', priority: 'medium' },
      { id: 'argumentation', name: 'Argumentation', mastery: 65, confidence: 'medium', status: 'learning', lastStudied: '3 days ago' },
      { id: 'revision', name: 'Revision Strategies', mastery: 55, confidence: 'medium', status: 'learning', lastStudied: '4 days ago' },
    ],
    lessons: [
      {
        id: 'writ-1',
        title: 'Crafting Strong Thesis Statements',
        module: 'Foundations',
        moduleNumber: 1,
        lessonNumber: 2,
        duration: '30 min',
        difficulty: 'Beginner',
        description: 'Learn to write clear, arguable thesis statements that guide your essay.',
        icon: '✍️'
      },
      {
        id: 'writ-2',
        title: 'The Five-Paragraph Essay',
        module: 'Structure',
        moduleNumber: 2,
        lessonNumber: 1,
        duration: '35 min',
        difficulty: 'Beginner',
        description: 'Master the classic essay structure with introduction, body, and conclusion.',
        icon: '📝'
      },
      {
        id: 'writ-3',
        title: 'APA Citation Guide',
        module: 'Research Skills',
        moduleNumber: 3,
        lessonNumber: 4,
        duration: '40 min',
        difficulty: 'Intermediate',
        description: 'Learn proper APA citation format for academic papers.',
        icon: '📚'
      },
    ],
    quizQuestions: [
      {
        id: 'writ-q1',
        question: 'What is the primary purpose of a thesis statement?',
        options: [
          'To summarize the entire essay',
          'To present the main argument or claim',
          'To introduce the topic',
          'To list all the evidence'
        ],
        correctAnswer: 1,
        explanation: 'A thesis statement presents your main argument or claim that the rest of the essay will support.',
        concept: 'Thesis Statements'
      },
      {
        id: 'writ-q2',
        question: 'In the five-paragraph essay structure, how many body paragraphs should there be?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctAnswer: 1,
        explanation: 'The five-paragraph essay consists of an introduction, three body paragraphs, and a conclusion.',
        concept: 'Essay Structure'
      },
      {
        id: 'writ-q3',
        question: 'When should you cite a source in your essay?',
        options: [
          'Only for direct quotes',
          'Only for statistics',
          'For both direct quotes and paraphrased ideas',
          'Only at the end of the essay'
        ],
        correctAnswer: 2,
        explanation: 'You must cite sources for both direct quotes and paraphrased ideas to avoid plagiarism.',
        concept: 'Citation'
      },
      {
        id: 'writ-q4',
        question: 'What is critical analysis?',
        options: [
          'Summarizing a text',
          'Criticizing everything about a text',
          'Evaluating arguments and evidence in a text',
          'Copying ideas from a text'
        ],
        correctAnswer: 2,
        explanation: 'Critical analysis involves carefully evaluating the arguments, evidence, and reasoning in a text.',
        concept: 'Critical Analysis'
      },
      {
        id: 'writ-q5',
        question: 'What is the best time to revise your essay?',
        options: [
          'Immediately after writing',
          'While you\'re still writing',
          'After taking a break from it',
          'Never revise, submit first draft'
        ],
        correctAnswer: 2,
        explanation: 'Taking a break before revising helps you see your work with fresh eyes and catch more errors.',
        concept: 'Revision'
      },
    ],
    hobbyExamples: [
      {
        hobby: 'music',
        concept: 'Essay Structure',
        example: 'Think of an essay like a song: the introduction sets the tone, body paragraphs develop themes like verses, and the conclusion brings it home like a final chorus.',
      },
      {
        hobby: 'gaming',
        concept: 'Argumentation',
        example: 'Building an argument is like leveling up a character. Each piece of evidence strengthens your position, just like gaining experience points.',
      },
    ]
  },

  science: {
    id: 'science',
    name: 'Science',
    concepts: [
      { id: 'scientific-method', name: 'Scientific Method', mastery: 80, confidence: 'high', status: 'mastered', lastStudied: '2 days ago' },
      { id: 'matter', name: 'States of Matter', mastery: 65, confidence: 'medium', status: 'learning', lastStudied: '1 day ago' },
      { id: 'energy', name: 'Energy & Forces', mastery: 55, confidence: 'medium', status: 'learning', lastStudied: '3 days ago' },
      { id: 'cells', name: 'Cell Biology', mastery: 40, confidence: 'low', status: 'needs-review', lastStudied: '1 week ago', priority: 'high' },
      { id: 'chemistry', name: 'Basic Chemistry', mastery: 50, confidence: 'low', status: 'just-started', lastStudied: '5 days ago', priority: 'medium' },
      { id: 'ecosystems', name: 'Ecosystems', mastery: 70, confidence: 'medium', status: 'learning', lastStudied: '2 days ago' },
    ],
    lessons: [
      {
        id: 'sci-1',
        title: 'Understanding the Scientific Method',
        module: 'Scientific Thinking',
        moduleNumber: 1,
        lessonNumber: 1,
        duration: '30 min',
        difficulty: 'Beginner',
        description: 'Learn how scientists ask questions and test hypotheses.',
        icon: '🔬'
      },
      {
        id: 'sci-2',
        title: 'States of Matter Explained',
        module: 'Physical Science',
        moduleNumber: 2,
        lessonNumber: 2,
        duration: '35 min',
        difficulty: 'Beginner',
        description: 'Explore solids, liquids, gases, and how matter changes form.',
        icon: '🧊'
      },
      {
        id: 'sci-3',
        title: 'Introduction to Cell Biology',
        module: 'Life Science',
        moduleNumber: 3,
        lessonNumber: 1,
        duration: '40 min',
        difficulty: 'Intermediate',
        description: 'Discover the building blocks of life and cell structures.',
        icon: '🧬'
      },
    ],
    quizQuestions: [
      {
        id: 'sci-q1',
        question: 'What is the first step in the scientific method?',
        options: [
          'Form a hypothesis',
          'Make an observation or ask a question',
          'Conduct an experiment',
          'Draw conclusions'
        ],
        correctAnswer: 1,
        explanation: 'The scientific method begins with making an observation or asking a question about the natural world.',
        concept: 'Scientific Method'
      },
      {
        id: 'sci-q2',
        question: 'Which state of matter has a definite shape and volume?',
        options: ['Gas', 'Liquid', 'Solid', 'Plasma'],
        correctAnswer: 2,
        explanation: 'Solids have both a definite shape and definite volume because their particles are tightly packed.',
        concept: 'States of Matter'
      },
      {
        id: 'sci-q3',
        question: 'What is energy?',
        options: [
          'The ability to do work',
          'A type of matter',
          'A chemical reaction',
          'A form of light'
        ],
        correctAnswer: 0,
        explanation: 'Energy is defined as the ability to do work or cause change.',
        concept: 'Energy'
      },
      {
        id: 'sci-q4',
        question: 'What is the basic unit of life?',
        options: ['Atom', 'Molecule', 'Cell', 'Organ'],
        correctAnswer: 2,
        explanation: 'The cell is the basic structural and functional unit of all living organisms.',
        concept: 'Cell Biology'
      },
      {
        id: 'sci-q5',
        question: 'What happens during a chemical reaction?',
        options: [
          'Matter is destroyed',
          'Atoms are rearranged to form new substances',
          'Energy disappears',
          'Nothing changes'
        ],
        correctAnswer: 1,
        explanation: 'In a chemical reaction, atoms are rearranged to form new substances, but matter is conserved.',
        concept: 'Chemistry'
      },
    ],
    hobbyExamples: [
      {
        hobby: 'gaming',
        concept: 'Energy',
        example: 'Energy in physics is like mana or stamina in games. It can be transferred or transformed, but the total amount stays the same (conservation of energy).',
      },
      {
        hobby: 'music',
        concept: 'Sound Waves',
        example: 'Sound travels in waves, just like the vibrations you feel from a speaker. Different frequencies create different pitches in music.',
      },
    ]
  },
};

export function getSubjectData(subjectId: string): SubjectData | null {
  return subjectData[subjectId] || null;
}

export function getSubjectConcepts(subjectId: string): Concept[] {
  const subject = getSubjectData(subjectId);
  return subject ? subject.concepts : [];
}

export function getSubjectLessons(subjectId: string): Lesson[] {
  const subject = getSubjectData(subjectId);
  return subject ? subject.lessons : [];
}

export function getSubjectQuizQuestions(subjectId: string): QuizQuestion[] {
  const subject = getSubjectData(subjectId);
  return subject ? subject.quizQuestions : [];
}

export function getSubjectHobbyExamples(subjectId: string) {
  const subject = getSubjectData(subjectId);
  return subject ? subject.hobbyExamples : [];
}
