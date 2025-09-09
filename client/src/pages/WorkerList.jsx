import { mockWorkers } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const WorkerList = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockWorkers.map(worker => (
        <div
          key={worker.id}
          className="cursor-pointer p-4 border rounded hover:bg-gray-100"
          onClick={() => navigate(`/worker/${worker._id}`)}
        >
          <img
            src={worker.profilePicture}
            alt={worker.name}
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
          <h3 className="font-semibold">{worker.name}</h3>
          <p className="text-sm text-muted-foreground">{worker.profession}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkerList;
