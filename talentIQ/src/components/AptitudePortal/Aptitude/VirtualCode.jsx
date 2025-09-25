import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Controlled as CodeMirror } from "react-codemirror2";
import axios from "axios";

// Codemirror CSS & Modes
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike"; // C, C++, Java

export default function MachineCodingEditor() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Judge0 language IDs
  const languageMap = {
    javascript: 63,
    python: 71,
    c: 50,
    cpp: 54,
    java: 62,
  };

  // CodeMirror mode mapping
  const modeMap = {
    javascript: "javascript",
    python: "python",
    c: "text/x-csrc",
    cpp: "text/x-c++src",
    java: "text/x-java",
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("Running...");
    try {
      if (language === "javascript") {
        // Run JS locally
        let consoleOutput = "";
        const originalLog = console.log;
        console.log = (...args) => {
          consoleOutput += args.join(" ") + "\n";
          originalLog(...args);
        };

        try {
          eval(code);
          setOutput(consoleOutput || "No output");
        } catch (err) {
          setOutput(err.message);
        } finally {
          console.log = originalLog;
        }
      } else {
        // Run other languages via Judge0 API
        const response = await axios.post(
          `https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true`,
          {
            source_code: code,
            language_id: languageMap[language],
            stdin: "",
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key": "<YOUR_RAPIDAPI_KEY>", // Replace with your key
            },
          }
        );

        const { stdout, stderr, compile_output } = response.data;
        setOutput(stdout || stderr || compile_output || "No output");
      }
    } catch (err) {
      console.error(err);
      setOutput("Error running code. Try again later.");
      setSnackbarMsg("⚠ Error running code!");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        width: "100%",
        height: "80vh",
        p: 2,
      }}
    >
      {/* Code Editor */}
      <Paper
        sx={{
          flex: 1,
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Code Editor</Typography>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
          >
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
        </Box>
        <Box sx={{ flex: 1 }}>
          <CodeMirror
            value={code}
            options={{
              mode: modeMap[language],
              theme: "material",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => setCode(value)}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
          onClick={handleRun}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Run Code"}
        </Button>
      </Paper>

      {/* Output Panel */}
      <Paper
        sx={{
          flex: 0.5,
          p: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Output
        </Typography>
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1e1e1e",
            color: "#00ff00",
            p: 1,
            borderRadius: 1,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        >
          {output}
        </Box>
      </Paper>

      {/* Snackbar for errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
