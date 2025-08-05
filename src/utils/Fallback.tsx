export const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
  return (
    <div>
      <h1>Что-то пошло не так</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Попробовать снова</button>
    </div>
  )
}