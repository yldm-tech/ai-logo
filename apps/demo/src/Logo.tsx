/**
 * The mark is a bracket pair holding a filled dot.
 *
 * This package is a container for other people's brand marks, and the way you get one is by importing it — so the brackets are the container and the punctuation of the call at once, and the dot is whichever mark is being asked for. It stays monochrome on purpose: the page already carries 323 logos in full colour, and a coloured mark of our own would just be a 324th competing for attention.
 *
 * Drawn on a 24-unit grid. Each bracket is a true circular arc of radius 7.5 reaching 58° either side of the horizontal, stroked at 3 units with round caps, which is what keeps the thickness even and the terminals clean at any size. The openings at the top and bottom are what separate this from a ring: closed up much past 70° it stops reading as a bracket and starts reading as a target.
 */
export const Logo = ({ size = 22, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M8.03 5.64A7.5 7.5 0 0 0 8.03 18.36"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={3}
    />
    <path
      d="M15.97 5.64A7.5 7.5 0 0 1 15.97 18.36"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={3}
    />
    <circle cx={12} cy={12} fill="currentColor" r={3.4} />
  </svg>
);
