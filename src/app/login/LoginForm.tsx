
import { Button, Container, FormControl, FormLabel, Heading, Input, Link, Stack, Text } from '@chakra-ui/react';
import { PasswordInput } from './PasswordInput';

export default function LoginForm() {
  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" type="email" />
        </FormControl>
        <PasswordInput />
      </Stack>
      <Stack spacing="6">
        <Button>Logar</Button>
      </Stack>
    </Stack>
  );
}
