import React, { useEffect, ReactNode } from 'react';
import { DragDropContext as BeautifulDndContext, DropResult } from 'react-beautiful-dnd';

interface DragDropContextProps {
  children: ReactNode;
  onDragEnd: (result: DropResult) => void;
}

const DragDropContext: React.FC<DragDropContextProps> = ({ children, onDragEnd }) => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message === 'ResizeObserver loop completed with undelivered notifications.') {
        event.stopImmediatePropagation();
      }
    };
    
    window.addEventListener('error', handleError as EventListener);
    
    return () => {
      window.removeEventListener('error', handleError as EventListener);
    };
  }, []);

  return (
    <BeautifulDndContext onDragEnd={onDragEnd}>
      {children}
    </BeautifulDndContext>
  );
};

export default DragDropContext;
