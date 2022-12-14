import { useState } from 'react';
import { Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import Checkbox from '../../components/Checkbox';
import styles from './styles.module.css';

type Props = {
  visible: boolean;
};

type CheckListItemProps = {
  text: string;
  extraText?: string;
  checked: boolean;
  onChecked: (checked: boolean) => void;
};

const CheckListItem = ({
  text,
  extraText,
  checked,
  onChecked,
}: CheckListItemProps) => {
  return (
    <ListGroupItem>
      <Checkbox label={text} checked={checked} onChecked={onChecked} />
      <span className={styles.extraText}>{extraText}</span>
    </ListGroupItem>
  );
};

const DailyCheckIn = ({ visible }: Props) => {
  const [madeCoffee, setMadeCoffee] = useState(false);
  const [analyzeNetWorth, setAnalyzeNetWorth] = useState(false);
  const [checkSpending, setCheckSpending] = useState(false);
  const [checkSpendingGoals, setCheckSpendingGoals] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);

  return !visible ? null : (
    <Container>
      <h1>Daily Check-In</h1>
      <ListGroup>
        <CheckListItem
          text="Make Coffee"
          checked={madeCoffee}
          onChecked={setMadeCoffee}
        />
        <CheckListItem
          text="Analyze Net Worth"
          checked={analyzeNetWorth}
          onChecked={setAnalyzeNetWorth}
        />
        <CheckListItem
          text="Note Yesterdays Spending"
          checked={checkSpending}
          onChecked={setCheckSpending}
        />
        <CheckListItem
          text="Monthly Spending Goals"
          extraText=" - How much spent so far this month? Are you sticking to your goals?"
          checked={checkSpendingGoals}
          onChecked={setCheckSpendingGoals}
        />
        <CheckListItem
          text="Check Investments"
          extraText=" - Saving Goals on track?"
          checked={savingGoals}
          onChecked={setSavingGoals}
        />
      </ListGroup>
    </Container>
  );
};

export default DailyCheckIn;
