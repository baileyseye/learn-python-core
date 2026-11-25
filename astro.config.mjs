import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { sidebar } from './site/src/data/sidebar.mjs';
import { courseStats } from './site/src/data/course.mjs';

const site = 'https://baileyseye.github.io';
const base = '/learn-python-core';
const description = `Пошаговый курс по Python с ${courseStats.lessons} уроками в ${courseStats.modules} модулях: реальные исходники из репозитория, запуск кода в браузере, упражнения и самопроверка.`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  srcDir: './site/src',
  publicDir: './site/public',
  outDir: './dist',
  integrations: [
    starlight({
      title: 'Learn Python Core',
      description,
      favicon: '/favicon.svg',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Русский', lang: 'ru' }
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/baileyseye/learn-python-core'
        }
      ],
      sidebar,
      pagination: false,
      customCss: ['./site/src/styles/custom.css'],
      components: {
        Footer: './site/src/components/Footer.astro',
        PageTitle: './site/src/components/PageTitle.astro',
        ThemeSelect: './site/src/components/ThemeToggle.astro'
      },
      head: [
        { tag: 'meta', attrs: { property: 'og:locale', content: 'ru_RU' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#3776ab' } }
      ]
    })
  ]
});
