import path from 'path';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { Config } from '../../../src/shared/config';
import { CompositionRoot } from '../../../src/shared/composition-root';
import { Database } from '../../../src/shared/database';
import { WebServer } from '../../../src/shared/http';

import { sharedTestRoot } from '../../../../shared/src/paths';
import { CreateUserBuilder } from '../../../../shared/tests/support/builders';
import {
  buildManyUsers,
  resetDatabase,
} from '../../../../shared/tests/support/fixtures';
import { createAPIClient } from '../../../../shared/src/api';
import type {
  CreateUserResponse,
  CreateUserInput,
} from '../../../../shared/src/api/user';
import type { AddEmailToListResponse } from '../../../../shared/src/api/marketing';
import { UserErrors, GenericErrors } from '../../../../shared/src/errors';

const feature = loadFeature(
  path.join(sharedTestRoot, 'features/registration.feature'),
);

defineFeature(feature, (test) => {
  let composition: CompositionRoot;
  let database: Database;
  let server: WebServer;

  const config: Config = new Config('test:e2e');
  const apiClient = createAPIClient('http://localhost:3000');

  beforeAll(async () => {
    composition = CompositionRoot.createCompositionRoot(config);
    database = composition.getDatabase();
    server = composition.getWebServer();

    await server.start();
    await database.connect();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserInput;
    let createUserResponse: CreateUserResponse;
    let addEmailToListResponse: AddEmailToListResponse;

    given('I am a new user', () => {
      user = new CreateUserBuilder().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResponse = await apiClient.user.register(user);

        addEmailToListResponse = await apiClient.marketing.addEmailToList(
          user.email,
        );
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = createUserResponse;

      expect(success).toBe(true);
      expect(data).toBeDefined();
      expect(data!.user.id).toBeDefined();
      expect(data!.user.email).toBe(user.email);
      expect(data!.user.firstName).toBe(user.firstName);
      expect(data!.user.lastName).toBe(user.lastName);
      expect(data!.user.username).toBe(user.username);
      expect(error).toBeNull();
    });

    and('I should expect to receive marketing emails', () => {
      const { data, success, error } = addEmailToListResponse;

      expect(success).toBe(true);
      expect(data).toBeDefined();
      expect(data!.subscription.email).toBe(user.email);
      expect(data!.subscription.subscribed).toBe(true);
      expect(error).toBeNull();
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
  }) => {
    let user: CreateUserInput;
    let createUserResponse: CreateUserResponse;

    given('I am a new user', () => {
      user = new CreateUserBuilder().build();
    });

    when(
      'I register with valid account details declining marketing emails',
      async () => {
        createUserResponse = await apiClient.user.register(user);
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = createUserResponse;

      expect(success).toBe(true);
      expect(data).toBeDefined();
      expect(data!.user.id).toBeDefined();
      expect(data!.user.email).toBe(user.email);
      expect(data!.user.firstName).toBe(user.firstName);
      expect(data!.user.lastName).toBe(user.lastName);
      expect(data!.user.username).toBe(user.username);
      expect(error).toBeNull();
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    let existingUsers: CreateUserInput[] = [];
    let newUsers: CreateUserInput[] = [];
    let createUserResponses: CreateUserResponse[];

    given(
      'a set of users already created accounts',
      async (table: CreateUserInput[]) => {
        existingUsers = table.map((user) => {
          return new CreateUserBuilder()
            .withEmail(user.email)
            .withFirstName(user.firstName)
            .withLastName(user.lastName)
            .withUsername(user.username)
            .build();
        });

        await buildManyUsers(existingUsers);
      },
    );

    when(
      'new users attempt to register with those emails',
      async (table: CreateUserInput[]) => {
        newUsers = table.map((input) => {
          return new CreateUserBuilder()
            .withEmail(input.email)
            .withFirstName(input.firstName)
            .withLastName(input.lastName)
            .withUsername(input.username)
            .withPasswrod(input.password)
            .build();
        });

        createUserResponses = await Promise.all(
          newUsers.map((user) => apiClient.user.register(user)),
        );
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        createUserResponses.forEach((response) => {
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error!.code).toBe(UserErrors.EMAIL_ALREADY_TAKEN);
        });
      },
    );

    and('they should not be sent access to account details', () => {
      createUserResponses.forEach((response) => {
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
        expect(response.data).toBeNull();
      });
    });
  });

  test('Username already taken', ({ given, when, then, and }) => {
    let existingUsers: CreateUserInput[] = [];
    let newUsers: CreateUserInput[] = [];
    let createUserResponses: CreateUserResponse[];

    given(
      'a set of users have already created their accounts with valid details',
      async (table: CreateUserInput[]) => {
        existingUsers = table.map((user) => {
          return new CreateUserBuilder()
            .withEmail(user.email)
            .withFirstName(user.firstName)
            .withLastName(user.lastName)
            .withUsername(user.username)
            .withPasswrod(user.password)
            .build();
        });

        await buildManyUsers(existingUsers);
      },
    );

    when(
      'new users attempt to register with already taken usernames',
      async (table: CreateUserInput[]) => {
        newUsers = table.map((input) => {
          return new CreateUserBuilder()
            .withEmail(input.email)
            .withFirstName(input.firstName)
            .withLastName(input.lastName)
            .withUsername(input.username)
            .withPasswrod(input.password)
            .build();
        });

        createUserResponses = await Promise.all(
          newUsers.map((user) => apiClient.user.register(user)),
        );
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        createUserResponses.forEach((response) => {
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error!.code).toBe(UserErrors.USERNAME_ALREADY_TAKEN);
        });
      },
    );

    and('they should not be sent access to account details', () => {
      createUserResponses.forEach((response) => {
        expect(response.success).toBe(false);
        expect(response.data).toBeNull();
        expect(response.error).toBeDefined();
      });
    });
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    let invalidUser: any;
    let response: CreateUserResponse;

    given('I am a new user', () => {
      const user = new CreateUserBuilder().build();

      invalidUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
    });

    when('I register with invalid account details', async () => {
      response = await apiClient.user.register(invalidUser);
    });

    then('I should see an error notifying me that my input is invalid', () => {
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.error!.code).toBe(GenericErrors.VALIDATION_ERROR);
    });

    and('I should not have been sent access to account details', () => {
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.data).toBeNull();
    });
  });
});
