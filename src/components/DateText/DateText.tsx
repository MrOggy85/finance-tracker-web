import { format } from 'date-fns';

type Props = {
  date: string | Date;
  showTime?: boolean;
};

const DateText = ({ date, showTime }: Props) => {
  const year = format(new Date(date), 'yyyy');
  const month = format(new Date(date), 'MMM');
  const day = format(new Date(date), 'do');
  const hour = format(new Date(date), 'HH');
  const minute = format(new Date(date), 'mm');

  return (
    <div>
      <span>{year} </span>
      <span>{month} </span>
      <span>{day}</span>

      {showTime && (
        <div style={{ fontSize: '0.8em' }}>
          {hour}:{minute}
        </div>
      )}
    </div>
  );
};

export default DateText;
