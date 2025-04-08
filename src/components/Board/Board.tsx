import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import List from '../List/List'

interface Card {
  id: string
  content: string
}

interface List {
  id: string
  title: string
  cards: Card[]
}

interface BoardProps {
  initialLists: List[]
}

const Board: React.FC<BoardProps> = ({ initialLists }) => {
  const [lists, setLists] = useState<List[]>(initialLists)
  const [addingCardToList, setAddingCardToList] = useState<string | null>(null)
  const [newCardContent, setNewCardContent] = useState('')
  const [addingList, setAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [editingCard, setEditingCard] = useState<{listId: string, cardId: string} | null>(null)
  const [editCardContent, setEditCardContent] = useState('')
  const [draggedItem, setDraggedItem] = useState<{cardId: string, listId: string} | null>(null)

  const handleDragStart = (e: React.DragEvent, cardId: string, listId: string) => {
    setDraggedItem({ cardId, listId })
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, listId }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault()
    
    if (!draggedItem) return
    
    const { cardId, listId: sourceListId } = draggedItem
    
    if (sourceListId === targetListId) return
    
    const sourceList = lists.find(list => list.id === sourceListId)
    const targetList = lists.find(list => list.id === targetListId)
    
    if (!sourceList || !targetList) return
    
    const card = sourceList.cards.find(card => card.id === cardId)
    if (!card) return
    
    const newLists = [...lists]
    const sourceListIndex = lists.findIndex(list => list.id === sourceListId)
    const targetListIndex = lists.findIndex(list => list.id === targetListId)
    
    newLists[sourceListIndex].cards = sourceList.cards.filter(card => card.id !== cardId)
    
    newLists[targetListIndex].cards.push(card)
    
    setLists(newLists)
    setDraggedItem(null)
  }

  const handleAddCard = (listId: string) => {
    setAddingCardToList(listId)
    setNewCardContent('')
  }

  const handleSaveNewCard = (listId: string) => {
    if (!newCardContent.trim()) return
    
    const newCardId = `card-${Date.now()}`
    const newCard = { id: newCardId, content: newCardContent }
    
    const updatedLists = [...lists]
    const listIndex = updatedLists.findIndex(list => list.id === listId)
    
    if (listIndex !== -1) {
      updatedLists[listIndex].cards.push(newCard)
      setLists(updatedLists)
      setNewCardContent('')
      setAddingCardToList(null)
    }
  }

  const handleCancelAddCard = () => {
    setAddingCardToList(null)
    setNewCardContent('')
  }

  const handleAddList = () => {
    setAddingList(true)
    setNewListTitle('')
  }

  const handleSaveNewList = () => {
    if (!newListTitle.trim()) return
    
    const newListId = `list-${Date.now()}`
    const newList = { id: newListId, title: newListTitle, cards: [] }
    
    setLists([...lists, newList])
    setNewListTitle('')
    setAddingList(false)
  }

  const handleCancelAddList = () => {
    setAddingList(false)
    setNewListTitle('')
  }
  
  const handleDeleteCard = (listId: string, cardId: string) => {
    const updatedLists = [...lists]
    const listIndex = updatedLists.findIndex(list => list.id === listId)
    
    if (listIndex !== -1) {
      updatedLists[listIndex].cards = updatedLists[listIndex].cards.filter(
        card => card.id !== cardId
      )
      setLists(updatedLists)
    }
  }
  
  const handleEditCard = (listId: string, cardId: string) => {
    const list = lists.find(list => list.id === listId)
    if (!list) return
    
    const card = list.cards.find(card => card.id === cardId)
    if (!card) return
    
    setEditingCard({ listId, cardId })
    setEditCardContent(card.content)
  }
  
  const handleSaveCardEdit = () => {
    if (!editingCard || !editCardContent.trim()) return
    
    const updatedLists = [...lists]
    const listIndex = updatedLists.findIndex(list => list.id === editingCard.listId)
    
    if (listIndex !== -1) {
      const cardIndex = updatedLists[listIndex].cards.findIndex(
        card => card.id === editingCard.cardId
      )
      
      if (cardIndex !== -1) {
        updatedLists[listIndex].cards[cardIndex].content = editCardContent
        setLists(updatedLists)
        setEditingCard(null)
        setEditCardContent('')
      }
    }
  }
  
  const handleCancelCardEdit = () => {
    setEditingCard(null)
    setEditCardContent('')
  }
  
  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Trello風タスク管理</h1>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <List
            key={list.id}
            id={list.id}
            title={list.title}
            cards={list.cards}
            onDeleteList={handleDeleteList}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onEditCard={handleEditCard}
            addingCardToList={addingCardToList}
            newCardContent={newCardContent}
            onNewCardContentChange={setNewCardContent}
            onSaveNewCard={handleSaveNewCard}
            onCancelAddCard={handleCancelAddCard}
            editingCard={editingCard}
            editCardContent={editCardContent}
            onEditCardContentChange={setEditCardContent}
            onSaveCardEdit={handleSaveCardEdit}
            onCancelCardEdit={handleCancelCardEdit}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
        
        {addingList ? (
          <div className="bg-gray-200 rounded-md shadow-md w-72 flex-shrink-0 p-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-2"
              placeholder="リストのタイトルを入力..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                onClick={handleSaveNewList}
              >
                リストを追加
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400 flex items-center"
                onClick={handleCancelAddList}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-md shadow-md w-72 flex-shrink-0 p-2 flex items-center justify-center"
            onClick={handleAddList}
          >
            <Plus size={16} className="mr-1" />
            <span>リストを追加</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Board
