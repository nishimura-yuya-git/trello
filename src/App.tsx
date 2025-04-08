import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Plus, X, Trash2, Edit } from 'lucide-react'

interface Card {
  id: string
  content: string
}

interface List {
  id: string
  title: string
  cards: Card[]
}

interface Board {
  lists: List[]
}

function App() {
  const [board, setBoard] = useState<Board>({
    lists: [
      {
        id: 'list-1',
        title: '未着手',
        cards: [
          { id: 'card-1', content: 'タスク1' },
          { id: 'card-2', content: 'タスク2' },
          { id: 'card-3', content: 'タスク3' },
        ],
      },
      {
        id: 'list-2',
        title: '進行中',
        cards: [
          { id: 'card-4', content: 'タスク4' },
          { id: 'card-5', content: 'タスク5' },
        ],
      },
      {
        id: 'list-3',
        title: '完了',
        cards: [
          { id: 'card-6', content: 'タスク6' },
        ],
      },
    ],
  })

  const [addingCardToList, setAddingCardToList] = useState<string | null>(null)
  const [newCardContent, setNewCardContent] = useState('')
  const [addingList, setAddingList] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')
  const [editingCard, setEditingCard] = useState<{listId: string, cardId: string} | null>(null)
  const [editCardContent, setEditCardContent] = useState('')

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceList = board.lists.find(list => list.id === source.droppableId)
    const destList = board.lists.find(list => list.id === destination.droppableId)

    if (!sourceList || !destList) return

    const newBoard = { ...board }
    const sourceBoardIndex = board.lists.findIndex(list => list.id === source.droppableId)
    const destBoardIndex = board.lists.findIndex(list => list.id === destination.droppableId)

    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(sourceList.cards)
      const [removed] = newCards.splice(source.index, 1)
      newCards.splice(destination.index, 0, removed)

      newBoard.lists[sourceBoardIndex].cards = newCards
    } else {
      const sourceCards = Array.from(sourceList.cards)
      const destCards = Array.from(destList.cards)
      const [removed] = sourceCards.splice(source.index, 1)
      destCards.splice(destination.index, 0, removed)

      newBoard.lists[sourceBoardIndex].cards = sourceCards
      newBoard.lists[destBoardIndex].cards = destCards
    }

    setBoard(newBoard)
  }

  const handleAddCard = (listId: string) => {
    if (!newCardContent.trim()) return
    
    const newCardId = `card-${Date.now()}`
    const newCard = { id: newCardId, content: newCardContent }
    
    const updatedBoard = { ...board }
    const listIndex = updatedBoard.lists.findIndex(list => list.id === listId)
    
    if (listIndex !== -1) {
      updatedBoard.lists[listIndex].cards.push(newCard)
      setBoard(updatedBoard)
      setNewCardContent('')
      setAddingCardToList(null)
    }
  }

  const handleAddList = () => {
    if (!newListTitle.trim()) return
    
    const newListId = `list-${Date.now()}`
    const newList = { id: newListId, title: newListTitle, cards: [] }
    
    setBoard({
      ...board,
      lists: [...board.lists, newList]
    })
    
    setNewListTitle('')
    setAddingList(false)
  }
  
  const handleDeleteCard = (listId: string, cardId: string) => {
    const updatedBoard = { ...board }
    const listIndex = updatedBoard.lists.findIndex(list => list.id === listId)
    
    if (listIndex !== -1) {
      updatedBoard.lists[listIndex].cards = updatedBoard.lists[listIndex].cards.filter(
        card => card.id !== cardId
      )
      setBoard(updatedBoard)
    }
  }
  
  const handleEditCard = (listId: string, cardId: string) => {
    const list = board.lists.find(list => list.id === listId)
    if (!list) return
    
    const card = list.cards.find(card => card.id === cardId)
    if (!card) return
    
    setEditingCard({ listId, cardId })
    setEditCardContent(card.content)
  }
  
  const handleSaveCardEdit = () => {
    if (!editingCard || !editCardContent.trim()) return
    
    const updatedBoard = { ...board }
    const listIndex = updatedBoard.lists.findIndex(list => list.id === editingCard.listId)
    
    if (listIndex !== -1) {
      const cardIndex = updatedBoard.lists[listIndex].cards.findIndex(
        card => card.id === editingCard.cardId
      )
      
      if (cardIndex !== -1) {
        updatedBoard.lists[listIndex].cards[cardIndex].content = editCardContent
        setBoard(updatedBoard)
        setEditingCard(null)
        setEditCardContent('')
      }
    }
  }
  
  const handleDeleteList = (listId: string) => {
    setBoard({
      ...board,
      lists: board.lists.filter(list => list.id !== listId)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Trello風タスク管理</h1>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {board.lists.map((list) => (
            <div 
              key={list.id} 
              className="bg-gray-200 rounded-md shadow-md w-72 flex-shrink-0"
            >
              <div className="p-2 font-bold bg-gray-300 rounded-t-md flex justify-between items-center">
                <span>{list.title}</span>
                <button
                  className="text-gray-600 hover:text-red-500"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <Droppable droppableId={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="p-2 min-h-[200px]"
                  >
                    {list.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 rounded-md shadow mb-2 hover:bg-gray-50"
                          >
                            {editingCard && editingCard.cardId === card.id ? (
                              <div>
                                <textarea
                                  className="w-full p-2 border rounded-md mb-2"
                                  value={editCardContent}
                                  onChange={(e) => setEditCardContent(e.target.value)}
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex space-x-2">
                                  <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-600"
                                    onClick={handleSaveCardEdit}
                                  >
                                    保存
                                  </button>
                                  <button
                                    className="bg-gray-300 px-2 py-1 rounded-md text-xs hover:bg-gray-400"
                                    onClick={() => {
                                      setEditingCard(null)
                                      setEditCardContent('')
                                    }}
                                  >
                                    キャンセル
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex justify-between">
                                  <span>{card.content}</span>
                                  <div className="flex space-x-1">
                                    <button
                                      className="text-gray-500 hover:text-blue-500"
                                      onClick={() => handleEditCard(list.id, card.id)}
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      className="text-gray-500 hover:text-red-500"
                                      onClick={() => handleDeleteCard(list.id, card.id)}
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
                    ))}
                    {provided.placeholder}
                    
                    {addingCardToList === list.id ? (
                      <div className="mt-2">
                        <textarea
                          className="w-full p-2 border rounded-md mb-2"
                          placeholder="カードの内容を入力..."
                          value={newCardContent}
                          onChange={(e) => setNewCardContent(e.target.value)}
                          rows={3}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                            onClick={() => handleAddCard(list.id)}
                          >
                            追加
                          </button>
                          <button
                            className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
                            onClick={() => {
                              setAddingCardToList(null)
                              setNewCardContent('')
                            }}
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-300 rounded-md mt-2"
                        onClick={() => setAddingCardToList(list.id)}
                      >
                        <Plus size={16} className="mr-1" />
                        <span>カードを追加</span>
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
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
                  onClick={handleAddList}
                >
                  リストを追加
                </button>
                <button
                  className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400 flex items-center"
                  onClick={() => {
                    setAddingList(false)
                    setNewListTitle('')
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded-md shadow-md w-72 flex-shrink-0 p-2 flex items-center justify-center"
              onClick={() => setAddingList(true)}
            >
              <Plus size={16} className="mr-1" />
              <span>リストを追加</span>
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App
