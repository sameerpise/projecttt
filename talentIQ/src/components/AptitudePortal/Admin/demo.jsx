import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  Modal,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { saveAs } from "file-saver";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import StudentList from "./StudentList";
import QuestionManager from "./QuestionManager";
import { useNavigate } from "react-router-dom";

export  function AdminPortal() {
  const [view, setView] = useState("dashboard");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [scoreRange, setScoreRange] = useState({ min: "", max: "" });
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "student", direction: "asc" });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null") || { fullName: "Admin", email: "admin@example.com" };

  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/results");
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      const uniqueResults = Object.values(
        data.reduce((acc, item) => {
          const id = item.studentId?._id ?? item.student?._id;
          if (!id) return acc;
          if (!acc[id] || new Date(item.createdAt) > new Date(acc[id].createdAt)) acc[id] = item;
          return acc;
        }, {})
      );
      setResults(uniqueResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleRetest = async (studentId) => {
    if (!window.confirm("Allow this student to retest?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/results/retest/${studentId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(data.message);
      fetchResults();
    } catch (err) {
      alert(err.message || "Failed to allow retest");
    }
  };

  const getStats = (res, useRetest = false) => {
    const answers = useRetest ? res.retestAnswers : res.answers;
    const score = useRetest ? res.retestScore : res.score;
    const total = answers?.length ?? 0;
    const unanswered = answers?.filter((a) => !a || a === "").length ?? 0;
    const attempted = total - unanswered;
    const correct = score ?? 0;
    const wrong = attempted - correct;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
    return { total, correct, wrong, unanswered, score: correct, percentage };
  };

  const filteredResults = results.filter((r) => {
    const stats = getStats(r);
    const name = r.studentId?.fullName ?? r.student?.fullName ?? "";
    const inScoreRange =
      (scoreRange.min === "" || stats.score >= Number(scoreRange.min)) &&
      (scoreRange.max === "" || stats.score <= Number(scoreRange.max));
    return name.toLowerCase().includes(search.toLowerCase()) && inScoreRange;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedResults = [...filteredResults].sort((a, b) => {
    const getValue = (r, key) => {
      const stats = getStats(r);
      switch (key) {
        case "score": return stats.score;
        case "correct": return stats.correct;
        case "wrong": return stats.wrong;
        case "unanswered": return stats.unanswered;
        case "percentage": return Number(stats.percentage);
        default: return (r.studentId?.fullName ?? r.student?.fullName ?? "").toLowerCase();
      }
    };
    const valA = getValue(a, sortConfig.key);
    const valB = getValue(b, sortConfig.key);
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedResults = sortedResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const topPerformers = sortedResults.filter((r) => Number(getStats(r).percentage) >= 80);
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  const handleExportCSV = () => {
    const csv = [
      ["Student Name", "Email", "Mobile", "Department", "College", "Score (Original/Retest)", "Total", "Correct", "Wrong", "Not Answered", "Percentage"],
      ...sortedResults.map((r) => {
        const s = getStats(r);
        const sRetest = r.retestScore !== undefined ? getStats(r, true) : null;
        const student = r.studentId ?? r.student;
        return [
          student?.fullName ?? "",
          student?.email ?? "",
          student?.mobile ?? "",
          student?.department ?? "",
          student?.college ?? "",
          sRetest ? `${s.score} / ${sRetest.score}` : s.score,
          sRetest ? `${s.total} / ${sRetest.total}` : s.total,
          sRetest ? `${s.correct} / ${sRetest.correct}` : s.correct,
          sRetest ? `${s.wrong} / ${sRetest.wrong}` : s.wrong,
          sRetest ? `${s.unanswered} / ${sRetest.unanswered}` : s.unanswered,
          sRetest ? `${s.percentage}% / ${sRetest.percentage}%` : `${s.percentage}%`,
        ];
      }),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "results.csv");
  };

  const getScoreColor = (score) => {
    if (score <= 30) return "#d32f2f";
    if (score <= 70) return "#ed6c02";
    return "#2e7d32";
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* Sidebar */}
      <Paper sx={{ width: 220, m: 2, p: 2, borderRadius: 3, bgcolor: "#fff" }} elevation={3}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ mr: 1 }}>{user.fullName?.[0]}</Avatar>
          <Box>
            <Typography variant="subtitle1">{user.fullName}</Typography>
            <Typography variant="caption">{user.email}</Typography>
          </Box>
        </Box>

        <Button fullWidth variant={view === "dashboard" ? "contained" : "outlined"} sx={{ mb: 1 }} onClick={() => setView("dashboard")}>Dashboard</Button>
        <Button fullWidth variant={view === "students" ? "contained" : "outlined"} sx={{ mb: 1 }} onClick={() => setView("students")}>Students</Button>
        <Button fullWidth variant={view === "tests" ? "contained" : "outlined"} sx={{ mb: 1 }} onClick={() => setView("tests")}>Tests</Button>
        <Button fullWidth variant="contained" color="error" onClick={handleLogout}>Logout</Button>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {view === "dashboard" && (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#1976d2", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Total Students</Typography>
                    <Typography variant="h5">{results.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#2e7d32", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Top Performers</Typography>
                    <Typography variant="h5">{topPerformers.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#ed6c02", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Average Score</Typography>
                    <Typography variant="h5">
                      {results.length > 0
                        ? Math.round(results.reduce((acc, r) => acc + getStats(r).score, 0) / results.length)
                        : 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#9c27b0", color: "#fff" }}>
                  <CardContent>
                    <Typography variant="subtitle1">Total Retests</Typography>
                    <Typography variant="h5">
                      {results.reduce((acc, r) => acc + (r.studentId?.retestCount ?? r.student?.retestCount ?? 0), 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
              <TextField label="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1, minWidth: 200 }} />
              <TextField label="Min score" type="number" value={scoreRange.min} onChange={(e) => setScoreRange((s) => ({ ...s, min: e.target.value }))} sx={{ width: 120 }} />
              <TextField label="Max score" type="number" value={scoreRange.max} onChange={(e) => setScoreRange((s) => ({ ...s, max: e.target.value }))} sx={{ width: 120 }} />
              <Button variant="contained" color="success" startIcon={<SaveAltIcon />} onClick={handleExportCSV}>Export CSV</Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#1976d2" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff", cursor: "pointer" }} onClick={() => handleSort("student")}>Student</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                    <TableCell sx={{ color: "#fff", cursor: "pointer" }} onClick={() => handleSort("score")}>Score</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Total</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Correct</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Wrong</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Not Answered</TableCell>
                    <TableCell sx={{ color: "#fff", cursor: "pointer" }} onClick={() => handleSort("percentage")}>Percentage</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Retest</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">No results found</TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((r) => {
                      const s = getStats(r);
                      const sRetest = r.retestScore !== undefined ? getStats(r, true) : null;
                      const student = r.studentId ?? r.student;
                      const maxAttemptsReached = student.retestCount >= 2;

                      return (
                        <React.Fragment key={r._id}>
                          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                            <TableCell rowSpan={sRetest ? 2 : 1}>{student?.fullName}</TableCell>
                            <TableCell rowSpan={sRetest ? 2 : 1}>{student?.email ?? "—"}</TableCell>
                            <TableCell sx={{ fontWeight: "bold", color: getScoreColor(s.score) }}>{s.score}</TableCell>
                            <TableCell>{s.total}</TableCell>
                            <TableCell sx={{ color: "green", fontWeight: "bold" }}>{s.correct}</TableCell>
                            <TableCell sx={{ color: "red", fontWeight: "bold" }}>{s.wrong}</TableCell>
                            <TableCell sx={{ color: "orange", fontWeight: "bold" }}>{s.unanswered}</TableCell>
                            <TableCell sx={{ color: "blue", fontWeight: "bold" }}>{s.percentage}%</TableCell>
                            <TableCell rowSpan={sRetest ? 2 : 1}>{student?.retestCount ?? 0}</TableCell>
                            <TableCell rowSpan={sRetest ? 2 : 1}>
                              <Button size="small" onClick={() => { setSelectedStudent(r); setOpenModal(true); }}>View</Button>
                              <Tooltip title={maxAttemptsReached ? "Max attempts reached" : ""} arrow>
                                <span>
                                  <Button size="small" color="warning" sx={{ ml: 1 }} onClick={() => handleRetest(student._id)} disabled={maxAttemptsReached}>Re-test</Button>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>

                          {sRetest && (
                            <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                              <TableCell sx={{ fontWeight: "bold", color: getScoreColor(sRetest.score) }}>{sRetest.score}</TableCell>
                              <TableCell>{sRetest.total}</TableCell>
                              <TableCell sx={{ color: "green", fontWeight: "bold" }}>{sRetest.correct}</TableCell>
                              <TableCell sx={{ color: "red", fontWeight: "bold" }}>{sRetest.wrong}</TableCell>
                              <TableCell sx={{ color: "orange", fontWeight: "bold" }}>{sRetest.unanswered}</TableCell>
                              <TableCell sx={{ color: "blue", fontWeight: "bold" }}>{sRetest.percentage}%</TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination component="div" count={sortedResults.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25, 50]} />
          </>
        )}

        {view === "students" && <StudentList results={results} />}
        {view === "tests" && <QuestionManager />}

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Paper sx={{ width: { xs: "90%", sm: 500 }, p: 3, mx: "auto", mt: "10%", borderRadius: 2 }}>
            {selectedStudent && (
              <>
                <Typography variant="h6">{selectedStudent.studentId?.fullName ?? selectedStudent.student?.fullName}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Email: {selectedStudent.studentId?.email}</Typography>
                <Typography>Mobile: {selectedStudent.studentId?.mobile}</Typography>
                <Typography>Department: {selectedStudent.studentId?.department}</Typography>
                <Typography>Year: {selectedStudent.studentId?.pursuingYear}</Typography>
                <Typography>College: {selectedStudent.studentId?.college}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>Total: {getStats(selectedStudent).total}</Typography>
                <Typography>Correct: {getStats(selectedStudent).correct}</Typography>
                <Typography>Wrong: {getStats(selectedStudent).wrong}</Typography>
                <Typography>Not answered: {getStats(selectedStudent).unanswered}</Typography>
                <Typography>Score: <span style={{ fontWeight: "bold", color: getScoreColor(getStats(selectedStudent).score) }}>{getStats(selectedStudent).score}</span></Typography>
              </>
            )}
          </Paper>
        </Modal>
      </Box>
    </Box>
  );
}
