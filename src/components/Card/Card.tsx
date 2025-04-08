import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
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
}

const Card = ({
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
  onCancelEdit
}: CardProps) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-3 rounded-md shadow mb-2 hover:bg-gray-50"
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
      )}
    </Draggable>
  )
}

export default Card
