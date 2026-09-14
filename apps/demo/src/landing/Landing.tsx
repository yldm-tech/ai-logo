import { Cdn } from "./Cdn";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Install } from "./Install";
import { Stats } from "./Stats";
import { Variants } from "./Variants";

export const Landing = () => (
  <>
    <Hero />
    <Stats />
    <Variants />
    <Features />
    <Install />
    <Cdn />
  </>
);
