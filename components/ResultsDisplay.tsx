import React from 'react';

interface ResultsDisplayProps {
    results: number[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    return (
        <div>
            <h2>Calculation Results</h2>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>Result {index + 1}: {result}</li>
                ))}
            </ul>
        </div>
    );
};

export default ResultsDisplay;