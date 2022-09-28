import { Container, Table } from 'react-bootstrap';

const mockSalaries = [
  {
    id: 1,
    date: 'hello',
  },
];

const SalaryList = () => {
  return (
    <Container style={{ marginTop: 10, marginBottom: 30 }}>
      <h1>Salary List</h1>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: 5 }}>#</th>
            <th style={{ width: 5 }}>Date</th>
            <th style={{ width: 5 }}>Net Salary</th>
          </tr>
        </thead>
      </Table>
    </Container>
  );
};

export default SalaryList;
