interface StudentApplicationPopupProps {
    onClose: () => void;
}

const StudentApplicationPopup: React.FC<StudentApplicationPopupProps> = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)]">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative">
            <button
                onClick={onClose}
                className="absolute right-3 top-3 text-gray-500 hover:text-red-500"
            >
                X
            </button>

            <h3 className="text-2xl font-bold text-green-600 mb-4">Application Ready!</h3>

            <p className="text-gray-700">
                You are authorized as a Student. Click below to begin your formal application.
            </p>

            <button
                onClick={onClose}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
            >
                Start Application
            </button>
        </div>
    </div>
);

export default StudentApplicationPopup;
