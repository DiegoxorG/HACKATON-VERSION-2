import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NoteEditor({ clientId }) {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(false)

  const noteKey = `finia_notes_${clientId}`

  useEffect(() => {
    const saved = localStorage.getItem(noteKey)
    if (saved) setNotes(JSON.parse(saved))
  }, [clientId, noteKey])

  const saveNote = () => {
    if (!newNote.trim()) return
    
    const note = {
      id: Date.now(),
      text: newNote,
      createdAt: new Date().toISOString()
    }
    
    const updated = [note, ...notes]
    setNotes(updated)
    localStorage.setItem(noteKey, JSON.stringify(updated))
    setNewNote('')
  }

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id)
    setNotes(updated)
    localStorage.setItem(noteKey, JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[#f1f5f9] mb-2">Añadir nota</label>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Escribe tus observaciones sobre este cliente..."
          className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-[#f1f5f9] placeholder-[#64748b] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a56db]"
          rows={3}
        />
        <button
          onClick={saveNote}
          disabled={!newNote.trim()}
          className="mt-2 px-4 py-2 bg-[#1a56db] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          Guardar nota
        </button>
      </div>

      {notes.length > 0 && (
        <div className="border-t border-[#334155] pt-4">
          <h3 className="text-sm font-semibold text-[#f1f5f9] mb-3">Notas anteriores</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="p-3 bg-[#0f172a] border border-[#334155] rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-[#f1f5f9]">{note.text}</p>
                    <p className="text-xs text-[#64748b] mt-2">
                      {new Date(note.createdAt).toLocaleString('es-CO')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-[#64748b] hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
