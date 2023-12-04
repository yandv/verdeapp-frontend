'use client';

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import User from '@/entities/user.entity';
import ForbbidenPage from '@/components/Forbbiden';
import { DEFAULT_AVATAR_URL } from '@/utils/constants';
import Link from 'next/link';

interface LinkItemProps {
  name: string;
  icon: IconType;
  redirectTo: string;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
}

interface MobileProps extends FlexProps {
  user: User | null;
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  user: User | null;
  onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Chat', icon: FiHome, redirectTo: '/dashboard/' },
  { name: 'Amigos', icon: FiTrendingUp, redirectTo: '/dashboard/friends' },
  { name: 'Settings', icon: FiSettings, redirectTo: '/dashboard/settings' },
];

const SidebarContent = ({ onClose, user, ...rest }: SidebarProps) => {
  const router = useRouter();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <Link key={link.name} href={link.redirectTo}>
          <NavItem icon={link.icon}>{link.name}</NavItem>
        </Link>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Box style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, user, ...rest }: MobileProps) => {
  const { logout } = React.useContext(AuthContext);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'sm'} src={user?.imageUrl || DEFAULT_AVATAR_URL} />
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">{user?.userName}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem as={Link} href="/dashboard/my-profile">
                Profile
              </MenuItem>
              <MenuItem as={Link} href="/dashboard/settings">
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => logout('/login')}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = React.useContext(AuthContext);

  if (!user) {
    return <ForbbidenPage />;
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} user={user} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} user={user} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} user={user} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}
