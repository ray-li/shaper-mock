import type { Route } from "./+types/home";
import { Welcome } from "../components/welcome/welcome";
import Greeting from "~/components/Greeting";
import Carousel from "~/components/Carousel";

// Defines the meta tags for the page's head
// React Router will look for this by naming convention
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <Carousel /> {/* Carousel converts to jsx(Carousel, {}) */}
      <Greeting name="Joanna" age={10} />
      <Welcome />
    </>
  );
}


// Home() transforms to:
/**
 * jsxs(Fragment, {
 *   children: [
 *     jsx(Greeting, { name: "Joanna", age: 10 }),
 *     jsx(Welcome, {}),
 *     jsx(Carousel, {})
 *   ]
 * })
 *
 * Note: jsxs (with 's') is used when there are multiple static children.
 * Fragment is the empty <></> wrapper.
 */