type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 24, className }: LogoProps) {
  return (
    <span
      className={['inline-flex items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M36.505 27.547L65.675 37.467L67.285 32.733L38.115 22.813L36.505 27.547Z"
          fill="#635BFF"
          fillOpacity="0.52"
        />
        <path
          d="M29.613 33.407L51.153 68.897L55.427 66.303L33.887 30.813L29.613 33.407Z"
          fill="#635BFF"
          fillOpacity="0.46"
        />
        <path
          d="M69.2669 45.382L60.8669 65.872L65.4929 67.768L73.8929 47.278L69.2669 45.382Z"
          fill="#635BFF"
          fillOpacity="0.4"
        />
        <path
          d="M18.162 63.727L24.652 34.237L19.768 33.163L13.278 62.653L18.162 63.727Z"
          fill="#635BFF"
          fillOpacity="0.32"
        />
        <path
          d="M21.6 74.538L47.77 78.028L48.43 73.072L22.26 69.582L21.6 74.538Z"
          fill="#635BFF"
          fillOpacity="0.3"
        />
        <path
          d="M25 34C32.1797 34 38 28.1797 38 21C38 13.8203 32.1797 8 25 8C17.8203 8 12 13.8203 12 21C12 28.1797 17.8203 34 25 34Z"
          fill="#635BFF"
        />
        <path
          d="M75 47C79.9706 47 84 42.9706 84 38C84 33.0294 79.9706 29 75 29C70.0294 29 66 33.0294 66 38C66 42.9706 70.0294 47 75 47Z"
          fill="#635BFF"
          fillOpacity="0.62"
        />
        <path
          d="M59 88C65.0751 88 70 83.0751 70 77C70 70.9249 65.0751 66 59 66C52.9249 66 48 70.9249 48 77C48 83.0751 52.9249 88 59 88Z"
          fill="#635BFF"
          fillOpacity="0.8"
        />
        <path
          d="M14 79C18.4183 79 22 75.4183 22 71C22 66.5817 18.4183 63 14 63C9.58172 63 6 66.5817 6 71C6 75.4183 9.58172 79 14 79Z"
          fill="#635BFF"
          fillOpacity="0.48"
        />
      </svg>
      <span className="inline-flex items-baseline font-display text-[0.9375rem] font-bold tracking-tight text-foreground">
        <span>index</span>
        <span className="text-primary">folio</span>
      </span>
    </span>
  )
}
