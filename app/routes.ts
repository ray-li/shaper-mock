import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx")] satisfies RouteConfig;

export async function loader() {
    const users = [
        { id: 1, name: "Ren Provey", email: "ren@shapertools.com" },
        { id: 2, name: "M Weathers", email: "mweathers@shapertools.com" },
        { id: 3, name: "Terrance", email: "terrance@shapertools.com" },
        { id: 4, name: "Jeremy", email: "jeremy@shapertools.com" },
        { id: 5, name: "Ray", email: "ray@shapertools.com" },
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return Response.json(users);
}