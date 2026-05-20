import path from 'path';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { sharedTestRoot } from '../../../../shared/src/paths';
import { CreateUserBuilder } from '../../../../shared/tests/support/builders';
import {
  CreateUserInput,
  User,
} from '../../../../shared/src/api/user';
import { Config } from '../../../src/shared/config';
import { CompositionRoot } from '../../../src/shared/composition-root';
import { type EmailSubscription } from '../../../../shared/src/api/marketing';
import { type Application } from '../../../src/shared/application';
import { type CreateUserCommand } from '../../../src/modules/users/user-command';
import { InMemoryUserRepo } from '../../../src/modules/users/adapters/In-memory-user-repo';

const feature = loadFeature(
  path.join(sharedTestRoot, 'features/registration.feature'),
  { tagFilter: '@backend' },
);

defineFeature(feature, (test) => {
  let composition: CompositionRoot;
  let application: Application;
  let fakeUserRepo: InMemoryUserRepo;

  const config = new Config('test:unit');

  beforeAll(() => {
    composition = CompositionRoot.createCompositionRoot(config);
    application = composition.getApplication();
    fakeUserRepo = composition.getRepositories()
      .user as InMemoryUserRepo;
  });

  afterEach(async () => {
    await fakeUserRepo.reset();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: CreateUserInput;
    let createUserResult: User;
    let addEmailToListResult: EmailSubscription;

    given('I am a new user', () => {
      createUserInput = new CreateUserBuilder().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResult = await application.user.createUser({
          props: createUserInput,
        } as CreateUserCommand);

        addEmailToListResult =
          await application.marketing.addEmailToList({
            email: createUserInput.email,
          });
      },
    );

    then('I should be granted access to my account', async () => {
      // Result verification
      expect(createUserResult).toBeDefined();
      expect(createUserResult.id).toBeDefined();
      expect(createUserResult.email).toBe(createUserInput.email);
      expect(createUserResult.firstName).toBe(
        createUserInput.firstName,
      );
      expect(createUserResult.lastName).toBe(
        createUserInput.lastName,
      );
      expect(createUserResult.username).toBe(
        createUserInput.username,
      );

      // State verification
      const getUserByEmailResult =
        await application.user.getUserByEmail(createUserInput.email);

      expect(getUserByEmailResult).toBeDefined();
      expect(getUserByEmailResult.email).toBe(createUserInput.email);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResult).toBeDefined();
      expect(addEmailToListResult.email).toBe(createUserInput.email);
      expect(addEmailToListResult.subscribed).toBeTruthy();
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
  }) => {
    given('I am a new user', () => {});

    when(
      'I register with valid account details declining marketing emails',
      () => {},
    );

    then('I should be granted access to my account', () => {});
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I am a new user', () => {});

    when('I register with invalid account details', () => {});

    then(
      'I should see an error notifying me that my input is invalid',
      () => {},
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
    given('a set of users already created accounts', (table) => {});

    when(
      'new users attempt to register with those emails',
      (table) => {},
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {},
    );

    and(
      'they should not be sent access to account details',
      () => {},
    );
  });

  test('Username already taken', ({ given, when, then, and }) => {
    given(
      'a set of users have already created their accounts with valid details',
      (table) => {},
    );

    when(
      'new users attempt to register with already taken usernames',
      (table) => {},
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {},
    );

    and(
      'they should not be sent access to account details',
      () => {},
    );
  });
});
