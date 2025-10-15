import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  TableContainer,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await fetch("https://projecttt-15.onrender.com/api/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch("https://projecttt-15.onrender.com/api/results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStudents(), fetchResults()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const hasAppeared = (studentId) =>
    results.some((r) => r.studentId?._id === studentId);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.mobile && s.mobile.includes(search));

    const matchesYear = filterYear ? s.pursuingYear === filterYear : true;
    const matchesDept = filterDepartment
      ? s.department === filterDepartment
      : true;

    return matchesSearch && matchesYear && matchesDept;
  });

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  // Get unique departments & years for filter dropdowns
  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))];
  const years = [...new Set(students.map((s) => s.pursuingYear).filter(Boolean))];

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
      >
        Students List
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        {/* Search */}
        <TextField
          placeholder="Search by name, email, or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200, bgcolor: "#fff", borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Year Filter */}
        <FormControl sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={filterYear}
            label="Year"
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Department Filter */}
        <FormControl sx={{ minWidth: 150, bgcolor: "#fff", borderRadius: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filterDepartment}
            label="Department"
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          boxShadow: 3,
          bgcolor: "#fff",
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              {[
                "Name",
                "Email",
                "Mobile",
                "Department",
                "College",
                "Year",
                "Test Status",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobile || "—"}</TableCell>
                  <TableCell>{student.department || "—"}</TableCell>
                  <TableCell>{student.college || "—"}</TableCell>
                  <TableCell>{student.pursuingYear || "—"}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: hasAppeared(student._id) ? "green" : "red",
                    }}
                  >
                    {hasAppeared(student._id) ? "Appeared" : "Not Appeared"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
