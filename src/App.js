import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Countries from './pages/Countries';
import Teams from './pages/Teams';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/countries" replace />} />
          <Route path="countries" element={<Countries />} />
          <Route path="teams" element={<Teams />} />
        </Route>
        <Route path="*" element={<Navigate to="/countries" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
