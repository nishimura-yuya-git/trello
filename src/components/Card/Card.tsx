import React, { useRef } from 'react'
import { Edit, Trash2 } from 'lucide-react'

interface CardProps {
  id: string
  index: number
  content: string
  listId: string
  onEdit: (listId: string, cardId: string) => void
  onDelete: (listId: string, cardId: string) => void
  isEditing: boolean
  editContent: string
  onEditContentChange: (content: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDragStart: (e: React.DragEvent, cardId: string, listId: string) => void
}

const Card: React.FC<CardProps> = ({
  id,
  index,
  content,
  listId,
  onEdit,
  onDelete,
  isEditing,
  editContent,
  onEditContentChange,
  onSaveEdit,
  onCancelEdit,
  onDragStart
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={(e) => onDragStart(e, id, listId)}
      className="bg-white p-3 rounded-md shadow mb-2 hover:bg-gray-50 cursor-grab"
      data-card-id={id}
      data-list-id={listId}
    >
      {isEditing ? (
        <div>
          <textarea
            className="w-full p-2 border rounded-md mb-2"
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            rows={2}
            autoFocus
          />
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600"
              onClick={onSaveEdit}
            >
              保存
            </button>
            <button
              className="bg-gray-300 px-2 py-1 rounded-md text-xs hover:bg-gray-400"
              onClick={onCancelEdit}
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between">
            <span>{content}</span>
            <div className="flex space-x-1">
              <button
                className="text-gray-500 hover:text-blue-500"
                onClick={() => onEdit(listId, id)}
              >
                <Edit size={14} />
              </button>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => onDelete(listId, id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
