import React from 'react';
import onFilter from '../App';

export default function FilterByCategory({ onFilter }) {
  const handleFilter = (category) => {
    onFilter(category);
  };
  return (
    <div>
      <button onClick={() => handleFilter('')}>Todos</button>
      <button onClick={() => handleFilter('Mochilas y bolsos')}>Mochilas y bolsos</button>
      <button onClick={() => handleFilter('Documentos')}>Documentos</button>
      <button onClick={() => handleFilter('Tecnología')}>Tecnología</button>
      <button onClick={() => handleFilter('Útiles')}>Útiles</button>
      <button onClick={() => handleFilter('Otros')}>Otros</button>
    </div>
  );
}