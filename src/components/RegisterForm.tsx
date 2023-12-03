import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import React from 'react';
import UserService from '../services/user.service';
import { PasswordInput } from './PasswordInput';

export default function RegisterForm() {
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();

  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');

  const [isNotUniqueEmail, setIsNotUniqueEmail] = React.useState(false);
  const [isNotUniqueUserName, setIsNotUniqueUserName] = React.useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsNotUniqueEmail(false);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    setIsNotUniqueUserName(false);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const handlePasswordConfirmationChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordConfirmation(event.target.value);

  const isInvalid = (): boolean => {
    if (isEmailInvalid()) return true;
    if (isUserNameInvalid()) return true;
    if (!isPasswordMatching()) return true;
    if (isInvalidPassword()) return true;
    if (isNotUniqueEmail) return true;
    if (isNotUniqueUserName) return true;
    return false;
  };

  const isEmailInvalid = (): boolean => {
    if (email === '') return false;

    if (email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i) === null) return true;

    return false;
  };

  const isUserNameInvalid = (): boolean => {
    if (userName === '') return false;
    return userName.length < 3 || userName.length > 64;
  };

  const isPasswordMatching = (): boolean => {
    if (password === '' || passwordConfirmation === '') return true;
    return password === passwordConfirmation;
  };

  const isInvalidPassword = (): boolean => {
    if (password === '') return false;
    return password.length < 8 || password.length > 64;
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (isInvalid() || loading) return;

    if (email === '' || userName === '' || password === '' || passwordConfirmation === '') {
      toast({
        title: 'Preencha todos os campos!',
        position: 'top',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    toast.promise(
      new Promise((resolve, reject) => {
        UserService.createUser(email, userName, password)
          .then(() => {
            UserService.authUser(email, password)
              .then((response) => {
                console.log('accessToken', response.data.accessToken);
                setLoading(false);
                resolve(200);
              })
              .catch((error) => {
                setLoading(false);
                reject(error);
              });
          })
          .catch((error) => {
            if (error.response.status === 409) {
              if (error.response.data.error === 'email') {
                setIsNotUniqueEmail(true);
              } else if (error.response.data.error === 'userName') {
                setIsNotUniqueUserName(true);
              }
            }

            setLoading(false);
            reject(error);
          });
      }),
      {
        loading: {
          title: 'Registrando...',
          position: 'top',
          description: 'Aguarde enquanto estamos te registrando...',
        },
        success: { title: 'Sucesso!', position: 'top', description: 'Logado com sucesso, redirecionando...' },
        error: { title: 'Falha!', position: 'top', description: 'Houve um erro ao registrar sua conta.' },
      }
    );
  };

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isInvalid={isInvalid()}>
          <FormLabel htmlFor="email">Nome de usuário</FormLabel>
          <InputGroup>
            <Input
              id="username"
              type="username"
              value={userName}
              onChange={handleUserNameChange}
              isInvalid={isNotUniqueUserName || isUserNameInvalid()}
            />
            {!isNotUniqueUserName && userName && (
              <InputRightElement>
                <Text color="green">✔</Text>
              </InputRightElement>
            )}
          </InputGroup>
          <FormErrorMessage hidden={!isNotUniqueUserName}>Nome de usuário já cadastrado!</FormErrorMessage>

          <FormLabel htmlFor="email">Email</FormLabel>
          <InputGroup>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              isInvalid={isEmailInvalid()}
            />
            {!isEmailInvalid() && email && (
              <InputRightElement>
                <Text color="green.500">✔</Text>
              </InputRightElement>
            )}
          </InputGroup>
          <FormErrorMessage hidden={!isEmailInvalid()}>Insira um email válido!</FormErrorMessage>
          <FormErrorMessage hidden={!isNotUniqueEmail}>Email já cadastrado!</FormErrorMessage>

          <PasswordInput
            id="password"
            disclosure={{ isOpen, onToggle }}
            value={password}
            onChange={handlePasswordChange}
            isInvalid={!isPasswordMatching() || isInvalidPassword()}
          />
          <PasswordInput
            id="passwordConfirmation"
            title="Confirme sua senha"
            disclosure={{ isOpen, onToggle }}
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            isInvalid={!isPasswordMatching() || isInvalidPassword()}
          />
          <FormErrorMessage hidden={isPasswordMatching()}>As senhas não coincidem!</FormErrorMessage>
          <FormErrorMessage hidden={!isInvalidPassword()}>A senha deve ter entre 8 e 64 caracteres!</FormErrorMessage>
        </FormControl>
      </Stack>
      <Button onClick={handleSubmit}>Criar conta</Button>
      <Stack spacing="6"></Stack>
    </Stack>
  );
}
