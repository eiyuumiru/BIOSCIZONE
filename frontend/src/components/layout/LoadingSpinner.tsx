import { type FC } from 'react';
import { BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    message?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
    fullScreen = true,
    message = "Đang tải..."
}) => {
    const containerClasses = fullScreen
        ? "min-h-screen flex items-center justify-center bg-[#EDEDED]"
        : "flex items-center justify-center py-20 w-full";

    return (
        <div className={containerClasses}>
            <div className="text-center">
                <BookOpen className="w-12 h-12 text-[#0099FF] mx-auto mb-4" />
                <p className="text-gray-500 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
