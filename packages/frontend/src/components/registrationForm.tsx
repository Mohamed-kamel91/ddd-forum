import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appSelectors, toClass } from '../shared/selectors';

export type RegistrationInput = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  allowMarketingEmails: boolean;
};

type RegistrationFormProps = {
  onSubmit: (formDetails: RegistrationInput) => void;
};

export const RegistrationForm = ({
  onSubmit,
}: RegistrationFormProps) => {
  const selectors = appSelectors.registration.registrationForm;

  const [input, setInput] = useState<RegistrationInput>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    allowMarketingEmails: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, checked, type } = e.target;

    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      email,
      username,
      firstName,
      lastName,
      password,
      allowMarketingEmails,
    } = input;

    onSubmit({
      email,
      username,
      firstName,
      lastName,
      password,
      allowMarketingEmails,
    });
  };

  return (
    <form
      className="registration-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2>Create Account</h2>
      <input
        className={toClass(selectors.email.selector)}
        type="email"
        name="email"
        value={input.email}
        placeholder="Email"
        onChange={handleInputChange}
      />
      <input
        className={toClass(selectors.firstName.selector)}
        type="text"
        name="firstName"
        value={input.firstName}
        placeholder="First name"
        onChange={handleInputChange}
      />
      <input
        className={toClass(selectors.lastName.selector)}
        type="text"
        name="lastName"
        value={input.lastName}
        placeholder="Last name"
        onChange={handleInputChange}
      />
      <input
        className={toClass(selectors.username.selector)}
        type="text"
        name="username"
        value={input.username}
        placeholder="Username"
        onChange={handleInputChange}
      />
      <input
        className={toClass(selectors.password.selector)}
        type="text"
        name="password"
        value={input.password}
        placeholder="Password"
        onChange={handleInputChange}
      />
      <label className="registration-label marketing-emails-label">
        <input
          className={toClass(selectors.marketingCheckbox.selector)}
          type="checkbox"
          name="allowMarketingEmails"
          checked={input.allowMarketingEmails}
          onChange={handleInputChange}
        />
        Want to be notified about event & discounts?
      </label>

      <div>
        <button
          className={toClass(selectors.submit.selector)}
          type="submit"
        >
          Submit
        </button>
        <div className="to-login">
          <div>Already have an account?</div>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </form>
  );
};
