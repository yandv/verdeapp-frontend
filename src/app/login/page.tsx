'use client';
import React from 'react';
import { Box, Container, Heading, Link, Stack } from '@chakra-ui/react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function Login() {
  const [login, setLogin] = React.useState(true);

  const handleChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setLogin(!login);
    event.preventDefault();
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Verde-App Auth</Heading>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          {login ? <LoginForm /> : <RegisterForm />}
          <Link href="#" onClick={handleChange}>
            {login ? 'Não possui uma conta? Cadastre-se aqui!' : 'Já possui uma conta? Faça login aqui!'}
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
