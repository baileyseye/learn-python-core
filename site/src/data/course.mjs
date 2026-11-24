import { modules, moduleByNumber } from './modules.mjs';
import module1 from './lessons/module-1.mjs';
import module2 from './lessons/module-2.mjs';
import module3 from './lessons/module-3.mjs';
import module4 from './lessons/module-4.mjs';
import module5 from './lessons/module-5.mjs';
import module6 from './lessons/module-6.mjs';
import module7 from './lessons/module-7.mjs';
import module8 from './lessons/module-8.mjs';

const groups = [module1, module2, module3, module4, module5, module6, module7, module8];

let runningOrder = 0;
export const lessons = groups.flatMap((group, index) =>
  group.map((lesson) => ({
    ...lesson,
    module: index + 1,
    order: ++runningOrder
  }))
);

const seen = new Set();
for (const lesson of lessons) {
  if (seen.has(lesson.id)) throw new Error(`Дублирующийся id урока: ${lesson.id}`);
  seen.add(lesson.id);
  if (!moduleByNumber.has(lesson.module)) {
    throw new Error(`Урок ${lesson.id} ссылается на неизвестный модуль ${lesson.module}`);
  }
  if (!lesson.sources?.length) throw new Error(`У урока ${lesson.id} нет sources`);
  if (!lesson.practice?.tests?.length) throw new Error(`У урока ${lesson.id} нет тестов практики`);
}

export const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

export function lessonsOfModule(moduleNumber) {
  return lessons.filter((lesson) => lesson.module === moduleNumber);
}

export function moduleOfLesson(lesson) {
  return moduleByNumber.get(lesson.module);
}

export function adjacentLessons(lessonId) {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null
  };
}

export function firstLessonOfModule(moduleNumber) {
  return lessonsOfModule(moduleNumber)[0] ?? null;
}

export function lessonCountLabel(count) {
  const lastTwo = Math.abs(count) % 100;
  const last = lastTwo % 10;
  if (lastTwo > 10 && lastTwo < 20) return 'уроков';
  if (last === 1) return 'урок';
  if (last >= 2 && last <= 4) return 'урока';
  return 'уроков';
}

export const courseStats = {
  modules: modules.length,
  lessons: lessons.length,
  sourceFiles: new Set(lessons.flatMap((lesson) => lesson.sources.map((source) => source.file))).size
};

export { modules, moduleByNumber };
