import doneIcon from "./done.svg";

const DoneIcon = ({ className, width = 44, height = 44, ...props }) => (
  <img
    src={doneIcon}
    alt="Done"
    className={className}
    width={width}
    height={height}
    {...props}
  />
);

export default DoneIcon;
