
import { useState } from 'react';

export default function SearchBox() {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchToggle = (event) => {
    const container = event.currentTarget.closest('.search-wrapper');
    setIsActive(!isActive);

    if (!isActive) {
      event.preventDefault();

      setTimeout(() => {
        container.querySelector('.search-input').focus();
      }, 300);
    } else {
      setSearchTerm('');
    }
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={`search-wrapper  ${isActive ? 'active' : ''}`}>
      <div className="input-holder">
        <input
          type="text"
          className="search-input "
          placeholder="Type to search"
          value={searchTerm}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-icon" onClick={handleSearchToggle}>
          <span></span>
        </button>
        <div className="close" onClick={handleSearchToggle}>
          <div className="close-icon"></div>
        </div>
      </div>
    </div>
  );
}