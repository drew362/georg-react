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
      <div className="min-vh-100 d-flex flex-column" style={{ fontFamily: 'Segoe UI, -apple-system, sans-serif', backgroundColor: '#f4f6f8' }}> 
        <Header /> 

        <main className="flex-grow-1 py-5 px-3 px-md-5 mx-auto" style={{ maxWidth: '1400px', width: '100%' }} > 
          <Routes> 
            <Route path="/" element={<SearchTab />} /> 
            <Route path="/shop" element={<ShopTab />} /> 
            

            <Route path="/shop/:slug" element={<ProductDetail />} /> 
            
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
