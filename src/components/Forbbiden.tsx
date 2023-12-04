import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function ForbbidenPage() {
    return (
        <Box>
            <Flex h="100vh" w="100vw" justify="center" align="center" direction="column">
                <Text>Você não tem permissão para acessar esta página.</Text>
                <Link href="/login">Logue-se para entrar na página!</Link>
            </Flex>
        </Box>
    )
}