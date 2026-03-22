export default function LoadingSpinner({ large = false }: { large?: boolean }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className={`border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin ${large ? 'w-12 h-12 border-4' : 'w-5 h-5'}`}
      />
    </div>
  );
}
