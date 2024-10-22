module.exports = {
  schema: 'http://json-schema.org/draft-04/schema#',
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: ['*.astro', '*.jsx', '*.tsx'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro', '.jsx', '.tsx']
      },
      rules: {
        'no-unused-vars': 'error',
        'no-undef': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        // Aquí puedes agregar más reglas específicas
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
