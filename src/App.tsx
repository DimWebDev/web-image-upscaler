function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Web Image Upscaler
        </h1>
        <p className="text-gray-600 mb-4">
          Privacy-first, client-side image enhancement
        </p>
        <div className="text-sm text-green-600">
          ✅ Development environment setup complete
        </div>
        <div className="text-sm text-blue-600 mt-2">
          Cross-origin isolated: {self.crossOriginIsolated ? '✅' : '❌'}
        </div>
      </div>
    </div>
  )
}

export default App
