import { Link } from "react-router-dom";
export default function NotFound() {
    return (
        <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">404 - Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            <Link to="/" className="text-blue-600 underline">Go home</Link>
        </div>
    )
}