function Carousel() {
    // State - tracks which slide is visible
    const [currentSlide, setCurrentSlide] = useState(0);

    // Calculated values - inside the component because they use state/props
    const slideCount = slides.length;
    const trackWidth = `${slideCount * 100}%`;
    const slideWidth = `${100 / slideCount}%`;
    const offset = `${currentSlide * (100 / slideCount)}%`;

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            {/* Slide Track */}
            <Box sx={{ display: 'flex', width: trackWidth, marginLeft: `-${offset}` }}>
                {slides.map((slide) => (
                    <Box
                        key={slide.id}
                        sx={{
                            width: slideWidth,
                            height: '400px',
                            backgroundColor: slide.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '2rem',
                        }}
                    >
                        {slide.label}
                    </Box>
                ))}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <IconButton onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}>
                    ←
                </IconButton>
                <IconButton onClick={() => setCurrentSlide((prev) => Math.min(slideCount - 1, prev + 1))}>
                    →
                </IconButton>
            </Box>
        </Box>
    );
}