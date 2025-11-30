const CommentsIcon = ({ className, width = 24, height = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    className={className}
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.78 3C16.428 3 20 6.25 20 10.143c0 1.71-.756 3.25-1.99 4.416-.09.086-.145.204-.163.327l-.293 2.228a.656.656 0 0 1-.884.527l-1.991-.797a.629.629 0 0 0-.415-.026c-.774.233-1.6.35-2.56.35-4.647 0-8.22-3.25-8.22-7.143C3.484 6.25 7.128 3 11.78 3Z"
    />
  </svg>
);

export default CommentsIcon;
