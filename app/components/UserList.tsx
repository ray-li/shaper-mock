import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
}

function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/users")
            // Question: What exactly is happening? You chain Promises with .then?
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            });
    }, []); // Dependency array: makes this only run when the component first appears
    
    if (loading) return "I'm loading!";

    return (
        <Stack direction="column">
            { users.map((user) => (
                <Box>{user.email}</Box>
            )) }
        </Stack>
    )
}

export default UserList;