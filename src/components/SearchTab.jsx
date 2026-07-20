import React, { useState } from 'react';

const SearchTab = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') {
      handleClear();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError('');
    setIsSearchTriggered(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setIsSearchTriggered(true);

    try {
      const response = await fetch(`https://aquilon-antique.ru/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Ошибка сервера');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Не удалось связаться с бэкенд-сервером Spring Boot.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-100" style={{ maxWidth: '900px' }}>
      {/* Главная карточка поиска */}
      <form onSubmit={handleSearch} className="card p-4 p-md-5 shadow border-0 rounded-3 bg-white mb-5">
        <h2 className="mb-2 text-dark fw-bold text-center text-md-start">Поиск в архивных базах</h2>
        <p className="text-muted mb-4 text-center text-md-start">
          Введите номер Георгиевского креста или фамилию кавалера для проверки по реестру.
        </p>
        
        <div className="input-group input-group-lg position-relative">
          <input
            type="text"
            className="form-control bg-light border-secondary-subtle pe-5"
            placeholder="Например: 231440 или Симков..."
            value={query}
            onChange={handleInputChange}
            style={{ borderRadius: '0.5rem 0 0 0.5rem', fontSize: '1.1rem' }}
          />
          
          {/* Исправленная кнопка сброса (крестик) */}
          {query && (
            <button
              type="button"
              className="btn position-absolute border-0 text-secondary p-0 d-flex align-items-center justify-content-center"
              onClick={handleClear}
              style={{ 
                right: '130px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                zIndex: 10, 
                width: '32px', 
                height: '32px',
                background: 'transparent' 
              }}
            >
              &#x2715;
            </button>
          )}
          
          <button type="submit" className="btn btn-success px-4 fw-bold shadow-sm d-flex align-items-center" style={{ borderRadius: '0 0.5rem 0.5rem 0' }}>
            {/* SVG иконка лупы вместо Bootstrap-icons */}
            <svg className="me-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Искать
          </button>
        </div>
      </form>

      {/* Лоадер */}
      {loading && (
        <div className="text-center my-5 py-4">
          <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3 text-muted fw-medium">Подключаемся к архивам Георгиевского реестра...</p>
        </div>
      )}

      {/* Ошибки */}
      {error && <div className="alert alert-danger shadow-sm border-0 rounded-3 p-3 text-center fw-medium">{error}</div>}

      {/* Ничего не найдено */}
      {!loading && !error && isSearchTriggered && results.length === 0 && (
        <div className="alert alert-warning shadow-sm border-0 rounded-3 p-4 text-center">
          <h5 className="fw-bold text-warning-emphasis mb-1">Записей не найдено</h5>
          <span className="text-muted small">Убедитесь в правильности ввода номера или попробуйте изменить фамилию кавалера.</span>
        </div>
      )}

      {/* Архивные карточки вывода результатов */}
      <div className="row">
        {results.map((el) => (
          <div key={el.id} className="col-12 mb-4">
            <div 
              className="card shadow-sm border-start border-success border-4 p-4 bg-white rounded-3 position-relative overflow-hidden"
              style={{ 
                backgroundColor: '#fdfbf7', // Легкий благородный кремовый оттенок под архивную бумагу
                borderLeftWidth: '5px !important'
              }}
            >
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3">
                <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-2 mb-2 mb-sm-0" style={{ fontSize: '0.9rem' }}>
                   Георгиевский крест № {el.number}
                </span>
           
              </div>
              <h4 className="fw-bold text-dark mb-3" style={{ fontFamily: 'Georgia, serif' }}>{el.name}</h4>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.7', fontSize: '1rem', textAlign: 'justify' }}>
                {el.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTab;
