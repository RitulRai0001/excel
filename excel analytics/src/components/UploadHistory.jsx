import { useState } from 'react';

const UploadHistory = ({ history = [], onDeleteAll }) => {
  const [deleting, setDeleting] = useState(false);
  if (!history || history.length === 0) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Upload History</h2>
        {onDeleteAll && (
          <button
            className="px-3 py-1 bg-red-600 text-black rounded hover:bg-red-700 transition text-sm font-semibold"
            onClick={async () => {
              setDeleting(true);
              await onDeleteAll();
              setDeleting(false);
            }}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete History'}
          </button>
        )}
      </div>
      <p className="mb-2">Total files uploaded: <span className="font-semibold">{history.length}</span></p>
      <ul className="list-disc pl-6">
        {history.map((item, idx) => (
          <li key={item._id || idx} className="mb-1">
            <span className="font-semibold">{item.originalname}</span> - <span className="text-gray-500">{new Date(item.uploadDate).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadHistory;
