import { modules, lessonsOfModule } from './course.mjs';

export const sidebar = [
  {
    label: 'Старт',
    items: [
      { label: 'Как учиться', link: '/start/' },
      { label: 'Установка и запуск', link: '/start/setup/' }
    ]
  },
  ...modules.map((module) => ({
    label: `${module.number}. ${module.title}`,
    collapsed: true,
    items: [
      { label: 'Обзор модуля', link: `/modules/${module.number}/` },
      ...lessonsOfModule(module.number).map((lesson) => ({
        label: `${lesson.order}. ${lesson.title}`,
        link: `/lessons/${lesson.id}/`,
        attrs: { 'data-lesson-id': lesson.id }
      }))
    ]
  })),
  {
    label: 'Прогресс',
    items: [
      { label: 'Мой прогресс', link: '/progress/' },
      { label: 'Что дальше', link: '/next/' }
    ]
  },
  {
    label: 'Справочник',
    collapsed: true,
    items: [
      { label: 'Шпаргалка Python', link: '/reference/cheatsheet/' },
      { label: 'Python после Java', link: '/reference/from-java/' },
      { label: 'Частые ошибки', link: '/reference/pitfalls/' }
    ]
  },
  {
    label: 'Для автора',
    collapsed: true,
    items: [
      { label: 'Как устроен курс', link: '/contributors/' },
      { label: 'Инвентарь файлов', link: '/contributors/inventory/' },
      { label: 'Карта маршрута', link: '/contributors/route/' }
    ]
  }
];
