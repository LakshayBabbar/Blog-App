/* eslint-disable react/prop-types */
const Button = ({ children, type, disabled, style, clickEvent }) => {
  return (
    <button
      type={type}
      className={`${style} px-5 h-12 rounded-md bg-zinc-700 border border-zinc-700 transition-all duration-300 disabled:bg-zinc-900 disabled:cursor-not-allowed`}
      disabled={disabled}
      onClick={clickEvent}
    >
      {children}
    </button>
  );
};

export default Button;
