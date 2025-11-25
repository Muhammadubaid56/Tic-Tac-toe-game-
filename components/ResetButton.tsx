interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <button
      onClick={onReset}
      className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-lg"
    >
      Reset Game
    </button>
  );
}

