import { forwardRef, type ButtonHTMLAttributes, type PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    fullWidth = false,
    variant = 'primary',
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`button button--${variant} ${fullWidth ? 'button--full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});
