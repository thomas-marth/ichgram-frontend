const LikeIcon = ({ className, width = 24, height = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    className={className}
    {...props}
  >
    <path
      fill="#262626"
      d="M16.792 3.91c-1.555 0-3.037.739-3.993 1.902C11.844 4.649 10.363 3.91 8.807 3.91c-2.791 0-5.057 2.266-5.057 5.057 0 3.88 3.549 6.813 8.913 11.613l.997.89.997-.89c5.364-4.8 8.913-7.733 8.913-11.613 0-2.79-2.266-5.057-5.057-5.057Z"
    />
  </svg>
);

export default LikeIcon;
