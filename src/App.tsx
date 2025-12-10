import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QuoridorPage } from "./features/quoridor/pages/QuoridorPage"

const queryClient = new QueryClient();
const theme = createTheme();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter basename="/games/quoridor">
                    <Routes>
                        <Route path="/:id" element={<QuoridorPage/>}/>
                        <Route path="/" element={<QuoridorPage/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
export default App;
