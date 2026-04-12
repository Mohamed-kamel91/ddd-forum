import path from 'path';
import request from 'supertest';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { resetDatabase, buildManyUsers } from '../fixtures';
import { app } from '../../src';
import { CreateUserBuilder } from '../../../shared/tests/builders/create-user-builder';
import { type CreateUserInput } from '../../../shared/src';

const feature = loadFeature(
  path.join(__dirname, '../../../shared/tests/features/registration.feature'),
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: CreateUserInput;
    let createUserResponse: any;
    let addEmailToListResponse: any;

    given('I am a new user', () => {
      createUserInput = new CreateUserBuilder().build();
    });

    when(
      'I register with valid account details accepting marketing emails',
      async () => {
        createUserResponse = await request(app)
          .post('/users')
          .send(createUserInput);

        addEmailToListResponse = await request(app)
          .post('/marketing')
          .send({ email: createUserInput.email });
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = createUserResponse.body;

      expect(createUserResponse.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.email).toBe(createUserInput.email);
      expect(data.firstName).toBe(createUserInput.firstName);
      expect(data.lastName).toBe(createUserInput.lastName);
      expect(data.username).toBe(createUserInput.username);
      expect(success).toBe(true);
      expect(error).toBeUndefined();
    });

    and('I should expect to receive marketing emails', () => {
      const { data, success, error } = addEmailToListResponse.body;

      expect(addEmailToListResponse.status).toBe(200);
      expect(data.email).toBe(createUserInput.email);
      expect(data.subscribed).toBe(true);
      expect(success).toBe(true);
      expect(error).toBeUndefined();
    });
  });

  test('Successful registration without marketing emails accepted', ({
    given,
    when,
    then,
  }) => {
    let createUserInput: CreateUserInput;
    let createUserResponse: any;

    given('I am a new user', () => {
      createUserInput = new CreateUserBuilder().build();
    });

    when(
      'I register with valid account details declining marketing emails',
      async () => {
        createUserResponse = await request(app)
          .post('/users')
          .send(createUserInput);
      },
    );

    then('I should be granted access to my account', () => {
      const { data, success, error } = createUserResponse.body;

      expect(createUserResponse.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.email).toBe(createUserInput.email);
      expect(data.firstName).toBe(createUserInput.firstName);
      expect(data.lastName).toBe(createUserInput.lastName);
      expect(data.username).toBe(createUserInput.username);
      expect(success).toBe(true);
      expect(error).toBeUndefined();
    });
  });

  test('Account already created with email', ({ given, when, then, and }) => {
    let existingUsers: CreateUserInput[] = [];
    let newUsers: CreateUserInput[] = [];
    let createUserResponses: any[];

    given('a set of users already created accounts', async (table: any[]) => {
      existingUsers = table.map((user: CreateUserInput) => {
        return new CreateUserBuilder()
          .withEmail(user.email)
          .withFirstname(user.firstName)
          .withLastname(user.lastName)
          .withUsername(user.username)
          .build();
      });

      await buildManyUsers(existingUsers);
    });

    when(
      'new users attempt to register with those emails',
      async (table: any[]) => {
        newUsers = table.map((input: CreateUserInput) => {
          return new CreateUserBuilder()
            .withEmail(input.email)
            .withFirstname(input.firstName)
            .withLastname(input.lastName)
            .withUsername(input.username)
            .build();
        });

        createUserResponses = await Promise.all(
          newUsers.map((user) => request(app).post('/users').send(user)),
        );
      },
    );

    then(
      'they should see an error notifying them that the account already exists',
      () => {
        createUserResponses.forEach((response) => {
          expect(response.body.error).toBe('EmailAlreadyInUse');
        });
      },
    );

    and('they should not be sent access to account details', () => {
      createUserResponses.forEach((response) => {
        const { data, success, error } = response.body;

        expect(response.status).toBe(409);
        expect(success).toBe(false);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
      });
    });
  });

  test('Username already taken', ({ given, when, then, and }) => {
    let existingUsers: CreateUserInput[] = [];
    let newUsers: CreateUserInput[] = [];
    let createUserResponses: any[];

    given(
      'a set of users have already created their accounts with valid details',
      async (table: any[]) => {
        existingUsers = table.map((user: CreateUserInput) => {
          return new CreateUserBuilder()
            .withEmail(user.email)
            .withFirstname(user.firstName)
            .withLastname(user.lastName)
            .withUsername(user.username)
            .build();
        });

        await buildManyUsers(existingUsers);
      },
    );

    when(
      'new users attempt to register with already taken usernames',
      async (table: any[]) => {
        newUsers = table.map((input: CreateUserInput) => {
          return new CreateUserBuilder()
            .withEmail(input.email)
            .withFirstname(input.firstName)
            .withLastname(input.lastName)
            .withUsername(input.username)
            .build();
        });

        createUserResponses = await Promise.all(
          newUsers.map((user) => request(app).post('/users').send(user)),
        );
      },
    );

    then(
      'they see an error notifying them that the username has already been taken',
      () => {
        createUserResponses.forEach((response) => {
          expect(response.body.error).toBe('UserNameAlreadyTaken');
        });
      },
    );

    and('they should not be sent access to account details', () => {
      createUserResponses.forEach((response) => {
        const { data, success, error } = response.body;

        expect(response.status).toBe(409);
        expect(success).toBe(false);
        expect(data).toBeUndefined();
        expect(error).toBeDefined();
      });
    });
  });

  test('Invalid or missing registration details', ({
    given,
    when,
    then,
    and,
  }) => {
    let invalidUser: Partial<CreateUserInput>;
    let response: any;

    given('I am a new user', () => {
      const user = new CreateUserBuilder().build();

      invalidUser = {
        firstName: user.firstName,
        email: user.email,
        lastName: user.lastName,
      };
    });

    when('I register with invalid account details', async () => {
      response = await request(app).post('/users').send(invalidUser);
    });

    then('I should see an error notifying me that my input is invalid', () => {
      expect(response.body.error).toBe('ValidationError');
    });

    and('I should not have been sent access to account details', () => {
      const { data, success, error } = response.body;

      expect(response.status).toBe(400);
      expect(success).toBe(false);
      expect(data).toBeUndefined();
      expect(error).toBeDefined();
    });
  });
});
