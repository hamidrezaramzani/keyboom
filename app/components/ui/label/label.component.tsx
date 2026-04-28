import { LabelProps } from "./label.type";

export const Label = ({ children, htmlFor, className = "" }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-300 mb-2 ${className}`}
    >
      {children}
    </label>
  );
};
