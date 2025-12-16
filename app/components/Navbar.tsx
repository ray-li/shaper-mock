import { Box, Link, Stack } from "@mui/material";

function Navbar() {
    return (
        <Stack 
            direction="row"
            height={40}
            spacing={5} // 8px increments
            justifyContent="center" // horizontal alignment
            alignItems="center"
        >
            <Link href="/store">Products</Link>
            <Box>Studio</Box>
            <Box>ShaperHub</Box>
            <Box>Applications</Box>
            <Box>Sessions</Box>
            <Box>Masterclass</Box>
            <Box>Learn</Box>
        </Stack>
    )
}

export default Navbar;