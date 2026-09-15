export function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 48 36"
        aria-hidden="true"
        className="h-9 w-12 shrink-0 text-primary"
      >
        <rect
          x="4"
          y="4"
          width="16"
          height="30"
          rx="8"
          transform="rotate(28 12 19)"
          fill="currentColor"
        />
        <rect
          x="24"
          y="2"
          width="16"
          height="30"
          rx="8"
          transform="rotate(28 32 17)"
          fill="currentColor"
          opacity="0.85"
        />
      </svg>
      <div className="leading-tight">
        <p className="text-lg font-bold text-slate-900">WorkHub</p>
        <p className="text-sm text-neutral">Employee Management</p>
      </div>
    </div>
  );
}
