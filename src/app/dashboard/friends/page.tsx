'use client';

import { AuthContext } from '@/context/AuthContext';
import User from '@/entities/user.entity';
import UserService from '@/services/user.service';
import { Avatar, Box, Button, Flex, FormControl, FormLabel, HStack, Input, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import React from 'react';

export default function FriendsPage() {
  const { user } = React.useContext(AuthContext);

  const [friends, setFriends] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    UserService.getUsers(1).then((response) => {
      setFriends(response.data);
    });
  }, []);

  return (
    <Box>
      <Flex>
        <Stack w="50%">
          <Text>Usuários do VerdeApp</Text>
          <Wrap>
            {friends.map((friend, index) => (
              <WrapItem key={index} justifyItems="center">
                <Avatar name={friend.userName} src={friend.imageUrl} />
                <Text>{friend.userName}</Text>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
        <Stack w="50%">
          <FormControl>
            <FormLabel textAlign="center">Adicionar um amigo</FormLabel>
            <Input type="text" />
            <Button w="60%" marginTop="10px" colorScheme="blue">
              Adicionar
            </Button>
          </FormControl>
        </Stack>
      </Flex>
    </Box>
  );
}
