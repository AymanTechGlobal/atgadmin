import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";

// ... rest of your imports

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your existing app content */}
    </ThemeProvider>
  );
}

export default App;
