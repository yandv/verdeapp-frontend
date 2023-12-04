import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function LoadingPage() {
    return (
        <Box>
            <Flex h="100vh" w="100vw" justify="center" align="center" direction="column">
                <Text>Página sendo carregada... aguarde!</Text>
            </Flex>
        </Box>
    )
}