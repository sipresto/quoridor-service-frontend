import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QuoridorPage } from "./features/quoridor/pages/QuoridorPage";
import SecurityContextProvider from "./features/quoridor/context/SecurityContextProvider";
import { RouteGuard } from "./features/quoridor/components/RouteGuard.tsx";

const queryClient = new QueryClient();
const theme = createTheme();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <SecurityContextProvider>
                    <BrowserRouter basename="/games/quoridor">
                        <Routes>
                            {/* Use RouteGuard as a wrapper component */}
                            <Route path="/:id" element={
                                <RouteGuard>
                                    <QuoridorPage />
                                </RouteGuard>
                            }/>
                            <Route path="/" element={
                                <RouteGuard>
                                    <QuoridorPage />
                                </RouteGuard>
                            }/>
                        </Routes>
                    </BrowserRouter>
                </SecurityContextProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;