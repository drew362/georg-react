import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchTab from './components/SearchTab';
import ShopTab from './components/ShopTab'; 
import { BuybackTab, ContactsTab } from './components/OtherTabs'; 
import ProductDetail from './components/ProductDetail';
import AdminPanel from './components/AdminPanel';


function App() {
  return (
    <BrowserRouter>
      {/* Добавлен класс минимальной высоты и правильные отступы */}
      <div className="min-vh-100 d-flex flex-column" style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif', backgroundColor: '#f4f6f8' }}>
        <Header />

        {/* Убрали лишний container-fluid, чтобы не ломать выравнивание карточки */}
        <main className="flex-grow-1 py-5 px-3 px-md-4">
          <Routes>
            <Route path="/" element={<SearchTab />} />
            <Route path="/shop" element={<ShopTab />} />
            <Route path="/shop/:id" element={<ProductDetail />} /> 
            <Route path="/buyback" element={<BuybackTab />} />
            <Route path="/contacts" element={<ContactsTab />} />
            <Route path="/admin-drew-panel" element={<AdminPanel />} />
            <Route path="*" element={<div className="text-center py-5"><h3>Страница не найдена (404)</h3></div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;


