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
    name: 'Programming',
    concepts: [
      { id: 'variables', name: 'Variables', mastery: 82, confidence: 'high', status: 'mastered', lastStudied: '1 day ago' },
      { id: 'conditionals', name: 'Conditionals', mastery: 68, confidence: 'medium', status: 'learning', lastStudied: '2 days ago' },
      { id: 'loops', name: 'Loops', mastery: 44, confidence: 'low', status: 'needs-review', lastStudied: '3 days ago', priority: 'high' },
      { id: 'functions', name: 'Functions', mastery: 61, confidence: 'medium', status: 'learning', lastStudied: '2 hours ago' },
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
        title: 'Working with Conditionals',
        module: 'Decision Making',
        moduleNumber: 2,
        lessonNumber: 2,
        duration: '30 min',
        difficulty: 'Intermediate',
        description: 'Learn how programs choose different paths using if, else, and comparison operators.',
        icon: '🔀'
      },
      {
        id: 'prog-3',
        title: 'Loop Patterns',
        module: 'Iteration',
        moduleNumber: 2,
        lessonNumber: 4,
        duration: '35 min',
        difficulty: 'Intermediate',
        description: 'Understand for loops, while loops, and repetition patterns.',
        icon: '🔁'
      },
      {
        id: 'prog-4',
        title: 'Functions and Reusable Code',
        module: 'Core Concepts',
        moduleNumber: 3,
        lessonNumber: 1,
        duration: '30 min',
        difficulty: 'Intermediate',
        description: 'Learn how functions make code reusable, organized, and easier to explain.',
        icon: '⚡'
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
        question: 'Which keyword is commonly used to make a decision in code?',
        options: ['loop', 'if', 'return', 'print'],
        correctAnswer: 1,
        explanation: 'Conditionals use if, else if, and else to choose different actions.',
        concept: 'Conditionals'
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
        question: 'What is the purpose of a function?',
        options: ['To store data', 'To repeat code with a loop', 'To group reusable instructions', 'To display output only'],
        correctAnswer: 2,
        explanation: 'Functions group reusable instructions so you can use them again without rewriting code.',
        concept: 'Functions'
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
        concept: 'Conditionals',
        example: 'Think of music recommendations like a playlist branch: if you like one style, the app chooses that path; otherwise it picks another.',
        code: `let playlist = ['Song 1', 'Song 2', 'Song 3'];\nconsole.log(playlist[0]); // 'Song 1'\nplaylist.push('Song 4'); // Add to end`
      },
    ]
  },

  writing: {
    id: 'writing',
    name: 'Academic Writing',
    concepts: [
      { id: 'thesis', name: 'Thesis Statement', mastery: 69, confidence: 'medium', status: 'learning', lastStudied: '1 day ago' },
      { id: 'paragraphs', name: 'Paragraph Structure', mastery: 83, confidence: 'high', status: 'mastered', lastStudied: '2 days ago' },
      { id: 'grammar', name: 'Grammar Clarity', mastery: 49, confidence: 'low', status: 'needs-review', lastStudied: '5 days ago', priority: 'high' },
      { id: 'referencing', name: 'Referencing', mastery: 41, confidence: 'low', status: 'just-started', lastStudied: '1 week ago', priority: 'medium' },
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
        title: 'Building Strong Paragraphs',
        module: 'Structure',
        moduleNumber: 2,
        lessonNumber: 1,
        duration: '35 min',
        difficulty: 'Beginner',
        description: 'Learn how topic sentences, support, and explanation work together inside one paragraph.',
        icon: '📝'
      },
      {
        id: 'writ-3',
        title: 'Grammar and Clarity Review',
        module: 'Language Use',
        moduleNumber: 3,
        lessonNumber: 4,
        duration: '40 min',
        difficulty: 'Intermediate',
        description: 'Improve sentence clarity, punctuation, and grammar for academic writing.',
        icon: '📚'
      },
      {
        id: 'writ-4',
        title: 'Referencing Sources',
        module: 'Research Skills',
        moduleNumber: 3,
        lessonNumber: 5,
        duration: '35 min',
        difficulty: 'Intermediate',
        description: 'Learn how to cite sources and reference information correctly.',
        icon: '🔖'
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
        concept: 'Thesis Statement'
      },
      {
        id: 'writ-q2',
        question: 'What belongs in a strong paragraph?',
        options: ['One unrelated idea only', 'A topic sentence, support, and explanation', 'Only a quotation', 'A title page'],
        correctAnswer: 1,
        explanation: 'A strong paragraph has one main idea supported by evidence and explanation.',
        concept: 'Paragraph Structure'
      },
      {
        id: 'writ-q3',
        question: 'Which sentence is clearest?',
        options: ['It was like, stuff happened and then it was good.', 'The experiment showed a clear increase in temperature.', 'Thing change.', 'Very good writing is.'],
        correctAnswer: 1,
        explanation: 'Clear academic writing uses specific words and complete sentences.',
        concept: 'Grammar Clarity'
      },
      {
        id: 'writ-q4',
        question: 'When should you cite a source in your essay?',
        options: [
          'Only for direct quotes',
          'Only for statistics',
          'For both direct quotes and paraphrased ideas',
          'Only at the end of the essay'
        ],
        correctAnswer: 2,
        explanation: 'You must cite sources for both direct quotes and paraphrased ideas to avoid plagiarism.',
        concept: 'Referencing'
      },
    ],
    hobbyExamples: [
      {
        hobby: 'music',
        concept: 'Paragraph Structure',
        example: 'Think of an essay like a song: the introduction sets the tone, body paragraphs develop themes like verses, and the conclusion brings it home like a final chorus.',
      },
      {
        hobby: 'gaming',
        concept: 'Thesis Statement',
        example: 'Building an argument is like leveling up a character. Each piece of evidence strengthens your position, just like gaining experience points.',
      },
    ]
  },

  science: {
    id: 'science',
    name: 'Science',
    concepts: [
      { id: 'scientific-method', name: 'Scientific Method', mastery: 79, confidence: 'high', status: 'mastered', lastStudied: '2 days ago' },
      { id: 'matter-energy', name: 'Matter and Energy', mastery: 64, confidence: 'medium', status: 'learning', lastStudied: '1 day ago' },
      { id: 'forces-motion', name: 'Forces and Motion', mastery: 54, confidence: 'medium', status: 'learning', lastStudied: '3 days ago' },
      { id: 'basic-biology', name: 'Basic Biology', mastery: 43, confidence: 'low', status: 'needs-review', lastStudied: '1 week ago', priority: 'high' },
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
        title: 'Matter and Energy Basics',
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
        title: 'Forces and Motion',
        module: 'Physical Science',
        moduleNumber: 3,
        lessonNumber: 1,
        duration: '40 min',
        difficulty: 'Intermediate',
        description: 'Discover how force, motion, and speed affect moving objects.',
        icon: '🧲'
      },
      {
        id: 'sci-4',
        title: 'Basics of Biology',
        module: 'Life Science',
        moduleNumber: 3,
        lessonNumber: 3,
        duration: '35 min',
        difficulty: 'Intermediate',
        description: 'Learn about cells, organisms, and the basic building blocks of living things.',
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
        question: 'Which choice best describes matter and energy?',
        options: ['Matter has mass and energy can cause change', 'They are the same thing', 'Energy is only light', 'Matter cannot move'],
        correctAnswer: 2,
        explanation: 'Matter has mass and takes up space, while energy is the ability to do work or cause change.',
        concept: 'Matter and Energy'
      },
      {
        id: 'sci-q3',
        question: 'Which idea is most related to forces and motion?',
        options: ['An object moving faster when pushed', 'A chemical formula', 'A word list', 'A cell dividing'],
        correctAnswer: 0,
        explanation: 'Forces change motion. Pushing or pulling an object can change how fast or in what direction it moves.',
        concept: 'Forces and Motion'
      },
      {
        id: 'sci-q4',
        question: 'What is the basic unit of life?',
        options: ['Atom', 'Molecule', 'Cell', 'Organ'],
        correctAnswer: 2,
        explanation: 'The cell is the basic structural and functional unit of all living organisms.',
        concept: 'Basic Biology'
      },
    ],
    hobbyExamples: [
      {
        hobby: 'gaming',
        concept: 'Forces and Motion',
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
