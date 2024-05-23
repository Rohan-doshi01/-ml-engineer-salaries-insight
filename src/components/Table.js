import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

function DataTable({ data, onSort, onRowClick }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => onSort('year')}>Year</TableCell>
            <TableCell onClick={() => onSort('jobs')}>Number of Jobs</TableCell>
            <TableCell onClick={() => onSort('averageSalary')}>Average Salary (USD)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.year} hover onClick={() => onRowClick(row.year)}>
              <TableCell>{row.year}</TableCell>
              <TableCell>{row.jobs}</TableCell>
              <TableCell>{row.averageSalary.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
