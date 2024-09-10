export function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 px-3 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-xl">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Data</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Upload your CSV or XLSX file to visualize the data.</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">CSV or XLSX (MAX. 10MB)</p>
                </div>
                <input id="file" type="file" className="hidden" accept=".csv,.xlsx" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}