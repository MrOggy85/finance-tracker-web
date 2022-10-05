import { Form } from 'react-bootstrap';

type Props = {
  label: string;
  checked: boolean;
  onChecked: (checked: boolean) => void;
};

const Checkbox = ({ label, checked, onChecked }: Props) => {
  return (
    <Form.Group controlId="formBasicCheckbox">
      <Form.Check
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          onChecked(e.target.checked);
        }}
        label={label}
      />
    </Form.Group>
  );
};

export default Checkbox;
