export function LeaderBoard() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="none"
      viewBox="0 0 40 40"
    >
      <path
        fill="url(#a)"
        d="M0 10C0 4.477 4.477 0 10 0h20c5.523 0 10 4.477 10 10v20c0 5.523-4.477 10-10 10H10C4.477 40 0 35.523 0 30z"
      />
      <path
        stroke="#51a2ff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="M18.333 22.217v1.355a1.67 1.67 0 0 1-.813 1.413 4.17 4.17 0 0 0-1.687 3.33M21.667 22.217v1.355a1.67 1.67 0 0 0 .813 1.413 4.17 4.17 0 0 1 1.687 3.33M25 17.5h1.25a2.083 2.083 0 0 0 0-4.167H25M13.333 28.333h13.334"
      />
      <path
        stroke="#51a2ff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="M15 17.5a5 5 0 0 0 10 0v-5a.833.833 0 0 0-.833-.833h-8.334A.833.833 0 0 0 15 12.5zM15 17.5h-1.25a2.083 2.083 0 1 1 0-4.167H15"
      />
      <defs>
        <linearGradient
          id="a"
          x1="0"
          x2="40"
          y1="0"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2b7fff" stopOpacity=".2" />
          <stop offset="1" stopColor="#ad46ff" stopOpacity=".2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
