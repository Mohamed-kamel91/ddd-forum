export const appSelectors = {
  registration: {
    registrationForm: {
      email: {
        selector: '.registration-input.email',
        type: 'input',
      },
      username: {
        selector: '.registration-input.username',
        type: 'input',
      },
      firstName: {
        selector: '.registration-input.first-name',
        type: 'input',
      },
      lastName: {
        selector: '.registration-input.last-name',
        type: 'input',
      },
      password: {
        selector: '.registration-input.password',
        type: 'input',
      },
      marketingCheckbox: {
        selector: '.registration-input.marketing-emails',
        type: 'input',
      },
      submit: {
        selector: '.registration.submit-button',
        type: 'button',
      },
      successToast: {
        selector: '#success-toast',
        type: 'div',
      },
      failureToast: {
        selector: '#failure-toast',
        type: 'div',
      },
    },
  },
  header: {
    username: {
      selector: '#header-username',
      type: 'div',
    },
  },
  notifications: {
    failure: '#failure-toast',
    success: '#success-toast',
  },
};

export function toClass(input: string): string {
  // Remove the leading dot and replace all remaining dots with spaces
  return input.slice(1).replace(/\./g, ' ');
}

export function toId(input: string): string {
  if (!input.startsWith('#')) {
    throw new Error(
      'Input string must start with a hash symbol (#).',
    );
  }

  // Remove the leading hash symbol
  return input.slice(1);
}
