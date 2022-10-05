import { ComponentProps } from 'react';
import { Form } from 'react-bootstrap';

type FormProps = ComponentProps<typeof Form.Control>;

type Props = {
  label: string;
  subLabel?: string[];
  type?: string;
  disabled?: boolean;
  step?: number;
  value: string;
  setValue: (v: string) => void;
  onKeyDown?: NonNullable<FormProps['onKeyDown']>;
};

const Input = ({
  label,
  subLabel = [],
  value,
  type,
  disabled,
  step,
  setValue,
  onKeyDown,
}: Props) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label style={{ display: 'block', fontWeight: 'bold' }}>
        {label}
      </Form.Label>
      {subLabel.map((x) => (
        <Form.Label key={x} style={{ display: 'block' }}>
          {x}
        </Form.Label>
      ))}
      <Form.Control
        type={type || 'text'}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onWheelCapture={(e) => {
          e.currentTarget.blur();
        }}
        onKeyDown={onKeyDown}
      />
    </Form.Group>
  );
};

export default Input;
