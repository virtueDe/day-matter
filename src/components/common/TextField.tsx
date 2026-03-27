import { forwardRef, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { error, id, label, ...props },
  ref,
) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input
        ref={ref}
        className={`field__control ${error ? 'field__control--error' : ''}`}
        id={id}
        {...props}
      />
      {error ? (
        <span className="field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
});

