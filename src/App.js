import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import DataTable from './components/Table';
import {
  Container, Typography, CircularProgress, Box, Table, TableBody, TableCell,
  TableHead, TableRow, TableContainer, Paper, TablePagination, IconButton, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import Chart from './components/Chart';

import './App.css';
import Chatbot from './components/Chatbot';

function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedYear, setSelectedYear] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    fetch('/salaries.csv')
      .then(response => response.text())
      .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true }).data;
        const filteredData = parsedData.filter(row => row.work_year && row.salary_in_usd && row.job_title);
        const aggregatedData = aggregateData(filteredData);
        setData(aggregatedData);
        setSortedData(aggregatedData);
      });
  }, []);

  const aggregateData = (data) => {
    const years = {};
    data.forEach(row => {
      const year = row.work_year;
      if (!years[year]) {
        years[year] = { year, jobs: 0, totalSalary: 0, titles: {} };
      }
      years[year].jobs += 1;
      years[year].totalSalary += parseFloat(row.salary_in_usd);
      const title = row.job_title;
      if (!years[year].titles[title]) {
        years[year].titles[title] = 0;
      }
      years[year].titles[title] += 1;
    });

    return Object.values(years).map(yearData => ({
      year: yearData.year,
      jobs: yearData.jobs,
      averageSalary: yearData.totalSalary / yearData.jobs,
      titles: yearData.titles
    }));
  };

  const handleSort = (column) => {
    const sorted = [...sortedData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setSortedData(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleRowClick = (year) => {
    const yearData = data.find(d => d.year === year);
    setJobTitles(Object.entries(yearData.titles));
    setSelectedYear(year);
    setPage(0); // Reset pagination when a new year is selected
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container className="App">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          ML Engineer Salaries
        </Typography>
        <Tooltip title="Show Chart">
          <IconButton onClick={() => setShowChart(!showChart)} style={{ color: showChart ? 'blue' : 'inherit' }}>
            <ShowChartIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      {data.length === 0 ? (
        <CircularProgress />
      ) : (
        <DataTable data={sortedData} onSort={handleSort} onRowClick={handleRowClick} />
      )}
      {selectedYear && (
        <Box mt={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h2" gutterBottom>
              Job Titles in {selectedYear}
            </Typography>
            <IconButton onClick={() => setSelectedYear(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Number of Jobs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobTitles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([title, count]) => (
                  <TableRow key={title}>
                    <TableCell>{title}</TableCell>
                    <TableCell>{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={jobTitles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      )}
      {showChart && (
        <Box mt={4}>
          <Chart data={data} />
        </Box>
      )}
      <Chatbot/>
    </Container>
  );
}

export default App;
