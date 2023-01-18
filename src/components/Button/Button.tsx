import type { ReactNode } from 'react';
import { Button as BootstrapButton, Spinner } from 'react-bootstrap';
import styles from './button.module.css';

type Props = {
  variant:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light';
  content: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties | undefined;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  content,
  variant,
  onClick,
  disabled,
  loading,
  style,
  className,
  type,
}: Props) => {
  return (
    <BootstrapButton
      style={style}
      className={`${styles.button} ${className ?? ''}`}
      variant={variant}
      type={type || 'button'}
      disabled={disabled}
      onClick={onClick}
      size="sm"
    >
      {loading ? (
        <Spinner
          animation="border"
          size="sm"
          style={{ verticalAlign: 'middle' }}
        />
      ) : (
        content
      )}
    </BootstrapButton>
  );
};

export default Button;
