'use client';

import React from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Flex, Avatar, AvatarBadge, Text, Input, Button, InputGroup, InputRightElement } from '@chakra-ui/react';
import { AuthContext } from '@/context/AuthContext';
import { FaArrowRight } from 'react-icons/fa';

interface Message {
  authorId: number;
  avatarUrl: string;
  message: string;
}

export default function Chat() {
  const { user } = React.useContext(AuthContext);

  const [socket, setSocket] = React.useState<Socket | null>(null);

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = React.useState('');

  const ref = React.useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    if (!currentMessage.trim().length) return;

    if (!socket) return;

    setCurrentMessage('');
    setMessages((prevMessages) => [
      ...prevMessages,
      { authorId: user!.id, message: currentMessage, avatarUrl: user!.imageUrl },
    ]);
    socket.emit('message', currentMessage);
  };

  React.useEffect(() => {
    console.log('Trying to initialize the connection with the server...');
    const socket = io(process.env.WEBSOCKET_URL || 'http://localhost:8080/chat', {
      extraHeaders: {
        Authorization: 'Bearer ' + user?.token,
      },
    });

    socket.on('connection', () => {
      console.log('The connection was successful established!');
      setSocket(socket);

      socket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('disconnect', () => {
        console.log('The connection was disconnected from the server!');
        setSocket(null);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Flex w="100%" h="80vh" justify="center">
      <Text>Chat Global</Text>
      <Flex w="90%" h="100%" flexDir="column" align="center">
        <Flex w="100%" h="100%" overflowY="scroll" flexDirection="column" p="2">
          {socket ? (
            messages.map((item, index) => {
              if (item.authorId === user!.id) {
                return (
                  <Flex key={index} w="100%" justify="flex-end">
                    <Flex bg="black" color="white" minW="100px" maxW="350px" my="1" p="3">
                      <Text>{item.message}</Text>
                    </Flex>
                  </Flex>
                );
              } else {
                return (
                  <Flex key={index} w="100%">
                    <Avatar name="Computer" src={item.avatarUrl} bg="blue.300"></Avatar>
                    <Flex bg="gray.100" color="black" minW="100px" maxW="350px" my="1" p="3">
                      <Text>{item.message}</Text>
                    </Flex>
                  </Flex>
                );
              }
            })
          ) : (
            <Text textAlign={'center'}>Tentando se conectar ao servidor...</Text>
          )}
          <div ref={ref} />
        </Flex>
        <InputGroup>
          <Input
            placeholder="Type Something..."
            border="none"
            borderRadius="none"
            _focus={{
              border: '1px solid black',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(e);
              }
            }}
            value={currentMessage}
            onChange={handleChange}
          />
          <InputRightElement width="4.5rem">
            <Button disabled={currentMessage.trim().length <= 0} onClick={handleSubmit}>
              <FaArrowRight />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
}
