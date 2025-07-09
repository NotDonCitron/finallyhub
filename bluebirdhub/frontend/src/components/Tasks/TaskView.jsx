import React from 'react';
import { useQuery } from 'react-query';
import { taskService } from '../../services/api';

const TaskView = () => {
  const { data: tasksData, isLoading } = useQuery(
    'tasks',
    () => taskService.getAll(),
    {
      select: (response) => response.data.tasks || [],
    }
  );

  const tasks = tasksData || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Aufgaben</h1>
        <button className="btn-primary">
          Neue Aufgabe
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`badge status-${task.status}`}>
                      {task.status}
                    </span>
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                {task.dueDate && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Fällig</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(task.dueDate).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Keine Aufgaben vorhanden</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskView;