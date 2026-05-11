import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { Layout } from '../components/layout';
import {
  RegistrationForm,
  RegistrationInput,
} from '../components/registrationForm';
import { OverlaySpinner } from '../components/overlaySpinner';

import { api } from '../api';
import { useUser } from '../contexts/userContext';
import { useSpinner } from '../contexts/spinnerContext';
import {
  GenericErrors,
  UserErrors,
} from '../../../shared/src/errors';
import { appSelectors, toId } from '../shared/selectors';

type ValidationResult = {
  success: boolean;
  errorMessage?: string;
};

function validateForm(input: RegistrationInput): ValidationResult {
  if (input.email.indexOf('@') === -1)
    return { success: false, errorMessage: 'Email invalid' };
  if (input.username.length < 2)
    return { success: false, errorMessage: 'Username invalid' };
  return { success: true };
}

export const RegisterPage = () => {
  const selectors = appSelectors.registration.registrationForm;

  const { setUser } = useUser();
  const navigate = useNavigate();
  const spinner = useSpinner();

  const handleSubmitRegistrationForm = async (
    input: RegistrationInput,
  ) => {
    const validationResult = validateForm(input);

    if (!validationResult.success) {
      return toast.error(validationResult.errorMessage, {
        toastId: toId(selectors.failureToast.selector),
      });
    }

    spinner.activate();

    try {
      const response = await api.user.register(input);

      const { EMAIL_ALREADY_TAKEN, USERNAME_ALREADY_TAKEN } =
        UserErrors;
      const { SERVER_ERROR, VALIDATION_ERROR } = GenericErrors;

      if (!response.success) {
        switch (response.error.code) {
          case EMAIL_ALREADY_TAKEN:
            return toast.error(
              'This email is already in use. Perhaps you want to log in?',
              {
                toastId: toId(selectors.failureToast.selector),
              },
            );
          case USERNAME_ALREADY_TAKEN:
            return toast.error(
              'Please try a different username, this one is already taken.',
              {
                toastId: toId(selectors.failureToast.selector),
              },
            );
          case VALIDATION_ERROR:
            return toast.error(response.error.message, {
              toastId: toId(selectors.failureToast.selector),
            });
          case SERVER_ERROR:
          default:
            return toast.error('Some backend error occurred', {
              toastId: toId(selectors.failureToast.selector),
            });
        }
      }

      setUser(response.data!.user);

      spinner.deactivate();

      toast('Success! Redirecting home.', {
        toastId: toId(selectors.successToast.selector),
      });

      // In 3 seconds, redirect to the main page
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      spinner.deactivate();

      return toast.error('Some backend error occurred.', {
        toastId: toId(selectors.failureToast.selector),
      });
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <RegistrationForm
        onSubmit={(input: RegistrationInput) =>
          handleSubmitRegistrationForm(input)
        }
      />
      <OverlaySpinner isActive={spinner.spinner?.isActive} />
    </Layout>
  );
};
