export function LogoAuth() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 64 64"
    >
      <defs>
        <linearGradient
          id="a"
          x1="0"
          x2="64"
          y1="0"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00bc7c" />
          <stop offset=".5" stopColor="#2b7fff" />
          <stop offset="1" stopColor="#980ffa" />
        </linearGradient>
        <clipPath id="b">
          <path fill="#fff" d="M12 12h40v40H12z" />
        </clipPath>
      </defs>
      <rect width="64" height="64" fill="url(#a)" rx="10" />
      <g clipPath="url(#b)">
        <path d="M12 12h40v40H12z" />
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.333"
          d="M16.167 47.833S22.4 47 24.5 44.5c1.183-1.4 1.167-3.55-.15-4.85a3.634 3.634 0 0 0-4.85-.15c-2.5 2.1-3.333 8.333-3.333 8.333M27 32a36.7 36.7 0 0 1 3.333-6.583 21.47 21.47 0 0 1 18.334-10.084c0 4.534-1.3 12.5-10 18.334A37.3 37.3 0 0 1 32 37z"
        />
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.333"
          d="M27 32h-8.333s.916-5.05 3.333-6.667c2.7-1.8 8.333 0 8.333 0M32 37v8.333s5.05-.916 6.667-3.333c1.8-2.7 0-8.333 0-8.333"
        />
      </g>
    </svg>
  );
}
