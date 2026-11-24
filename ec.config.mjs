import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  defaultProps: {
    showLineNumbers: false
  },
  styleOverrides: {
    borderRadius: '0.85rem',
    codeFontSize: '0.88rem',
    uiFontSize: '0.78rem',
    frames: {
      shadowColor: 'transparent'
    }
  }
});
