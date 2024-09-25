import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ Element }) => {
    const user = useSelector(state => state.login?.User);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in, render the component
    return Element;
};

export default ProtectedRoute;
