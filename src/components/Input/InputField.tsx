import type { ComponentProps } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

type FormProps = ComponentProps<typeof Form.Control>;

type Props = {
  label: string;
  subLabel?: string[];
  value: FormProps['value'];
  onChange: (newValue: string) => void;
  displayAfter?: string;
  type?: 'text' | 'password' | 'number' | 'date';
  disabled?: boolean;
  step?: number;
  onKeyDown?: NonNullable<FormProps['onKeyDown']>;
};

const InputField = ({
  label,
  subLabel = [],
  value,
  onChange,
  onKeyDown,
  displayAfter,
  disabled,
  step,
  type = 'text',
}: Props) => (
  <Form.Group className="mb-3">
    <Form.Label style={{ display: 'block', fontWeight: 'bold', margin: 0 }}>
      {label}
    </Form.Label>
    {subLabel.map((x) => (
      <Form.Label key={x} style={{ display: 'block' }}>
        {x}
      </Form.Label>
    ))}
    <Form.Control
      step={step}
      disabled={disabled}
      type={type}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      onWheelCapture={(e) => {
        e.currentTarget.blur();
      }}
      onKeyDown={onKeyDown}
    />
    {displayAfter && <InputGroup.Text>{displayAfter}</InputGroup.Text>}
  </Form.Group>
);

export default InputField;
