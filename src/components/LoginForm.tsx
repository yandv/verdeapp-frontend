import React from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { PasswordInput } from './PasswordInput';
import UserService from '@/services/user.service';

export default function LoginForm() {
  const toast = useToast();

  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isUserNotFound, setIsUserNotFound] = React.useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = React.useState(false);

  const handleChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
    setIsUserNotFound(false);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setIsPasswordInvalid(false);
  };

  const isInvalid = (): boolean => {
    if (isUserNotFound) return true;
    if (isPasswordInvalid) return true;
    return false;
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (isInvalid() || loading) return;

    if (user === '' || password === '') {
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
        UserService.authUser(user, password)
          .then(() => {
            setLoading(false);
            resolve(200);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setIsUserNotFound(true);
            } else if (error.response.status === 401) {
              setIsPasswordInvalid(true);
            }

            setLoading(false);
            reject(error.response.status);
          });
      }),
      {
        loading: { title: 'Logando...', position: 'top', description: 'Aguarde enquanto estamos te autenticando...' },
        success: { title: 'Sucesso!', position: 'top', description: 'Logado com sucesso, redirecionando...' },
        error: { title: 'Falha!', position: 'top', description: 'Houve um erro ao autenticar.' },
      }
    );
  };

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isInvalid={isInvalid()}>
          <FormLabel>Email/Nome de usuário</FormLabel>
          <Input id="email" type="text" value={user} onChange={handleChangeUser} />
          <FormErrorMessage hidden={!isUserNotFound}>Usuário não encontrado!</FormErrorMessage>

          <PasswordInput value={password} onChange={handleChangePassword} />
          <FormErrorMessage hidden={!isPasswordInvalid}>Senha incorreta</FormErrorMessage>
        </FormControl>
      </Stack>
      <Stack spacing="6">
        <Button onClick={handleSubmit}>Logar</Button>
      </Stack>
    </Stack>
  );
}
