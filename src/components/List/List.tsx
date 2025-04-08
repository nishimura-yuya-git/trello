import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Plus, Trash2 } from 'lucide-react'
import Card from '../Card/Card'

interface CardType {
  id: string
  content: string
}

interface ListProps {
  id: string
  title: string
  cards: CardType[]
  onDeleteList: (listId: string) => void
  onAddCard: (listId: string) => void
  onDeleteCard: (listId: string, cardId: string) => void
  onEditCard: (listId: string, cardId: string) => void
  addingCardToList: string | null
  newCardContent: string
  onNewCardContentChange: (content: string) => void
  onSaveNewCard: (listId: string) => void
  onCancelAddCard: () => void
  editingCard: { listId: string; cardId: string } | null
  editCardContent: string
  onEditCardContentChange: (content: string) => void
  onSaveCardEdit: () => void
  onCancelCardEdit: () => void
}

const List = ({
  id,
  title,
  cards,
  onDeleteList,
  onAddCard,
  onDeleteCard,
  onEditCard,
  addingCardToList,
  newCardContent,
  onNewCardContentChange,
  onSaveNewCard,
  onCancelAddCard,
  editingCard,
  editCardContent,
  onEditCardContentChange,
  onSaveCardEdit,
  onCancelCardEdit
}: ListProps) => {
  return (
    <div className="bg-gray-200 rounded-md shadow-md w-72 flex-shrink-0">
      <div className="p-2 font-bold bg-gray-300 rounded-t-md flex justify-between items-center">
        <span>{title}</span>
        <button
          className="text-gray-600 hover:text-red-500"
          onClick={() => onDeleteList(id)}
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-2 min-h-[200px]"
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                id={card.id}
                index={index}
                content={card.content}
                listId={id}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                isEditing={editingCard?.listId === id && editingCard?.cardId === card.id}
                editContent={editCardContent}
                onEditContentChange={onEditCardContentChange}
                onSaveEdit={onSaveCardEdit}
                onCancelEdit={onCancelCardEdit}
              />
            ))}
            {provided.placeholder}
            
            {addingCardToList === id ? (
              <div className="mt-2">
                <textarea
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="カードの内容を入力..."
                  value={newCardContent}
                  onChange={(e) => onNewCardContentChange(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    onClick={() => onSaveNewCard(id)}
                  >
                    追加
                  </button>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
                    onClick={onCancelAddCard}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-300 rounded-md mt-2"
                onClick={() => onAddCard(id)}
              >
                <Plus size={16} className="mr-1" />
                <span>カードを追加</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default List
