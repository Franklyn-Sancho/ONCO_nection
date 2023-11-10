import { Link } from 'react-router-dom';

interface NavigationDotsProps {
  currentPage: number;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ currentPage }) => {
  return (
    <div className="flex space-x-2">
      <Link to="/">
        <div className={`h-2 w-2 bg-gray-400 rounded-full inline-block ${currentPage === 1 ? 'bg-gray-800' : ''}`}></div>
      </Link>
      <Link to="/2">
        <div className={`h-2 w-2 bg-gray-400 rounded-full inline-block ${currentPage === 2 ? 'bg-gray-800' : ''}`}></div>
      </Link>
      <Link to="/3">
        <div className={`h-2 w-2 bg-gray-400 rounded-full inline-block ${currentPage === 3 ? 'bg-gray-800' : ''}`}></div>
      </Link>
      <Link to="/4">
        <div className={`h-2 w-2 bg-gray-400 rounded-full inline-block ${currentPage === 4 ? 'bg-gray-800' : ''}`}></div>
      </Link>
    </div>
  );
};

export default NavigationDots;

