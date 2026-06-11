type GameMode = 'addsub' | 'mixed' | 'multiply';

interface Question {
  id: number;
  expression: string;
  correctAnswer: number;
  options: number[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateAddSubQuestion(id: number, op: '+' | '-'): Question {
  let a: number, b: number, answer: number;

  if (op === '+') {
    a = randInt(1, 50);
    b = randInt(1, 50);
    answer = a + b;
  } else {
    a = randInt(10, 99);
    b = randInt(1, a);
    answer = a - b;
  }

  const expression = `${a} ${op} ${b}`;
  return { id, expression, correctAnswer: answer, options: generateOptions(answer) };
}

function generateOptions(answer: number): number[] {
  const optionSet = new Set<number>([answer]);
  while (optionSet.size < 3) {
    const offset = randInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
    const fake = answer + offset;
    if (fake >= 0 && fake !== answer) {
      optionSet.add(fake);
    }
  }
  return shuffle([...optionSet]);
}

function generateMultiplyQuestion(id: number, usedKeys: Set<string>): Question {
  let a: number, b: number, key: string;
  do {
    a = randInt(1, 9);
    b = randInt(1, 9);
    key = `${Math.min(a, b)}x${Math.max(a, b)}`;
  } while (usedKeys.has(key));
  usedKeys.add(key);

  const answer = a * b;
  const expression = `${a} × ${b}`;
  return { id, expression, correctAnswer: answer, options: generateOptions(answer) };
}

export function generateQuestions(count: number = 50, mode: GameMode = 'addsub'): Question[] {
  const questions: Question[] = [];
  const usedMultiplyKeys = new Set<string>();

  for (let i = 0; i < count; i++) {
    let op: '+' | '-' | '×';
    if (mode === 'addsub') {
      op = Math.random() < 0.5 ? '+' : '-';
    } else if (mode === 'multiply') {
      op = '×';
    } else {
      const r = Math.random();
      op = r < 0.33 ? '+' : r < 0.66 ? '-' : '×';
    }

    if (op === '×') {
      questions.push(generateMultiplyQuestion(i + 1, usedMultiplyKeys));
    } else {
      questions.push(generateAddSubQuestion(i + 1, op));
    }
  }
  return questions;
}

export type { Question, GameMode };
