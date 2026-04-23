import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService.ts';

type Notification = {
  title: string;
  message: string;
  type: 'success' | 'error';
} | null;

export default function useCredentials() {
  const navigate = useNavigate();

  // ── Modal visibility ───────────────────────────────────────────────────────
  const [emailModal, setEmailModal] = useState<boolean>(false);
  const [modalPassword, setModalPassword] = useState<boolean>(false);
  const [modalDeleteAccount, setModalDeleteAccount] = useState<boolean>(false);

  // ── Form fields ────────────────────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [inputTouched, setInputTouched] = useState<boolean>(false);
  const [errorEmailMessage, setErrorEmailMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ── Notification ───────────────────────────────────────────────────────────
  const [notification, setNotification] = useState<Notification>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const resetData = (): void => {
    setNewEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setInputTouched(false);
    setErrorEmailMessage(null);
    setPasswordError(false);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChangeEmail = (): void => {
    userService
      .changeEmail(newEmail, password)
      .then(() => {
        setNotification({
          title: 'Email Changed',
          message: 'Your email has been changed successfully.',
          type: 'success',
        });
        setEmailModal(false);
        resetData();
      })
      .catch((error) => {
        setIsLoading(false);
        setNotification({
          title: 'Error',
          message: error?.response?.data?.message || 'There was an error changing your email.',
          type: 'error',
        });
      });
  };

  const handleChangePassword = (): void => {
    setIsLoading(true);
    userService
      .changePassword(password, newPassword)
      .then(() => {
        setNotification({
          title: 'Password Changed',
          message: 'Your password has been changed successfully.',
          type: 'success',
        });
        setModalPassword(false);
        setIsLoading(false);
        resetData();
      })
      .catch((error) => {
        setIsLoading(false);
        setNotification({
          title: 'Error',
          message: error?.response?.data?.message || 'There was an error changing your password.',
          type: 'error',
        });
      });
  };

  const handleDeleteAccount = (): void => {
    userService
      .deleteProfile(password)
      .then(() => {
        setNotification({
          title: 'Account Deleted',
          message: 'Your account has been deleted successfully.',
          type: 'success',
        });
        navigate('/login');
      })
      .catch((error) => {
        setNotification({
          title: 'Error',
          message: error?.response?.data?.message || 'There was an error deleting your account.',
          type: 'error',
        });
      });
  };

  return {
    // modal visibility
    emailModal,
    setEmailModal,
    modalPassword,
    setModalPassword,
    modalDeleteAccount,
    setModalDeleteAccount,
    // form fields
    newEmail,
    setNewEmail,
    password,
    setPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    inputTouched,
    setInputTouched,
    errorEmailMessage,
    setErrorEmailMessage,
    passwordError,
    setPasswordError,
    isLoading,
    // notification
    notification,
    setNotification,
    // handlers
    resetData,
    handleChangeEmail,
    handleChangePassword,
    handleDeleteAccount,
  };
}
