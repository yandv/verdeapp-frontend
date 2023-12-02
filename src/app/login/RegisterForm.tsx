import { Button, FormControl, FormLabel, Input, Stack, useDisclosure } from '@chakra-ui/react';
import { PasswordInput } from './PasswordInput';

export default function RegisterForm() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" type="email" />

          <FormLabel htmlFor="email">Username</FormLabel>
          <Input id="username" type="username" />
        </FormControl>
        <PasswordInput disclosure={{isOpen, onToggle}}/>
        <PasswordInput disclosure={{isOpen, onToggle}} />
      </Stack>
      <Stack spacing="6">
        <Button>Criar conta</Button>
      </Stack>
    </Stack>
  );
}
