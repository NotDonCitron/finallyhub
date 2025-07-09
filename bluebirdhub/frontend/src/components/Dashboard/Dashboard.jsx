import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  Users,
  TrendingUp 
} from 'lucide-react';
import { workspaceService, taskService } from '../../services/api';

const Dashboard = () => {
  const { data: workspacesData, isLoading: workspacesLoading } = useQuery(
    'workspaces',
    () => workspaceService.getAll(),
    {
      select: (response) => response.data.workspaces,
    }
  );

  const { data: recentTasks, isLoading: tasksLoading } = useQuery(
    'recent-tasks',
    () => taskService.getAll({ limit: 5 }),
    {
      select: (response) => response.data.tasks?.slice(0, 5) || [],
    }
  );

  const workspaces = workspacesData || [];
  const tasks = recentTasks || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Willkommen zurück! Hier ist eine Übersicht Ihrer Projekte und Aufgaben.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Workspaces</p>
              <p className="text-2xl font-bold text-gray-900">
                {workspacesLoading ? '...' : workspaces.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aufgaben</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasksLoading ? '...' : tasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Bearbeitung</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasksLoading ? '...' : tasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abgeschlossen</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasksLoading ? '...' : tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Workspaces */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Meine Workspaces</h2>
            <Link 
              to="/workspace/new" 
              className="btn-primary text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neu erstellen
            </Link>
          </div>

          {workspacesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Noch keine Workspaces vorhanden</p>
              <Link to="/workspace/new" className="btn-primary">
                Ersten Workspace erstellen
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {workspaces.slice(0, 5).map((workspace) => (
                <Link
                  key={workspace.id}
                  to={`/workspace/${workspace.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: workspace.color }}
                    ></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{workspace.name}</h3>
                      <p className="text-sm text-gray-500">
                        {workspace.tasks?.length || 0} Aufgaben
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {workspaces.length > 5 && (
                <Link 
                  to="/workspaces" 
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Alle {workspaces.length} Workspaces anzeigen
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Aktuelle Aufgaben</h2>
            <Link 
              to="/tasks" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Alle anzeigen
            </Link>
          </div>

          {tasksLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Noch keine Aufgaben vorhanden</p>
              <Link to="/tasks" className="btn-primary">
                Erste Aufgabe erstellen
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`badge status-${task.status}`}>
                          {task.status === 'open' && 'Offen'}
                          {task.status === 'in_progress' && 'In Bearbeitung'}
                          {task.status === 'completed' && 'Abgeschlossen'}
                          {task.status === 'cancelled' && 'Abgebrochen'}
                        </span>
                        <span className={`badge priority-${task.priority}`}>
                          {task.priority === 'low' && 'Niedrig'}
                          {task.priority === 'medium' && 'Mittel'}
                          {task.priority === 'high' && 'Hoch'}
                          {task.priority === 'urgent' && 'Dringend'}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;