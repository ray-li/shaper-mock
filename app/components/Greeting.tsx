import { Box, Typography } from "@mui/material";

type GreetingProps = {
    name: string;
    age: number;
}

// The function name must be capitalized
// React distinguishes components from HTML tags by case
function Greeting({ name, age }: GreetingProps) {
    const shoutName = name.toUpperCase();
    const advancedAge = age + 24;
    
    return (
        <Box>
            <Typography variant="h1">What's up {name}?</Typography>
            <Typography variant="h2">{shoutName}</Typography>
            <Typography variant="body1">Your age is {age}. Your advanced age is {advancedAge}</Typography>
            <Typography variant="body1">How cool is that?</Typography>
        </Box>
    );
}

export default Greeting;


/***
 * If Greeting had an inner child, it would look like:
 * jsx(Fragment, {
 *      children: [
 *          jsx(NameHeader, {})
 *      ]
 * })
 * 
 */