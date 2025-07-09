import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { taskService } from '../../services/api';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: tasksData, isLoading } = useQuery(
    ['calendar-tasks', year, month],
    () => taskService.getCalendar(year, month),
    {
      select: (response) => response.data.tasks || [],
    }
  );

  const tasks = tasksData || [];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const getDaysInMonth = () => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getTasksForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return tasks.filter(task => 
      task.dueDate && task.dueDate.startsWith(dateStr)
    );
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  return (
    <div className="p-6">
      <div className="card">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Kalender</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 min-w-[180px] text-center">
              {monthNames[month - 1]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Day headers */}
          {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isToday = day && 
              new Date().getDate() === day &&
              new Date().getMonth() === month - 1 &&
              new Date().getFullYear() === year;

            return (
              <div 
                key={index} 
                className={`calendar-day ${isToday ? 'calendar-day-today' : ''} ${!day ? 'calendar-day-other-month' : ''}`}
              >
                {day && (
                  <>
                    <div className="font-medium text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id} 
                          className="calendar-event"
                          style={{ backgroundColor: task.workspace?.color || '#3B82F6' }}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayTasks.length - 3} weitere
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="spinner w-8 h-8"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;