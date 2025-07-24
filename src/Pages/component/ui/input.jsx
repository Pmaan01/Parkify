import { cn } from "../../../lib/utils";

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "flex w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-black shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};
