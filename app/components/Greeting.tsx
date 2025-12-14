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
        <>
            <h1>What's up {name}?</h1>
            <h2>{shoutName}</h2>
            <p>Your age is {age}. Your advanced age is {advancedAge}</p>
            <p>How cool is that?</p>
        </>
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