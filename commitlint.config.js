module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: { 'validate-commit-message': [2, 'always'] },
  plugins: [
    {
      rules: {
        'validate-commit-message': ({ subject }) => {
          const pattern = /^(B-|F-|P-)2024\s.*/;
          const isValid = subject.test(pattern);
          return [
            isValid,
            `Your subject match following pattern: '/^(B-|F-|P-)2024\s.*/' `,
          ];
        },
      },
    },
  ],
};
