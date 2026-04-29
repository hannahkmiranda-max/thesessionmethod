export default function ReturnPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Success! 🎉</h1>
      <p className="text-lg mb-8">Thank you for your purchase. Click below to get your PDF.</p>
      
      {/* This assumes you put your file in the 'public' folder and named it 'product.pdf' */}
      <a 
        href="/product.pdf" 
        download 
        className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition"
      >
        Download My PDF
      </a>
      
      <p className="mt-4 text-sm text-gray-500">
        If the download doesn't start, right-click the button and "Save Link As."
      </p>
    </div>
  )
}