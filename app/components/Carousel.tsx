import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";

const slides = [
    { id: 1, color: '#0038D1', label: 'Slide 1'},
    { id: 2, color: "7B61FF", label: 'Slide 2' },
    { id: 3, color: "#1be09e", label: 'Slide 3' }
]

function Carousel() {
    const [currentSlide, setCurrentSlide] = useState(1);

    return (
        <Box>
            <Box>
                <Box>
                    <Box sx={{ color: currentSlide == 1 ? "black" : "white" }}>
                        I'm Box 1!
                    </Box>
                    <Box sx={{ color: currentSlide == 2 ? "black" : "white" }}>
                        I'm Box 2!
                    </Box>
                </Box>
            </Box>
            <Box> {currentSlide} </Box>
            <Stack direction="row">
                <Button onClick={() => setCurrentSlide((prev) => prev + 1)}
                >Click Me!</Button>
            </Stack>
        </Box>
    );
}

export default Carousel;