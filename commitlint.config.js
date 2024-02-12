module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'never', ['pascal-case', 'snake-case', 'camel-case']],
    'validate-commit-message': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'validate-commit-message': ({ subject }) => {
          const pattern = /^(B|F|P)-\d+\s.*/;
          const isValid = pattern.test(subject);
          return [
            isValid,
            `Your subject should match the following pattern: "/^(B|F|P)-\d+\s.*/" `,
          ];
        },
      },
    },
  ],
};
