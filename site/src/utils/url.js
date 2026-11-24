import { lessons } from '../data/course.mjs';

export function url(pathname) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = String(pathname).replace(/^\//, '');
  return `${base}/${clean}`;
}

export function lessonUrl(lesson) {
  return url(`/lessons/${lesson.id}/`);
}

export function moduleUrl(module) {
  return url(`/modules/${module.number}/`);
}

export function githubSourcePath(file) {
  return `https://github.com/baileyseye/learn-python-core/blob/main/src/python/${file}`;
}

export function basename(file) {
  return file.split('/').pop();
}

export const allLessonIds = lessons.map((lesson) => lesson.id);
