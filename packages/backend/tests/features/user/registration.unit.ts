import path from 'path';
import { loadFeature, defineFeature } from 'jest-cucumber';

import { Config } from '../../../src/shared/config';
import { CompositionRoot } from '../../../src/shared/composition-root';
import { type Application } from '../../../src/shared/application';
import { InvalidInputException } from '../../../src/shared/errors/validation-errors';

import { CreateUserCommand } from '../../../src/modules/users/user-command';
import { InMemoryUserRepo } from '../../../src/modules/users/adapters/In-memory-user-repo';
import {
  EmailAlreadyTakenException,
  UsernameAlreadyTakenException,
} from '../../../src/modules/users/user-exceptions';
import { FakeTransactionalEmailAPI } from '../../../src/modules/notifications/adapters/transactional-email-api/fake-transactional-email-api';
import { FakeContactListAPI } from '../../../src/modules/marketing/adapters/contact-list-api/fake-contact-list-api';

import { sharedTestRoot } from '../../../../shared/src/paths';
import { CreateUserInput, User } from '../../../../shared/src/api/user';
import { type EmailSubscription } from '../../../../shared/src/api/marketing';
import { GenericErrors } from '../../../../shared/src/errors/generic';
import { CreateUserBuilder } from '../../../../shared/tests/support/builders';

const feature = loadFeature(
  path.join(sharedTestRoot, 'features/registration.feature'),
  { tagFilter: '@backend' },
);

defineFeature(feature, (test) => {
  const config = new Config('test:unit');

  let composition: CompositionRoot;
  let application: Application;
  let userRepoSpy: InMemoryUserRepo;
  let contactListAPISpy: FakeContactListAPI;
  let transactionalEmailAPISpy: FakeTransactionalEmailAPI;

  beforeAll(() => {
    composition = CompositionRoot.createCompositionRoot(config);
    application = composition.getApplication();
    userRepoSpy = composition.getRepositories().user as InMemoryUserRepo;
    contactListAPISpy = composition.getContactListAPI() as FakeContactListAPI;
    transactionalEmailAPISpy =
      composition.getTransactionalEmailAPI() as FakeTransactionalEmailAPI;
  });

  afterEach(async () => {
    await userRepoSpy.reset();
    contactListAPISpy.reset();
    transactionalEmailAPISpy.reset();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: CreateUserCommand;
    let createUserResult: User;
    let addEmailToListResult: EmailSubscription;

    given('I am a new user', () => {
      createUserInput = new CreateUserBuilder().buildCommand();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResult = await application.user.createUser(createUserInput);

        addEmailToListResult = await application.marketing.addEmailToList({
          email: createUserInput.email,
        });
      },
    );

    then('I should be granted access to my account', async () => {
      // Result verification
      expect(createUserResult).toBeDefined();
      expect(createUserResult.id).toBeDefined();
      expect(createUserResult.email).toBe(createUserInput.email);
      expect(createUserResult.firstName).toBe(createUserInput.firstName);
      expect(createUserResult.lastName).toBe(createUserInput.lastName);
      expect(createUserResult.username).toBe(createUserInput.username);

      // State verification
      const getUserByEmailResult = await application.user.getUserByEmail(
        createUserInput.email,
      );

      expect(getUserByEmailResult).toBeDefined();
      expect(getUserByEmailResult.email).toBe(createUserInput.email);

      // Communication verification
      expect(userRepoSpy.getTimesMethodCalled('save')).toBe(1);
      expect(transactionalEmailAPISpy.getTimesMethodCalled('sendMail')).toBe(1);
    });

    and('I should expect to receive marketing emails', () => {
      expect(addEmailToListResult).toBeDefined();
      expect(addEmailToListResult.email).toBe(createUserInput.email);
      expect(addEmailToListResult.subscribed).toBeTruthy();

      // Communication verification
      expect(contactListAPISpy.getTimesMethodCalled('addEmailToList')).toBe(1);
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
  }) => {
    let createUserInput: CreateUserCommand;
    let createUserResult: User;

    given('I am a new user', async () => {
      createUserInput = new CreateUserBuilder().buildCommand();
    });

    when(
      'I register with valid account details declining marketing emails',
      async () => {
        createUserResult = await application.user.createUser(createUserInput);
      },
    );

    then('I should be granted access to my account', async () => {
      // Result verification
      expect(createUserResult).toBeDefined();
      expect(createUserResult.id).toBeDefined();
      expect(createUserResult.email).toBe(createUserInput.email);
      expect(createUserResult.firstName).toBe(createUserInput.firstName);
      expect(createUserResult.lastName).toBe(createUserInput.lastName);
      expect(createUserResult.username).toBe(createUserInput.username);

      // State verification
      const getUserByEmailResult = await application.user.getUserByEmail(
        createUserInput.email,
      );

      expect(getUserByEmailResult).toBeDefined();
      expect(getUserByEmailResult.email).toBe(createUserInput.email);

      // Communication verification
      expect(userRepoSpy.getTimesMethodCalled('save')).toBe(1);
      expect(transactionalEmailAPISpy.getTimesMethodCalled('sendMail')).toBe(1);
    });
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: CreateUserInput;
    let createUserCommand: CreateUserCommand;
    let error: any;

    given('I am a new user', async () => {
      createUserInput = new CreateUserBuilder().withLastName('').build();
    });

    when('I register with invalid account details', async () => {
      try {
        createUserCommand = CreateUserCommand.fromProps(createUserInput);
        await application.user.createUser(createUserCommand);
      } catch (e) {
        error = e;
      }
    });

    then('I should see an error notifying me that my input is invalid', () => {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(InvalidInputException);
      expect(error.code).toBe(GenericErrors.VALIDATION_ERROR);
      expect(userRepoSpy.getTimesMethodCalled('save')).toBe(0);
    });

    and('I should not have been sent access to account details', () => {
      expect(transactionalEmailAPISpy.getTimesMethodCalled('sendMail')).toBe(0);
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    let createUserResults: any[] = [];

    given(
      'a set of users already created accounts',
      async (table: CreateUserInput[]) => {
        await Promise.all(
          table.map((row) => {
            const userInput = new CreateUserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .withPasswrod(row.password)
              .buildCommand();

            return userRepoSpy.save(userInput);
          }),
        );
      },
    );

    when(
      'new users attempt to register with those emails',
      (table: CreateUserInput[]) => {
        table.forEach((user) => {
          const createUserCommand = new CreateUserBuilder()
            .withFirstName(user.firstName)
            .withLastName(user.lastName)
            .withUsername(user.username)
            .withEmail(user.email)
            .withPasswrod(user.password)
            .buildCommand();

          const result = application.user.createUser(createUserCommand);

          createUserResults.push(result);
        });
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        createUserResults.forEach((result) => {
          expect(result).rejects.toThrow(EmailAlreadyTakenException);
        });
      },
    );

    and('they should not be sent access to account details', () => {
      expect(transactionalEmailAPISpy.getTimesMethodCalled('sendMail')).toBe(0);
    });
  });

  test('Username already taken', ({ given, when, then, and }) => {
    let createUserResults: any[] = [];

    given(
      'a set of users have already created their accounts with valid details',
      async (table: CreateUserInput[]) => {
        await Promise.all(
          table.map((row) => {
            const userInput = new CreateUserBuilder()
              .withEmail(row.email)
              .withUsername(row.username)
              .withFirstName(row.firstName)
              .withLastName(row.lastName)
              .withPasswrod(row.password)
              .buildCommand();

            return userRepoSpy.save(userInput);
          }),
        );
      },
    );

    when(
      'new users attempt to register with already taken usernames',
      (table: CreateUserInput[]) => {
        table.forEach((user) => {
          const createUserCommand = new CreateUserBuilder()
            .withFirstName(user.firstName)
            .withLastName(user.lastName)
            .withUsername(user.username)
            .withEmail(user.email)
            .withPasswrod(user.password)
            .buildCommand();

          const result = application.user.createUser(createUserCommand);

          createUserResults.push(result);
        });
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        createUserResults.forEach((result) => {
          expect(result).rejects.toThrow(UsernameAlreadyTakenException);
        });
      },
    );

    and('they should not be sent access to account details', () => {
      expect(transactionalEmailAPISpy.getTimesMethodCalled('sendMail')).toBe(0);
    });
  });
});
