import { useState } from 'react';

const CalculatorForm = () => {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [result, setResult] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sum = parseFloat(num1) + parseFloat(num2);
        setResult(`Result: ${sum}`);
    };

    return (
        <div>
            <h1>Calculator</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="number" 
                    value={num1} 
                    onChange={(e) => setNum1(e.target.value)} 
                    placeholder="First Number" 
                    required
                />
                <input 
                    type="number" 
                    value={num2} 
                    onChange={(e) => setNum2(e.target.value)} 
                    placeholder="Second Number" 
                    required
                />
                <button type="submit">Calculate</button>
            </form>
            <p>{result}</p>
        </div>
    );
};

export default CalculatorForm;