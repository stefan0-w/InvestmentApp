import React, { useState, useEffect } from 'react';
import '../styles/Resources.css';
import { RESOURCES } from '../data/learningResources'; 

const Resources = () => {
  // We don't need API loading state anymore since we have constant RESOURCES
  const [filteredResources, setFilteredResources] = useState(RESOURCES);
  
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  // Filtering Logic
  useEffect(() => {
    let result = RESOURCES;

    if (selectedType !== 'ALL') {
      result = result.filter(r => r.type === selectedType);
    }

    if (selectedDifficulty !== 'ALL') {
      result = result.filter(r => r.difficulty === selectedDifficulty);
    }

    setFilteredResources(result);
  }, [selectedType, selectedDifficulty]);

  return (
    <div className="resources-container">
      <h2 className='page-header'>Knowledge Base</h2>
      
      {/* Full Filter Bar Implementation */}
      <div className="filters-bar">
        
        {/* Type Filter */}
        <div className="filter-group">
          <label htmlFor="type-select">Type:</label>
          <select 
            id="type-select" 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            {/* Make sure these values match exactly what you have in your RESOURCES data */}
            <option value="YOUTUBE">Youtube chanel</option>
            <option value="BOOK">Book</option>
            <option value="WEBSITE">Webstie</option>
            <option value="TOOL">Tool</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="filter-group">
          <label htmlFor="difficulty-select">Difficulty:</label>
          <select 
            id="difficulty-select" 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="ALL">All Levels</option>
            {/* Make sure these values match exactly what you have in your RESOURCES data */}
            <option value="EASY">Beginner</option>
            <option value="MEDIUM">Intermediate</option>
            <option value="HARD">Advanced</option>
          </select>
        </div>

      </div>

      <div className="resources-grid">
        {filteredResources.map(res => (
          <div key={res.id} className="resource-card">
            
            {res.image && (
              <img src={res.image} alt={res.title} className="resource-img" />
            )}

            
            <h3>{res.title}</h3>
            <div className="meta-row">
              <div className={`badge ${(res.difficulty.toLowerCase())}`}>
                {res.difficulty}
              </div>
              <div className="type-label">
                {res.type}
              </div>
            </div>
            <p className="description">{res.description}</p>
            
            <a 
              href={res.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-visit"
            >
              Open Resource
            </a>
          </div>
        ))}

        {/* Fallback if no results found */}
        {filteredResources.length === 0 && (
          <div className="no-results">
            <p>No resources found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;