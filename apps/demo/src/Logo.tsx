/**
 * The mark is a slot: two brackets around a filled dot.
 *
 * This package is a container for other people's brand marks — the dot stands in for whichever one is being asked for, the brackets for the slot it drops into. It stays monochrome on purpose. The page already carries 323 logos in full colour, and a coloured mark of our own would just be a 324th competing for attention.
 *
 * Drawn on a 24-unit grid with 2-unit strokes so it stays on whole pixels at 24, 48 and 96, and reads at 16.
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
      d="M9 3H5.5A2.5 2.5 0 0 0 3 5.5v13A2.5 2.5 0 0 0 5.5 21H9"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
    />
    <path
      d="M15 3h3.5A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5H15"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
    />
    <circle cx={12} cy={12} fill="currentColor" r={3} />
  </svg>
);
