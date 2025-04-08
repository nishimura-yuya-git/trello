import React from 'react'
import Board from './components/Board/Board'

const initialLists = [
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
]

function App() {
  return <Board initialLists={initialLists} />
}

export default App
