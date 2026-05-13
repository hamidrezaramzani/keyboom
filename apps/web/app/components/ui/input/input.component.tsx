import { forwardRef } from "react";
import { InputProps } from "./input.type";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      type = "text",
      containerClassName = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const isPrice = type === "price";
    const inputType = isPrice ? "text" : type;

    const formatPrice = (value: string) => {
      const numbers = value.replace(/[^0-9]/g, "");
      return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPrice(e.target.value);
      e.target.value = formatted;
      props.onChange?.(e);
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 top-1/2 bottom-1/2 flex items-center pr-3 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              disabled:text-gray-300 disabled:bg-slate-900 disabled:cursor-not-allowed
              w-full px-4 py-2.5 bg-gray-800/50 border rounded-xl 
              text-white placeholder-gray-500
              outline-none
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              transition-all duration-200
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:border-indigo-500"}
              ${icon ? "pl-10" : ""}
              ${className}
            `}
            onChange={isPrice ? handlePriceChange : props.onChange}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
