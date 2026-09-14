/**
 * The mark is four different shapes in a square: a disc, a rounded square, a triangle and a ring.
 *
 * It is the product stated as plainly as a mark can state it — this package is a set of other people's logos, all different, kept together. The drafts before it were all a container wrapped around a single dot, and a container is the less interesting half of the idea; what makes this worth installing is that there are 323 of them.
 *
 * It stays monochrome on purpose. The page already carries those 323 in full colour, and a coloured mark of our own would just be a 324th competing for attention.
 *
 * Drawn on a 24-unit grid. The four shapes are sized by eye rather than by measurement — the triangle is wider than the disc is round, and the ring is drawn larger than the disc, because equal geometry does not read as equal weight. The ring's stroke is 2.4, which is the heaviest it can be while its counter still holds at 14px.
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
    <circle cx={7} cy={7} fill="currentColor" r={3.8} />
    <rect fill="currentColor" height={7.4} rx={2.22} width={7.4} x={13.3} y={3.3} />
    <path
      d="M6.45 14.25Q7 13.3 7.55 14.25L10.75 19.75Q11.3 20.7 10.2 20.7L3.8 20.7Q2.7 20.7 3.25 19.75Z"
      fill="currentColor"
    />
    <circle cx={17} cy={17} r={3.5} stroke="currentColor" strokeWidth={2.4} />
  </svg>
);
