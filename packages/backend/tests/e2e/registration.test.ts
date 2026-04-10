import path from 'path';
import request from 'supertest';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { resetDatabase } from '../fixtures';
import { app } from '../../src';

import { CreateUserBuilder } from '../../../shared/tests/builders/create-user-builder';
import type { CreateUserParams } from '../../../shared/src';

const feature = loadFeature(
  path.join(__dirname, '../../../shared/tests/features/registration.feature'),
);

defineFeature(feature, (test) => {
  afterEach(async () => {
    await resetDatabase();
  });

  test('Successful registration with marketing emails accepted', ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserInput: CreateUserParams;
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

  // test('Successful registration without marketing emails accepted', ({
  //   given,
  //   when,
  //   then,
  //   and,
  // }) => {
  //   given('I am a new user', () => {});

  //   when(
  //     'I register with valid account details declining marketing emails',
  //     () => {},
  //   );

  //   then('I should be granted access to my account', () => {});

  //   and('I should not expect to receive marketing emails', () => {});
  // });

  // test('Account already created with email', ({ given, when, then, and }) => {
  //   given('a set of users already created accounts', (table) => {});

  //   when('new users attempt to register with those emails', () => {});

  //   then(
  //     'they should see an error notifying them that the account already exists',
  //     () => {},
  //   );

  //   and('they should not have been sent access to account details', () => {});
  // });

  // test('Username already taken', ({ given, when, then, and }) => {
  //   given(
  //     'a set of users have already created their accounts with valid details',
  //     (table) => {},
  //   );

  //   when(
  //     'new users attempt to register with already taken usernames',
  //     (table) => {},
  //   );

  //   then(
  //     'they see an error notifying them that the username has already been taken',
  //     () => {},
  //   );

  //   and('they should not have been sent access to account details', () => {});
  // });
});
