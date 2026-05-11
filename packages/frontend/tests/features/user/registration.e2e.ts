import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { sharedTestRoot } from '../../../../shared/src/paths';
import { CreateUserInput } from '../../../../shared/src/api/user';
import { CreateUserBuilder } from '../../../../shared/tests/support/builders';
import {
  resetDatabase,
  aUser,
} from '../../../../shared/tests/support/fixtures';

import { PuppeteerPageDriver } from '../../shared/driver';
import {
  createAppPageObject,
  type App,
  type Components,
  type Layout,
  type Pages,
} from '../../shared/pages';
import { RegistrationPage } from '../../shared/pages/registration-page';

const feature = loadFeature(
  path.join(sharedTestRoot, 'features/registration.feature'),
  {
    tagFilter: '@frontend',
  },
);

defineFeature(feature, (test) => {
  let app: App;
  let components: Components;
  let layout: Layout;
  let pages: Pages;
  let registrationPage: RegistrationPage;
  let puppeteerPageDriver: PuppeteerPageDriver;

  beforeAll(async () => {
    puppeteerPageDriver = await PuppeteerPageDriver.create();
    app = createAppPageObject(puppeteerPageDriver);
    components = app.components;
    layout = app.layout;
    pages = app.pages;
    registrationPage = pages.registration;
  });

  afterEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await puppeteerPageDriver.browser.close();
  });

  jest.setTimeout(60000);

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let userInput: CreateUserInput;

    given('I am a new user', async () => {
      userInput = new CreateUserBuilder().build();

      await registrationPage.open();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        await registrationPage.enterAccountDetails(userInput);
        await registrationPage.acceptMarketingEmails();
        await registrationPage.submitRegistrationForm();
      },
    );

    then('I should be granted access to my account', async () => {
      expect(
        await registrationPage.isSuccessToastVisible(),
      ).toBeTruthy();

      expect(await layout.header.getLoggedInUsername()).toBe(
        userInput.username,
      );
    });

    and('I should expect to receive marketing emails', () => {});
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    let invalidUser: Partial<CreateUserInput>;

    given('I am a new user', async () => {
      const user = new CreateUserBuilder()
        .withEmail('mohkamel')
        .build();

      invalidUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      };

      await registrationPage.open();
    });

    when('I register with invalid account details', async () => {
      await registrationPage.enterAccountDetails(invalidUser);
      await registrationPage.acceptMarketingEmails();
      await registrationPage.submitRegistrationForm();
    });

    then(
      'I should see an error notifying me that my input is invalid',
      async () => {
        expect(
          await registrationPage.getFailureToastMessage(),
        ).toBeDefined();

        expect(
          await registrationPage.isFailureToastVisible(),
        ).toBeTruthy();
      },
    );

    and(
      'I should not have been sent access to account details',
      () => {},
    );
  });

  test('Account already created with email', ({
    given,
    when,
    then,
    and,
  }) => {
    given(
      'a set of users already created accounts',
      async (table: CreateUserInput[]) => {
        await aUser()
          .withEmail(table[0].email)
          .withFirstname(table[0].firstName)
          .withLastname(table[0].lastName)
          .withUsername(table[0].username)
          .withPassword(table[0].password)
          .build();

        await registrationPage.open();
      },
    );

    when(
      'new users attempt to register with those emails',
      async (table: CreateUserInput[]) => {
        const newUser = new CreateUserBuilder()
          .withEmail(table[0].email)
          .withFirstname(table[0].firstName)
          .withLastname(table[0].lastName)
          .withPasswrod(table[0].password)
          .withUsername(table[0].username)
          .build();

        await registrationPage.enterAccountDetails(newUser);
        await registrationPage.acceptMarketingEmails();
        await registrationPage.submitRegistrationForm();
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      async () => {
        expect(
          await registrationPage.getFailureToastMessage(),
        ).toBeDefined();

        expect(
          await registrationPage.isFailureToastVisible(),
        ).toBeTruthy();
      },
    );

    and(
      'they should not be sent access to account details',
      () => {},
    );
  });
});
