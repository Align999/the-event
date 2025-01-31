// babel.config.mjs
export default {
  presets: [
    ['next/babel', {
      'preset-react': {
        runtime: 'automatic',
        importSource: '@emotion/react'
      }
    }],
    '@babel/preset-typescript'
  ]
};
// Supports both ES modules and Next.js features
import nextBabelPreset from 'next/babel';

export default {
  presets: [
    [
      nextBabelPreset,
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react'
        }
      }
    ]
  ]
};