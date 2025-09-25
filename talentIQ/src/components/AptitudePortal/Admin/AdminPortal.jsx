// src/components/AdminPortal/AdminPortal.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  TextField,
  Button,
  Modal,
  Divider,
  Tooltip,
} from "@mui/material";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

export default function AdminPortal() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [scoreRange, setScoreRange] = useState({ min: "", max: "" });
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();

  // Fetch results from backend
  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();

      // Deduplicate: keep latest result per student
      const uniqueResults = Object.values(
        data.reduce((acc, item) => {
          const id = item.studentId?._id ?? item.student?._id;
          if (!id) return acc;
          if (!acc[id] || new Date(item.createdAt) > new Date(acc[id].createdAt)) {
            acc[id] = item;
          }
          return acc;
        }, {})
      );

      setResults(uniqueResults);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Handle Re-test
  const handleRetest = async (studentId) => {
    if (!window.confirm("Are you sure you want to reset this student's result?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/results/retest/${studentId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(data.message);
      fetchResults();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to reset result");
    }
  };

  // Compute stats for each result
  const getStats = (res) => {
    const total = res.answers?.length ?? 0;
    const unanswered = res.answers?.filter((a) => !a || a === "").length ?? 0;
    const attempted = total - unanswered;
    const correct = res.score ?? 0;
    const wrong = attempted - correct;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
    return { total, correct, wrong, unanswered, score: correct, percentage };
  };

  // Filter by search and score
  const filteredResults = results.filter((r) => {
    const stats = getStats(r);
    const name = r.studentId?.fullName ?? r.student?.fullName ?? "";
    const inScoreRange =
      (scoreRange.min === "" || stats.score >= Number(scoreRange.min)) &&
      (scoreRange.max === "" || stats.score <= Number(scoreRange.max));
    return name.toLowerCase().includes(search.toLowerCase()) && inScoreRange;
  });

  // Sorting (by student name)
  const sortedResults = filteredResults.sort((a, b) => {
    const aName = (a.studentId?.fullName ?? a.student?.fullName ?? "").toLowerCase();
    const bName = (b.studentId?.fullName ?? b.student?.fullName ?? "").toLowerCase();
    return aName.localeCompare(bName);
  });

  const paginatedResults = sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleViewDetails = (res) => {
    setSelectedStudent(res);
    setOpenModal(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    const csv = [
      ["Student Name", "Email", "Mobile", "Department", "College", "Score", "Total", "Correct", "Wrong", "Not Answered", "Percentage"],
      ...sortedResults.map((r) => {
        const s = getStats(r);
        const student = r.studentId ?? r.student;
        return [
          student?.fullName ?? "",
          student?.email ?? "",
          student?.mobile ?? "",
          student?.department ?? "",
          student?.college ?? "",
          s.score,
          s.total,
          s.correct,
          s.wrong,
          s.unanswered,
          s.percentage,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "results.csv");
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4, bgcolor: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Admin Portal - Student Results</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Search & Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Min score"
          type="number"
          value={scoreRange.min}
          onChange={(e) => setScoreRange((s) => ({ ...s, min: e.target.value }))}
          sx={{ width: 120 }}
        />
        <TextField
          label="Max score"
          type="number"
          value={scoreRange.max}
          onChange={(e) => setScoreRange((s) => ({ ...s, max: e.target.value }))}
          sx={{ width: 120 }}
        />
        <Button variant="contained" color="success" sx={{ ml: "auto" }} onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>

      {/* Results Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Student</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Score</TableCell>
              <TableCell sx={{ color: "#fff" }}>Total</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Correct</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Wrong</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Not Answered</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Percentage</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Retest count</TableCell>
              <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedResults.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No results found
                </TableCell>
              </TableRow>
            )}

            {paginatedResults.map((r) => {
              const s = getStats(r);
              const student = r.studentId ?? r.student;
              const maxAttemptsReached = student.retestCount >= 2;

              return (
                <TableRow key={r._id}>
                  <TableCell>{student?.fullName ?? "Unknown"}</TableCell>
                  <TableCell>{student?.email ?? "—"}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{s.score}</TableCell>
                  <TableCell>{s.total}</TableCell>
                  <TableCell sx={{ color: "green", fontWeight: "bold" }}>{s.correct}</TableCell>
                  <TableCell sx={{ color: "red", fontWeight: "bold" }}>{s.wrong}</TableCell>
                  <TableCell sx={{ color: "orange", fontWeight: "bold" }}>{s.unanswered}</TableCell>
                  <TableCell sx={{ color: "blue", fontWeight: "bold" }}>{s.percentage}%</TableCell>
                 <TableCell>{student?.retestCount ?? 0}</TableCell>
              

                  <TableCell>
                    <Button size="small" onClick={() => handleViewDetails(r)}>
                      View
                    </Button>

                    <Tooltip
                      title={maxAttemptsReached ? "Max attempts reached" : ""}
                      arrow
                    >
                      <span>
                        <Button
  size="small"
  color="warning"
  sx={{ ml: 1 }}
  onClick={() => handleRetest(student._id)}
  disabled={student.retestCount >= 2} // ✅ disable if max attempts reached
>
  Re-test
</Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedResults.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Student Details Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={{ width: 600, p: 3, mx: "auto", mt: "10%", borderRadius: 2 }}>
          {selectedStudent && (
            <>
              <Typography variant="h6">
                {selectedStudent.studentId?.fullName ?? selectedStudent.student?.fullName}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">Email: {selectedStudent.studentId?.email}</Typography>
              <Typography variant="body2">Mobile: {selectedStudent.studentId?.mobile}</Typography>
              <Typography variant="body2">Department: {selectedStudent.studentId?.department}</Typography>
              <Typography variant="body2">Year: {selectedStudent.studentId?.pursuingYear}</Typography>
              <Typography variant="body2">College: {selectedStudent.studentId?.college}</Typography>
              <Typography variant="body2">
                DOB:{" "}
                {selectedStudent.studentId?.dob
                  ? new Date(selectedStudent.studentId.dob).toLocaleDateString()
                  : "—"}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">Total: {getStats(selectedStudent).total}</Typography>
              <Typography variant="body2">Correct: {getStats(selectedStudent).correct}</Typography>
              <Typography variant="body2">Wrong: {getStats(selectedStudent).wrong}</Typography>
              <Typography variant="body2">Not answered: {getStats(selectedStudent).unanswered}</Typography>
              <Typography variant="body2">Score: {getStats(selectedStudent).score}</Typography>
              <Button fullWidth sx={{ mt: 2 }} variant="contained" onClick={() => setOpenModal(false)}>
                Close
              </Button>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}
