import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Mic, Plus, Euro, TrendingUp, TrendingDown, MicOff, Trash2, Edit, Calendar, Home } from 'lucide-react'
import './App.css'

// Local Storage utilities
const STORAGE_KEY = 'kassabot_entries'

const loadEntries = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading entries:', error)
    return []
  }
}

const saveEntries = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('Error saving entries:', error)
  }
}

// Date utilities
const isToday = (dateString) => {
  const today = new Date().toLocaleDateString('de-DE')
  return dateString === today
}

const isThisWeek = (dateString) => {
  const entryDate = new Date(dateString.split('.').reverse().join('-'))
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() - today.getDay() + 7)
  endOfWeek.setHours(23, 59, 59, 999)
  
  return entryDate >= startOfWeek && entryDate <= endOfWeek
}

const isThisMonth = (dateString) => {
  const entryDate = new Date(dateString.split('.').reverse().join('-'))
  const today = new Date()
  return entryDate.getMonth() === today.getMonth() && entryDate.getFullYear() === today.getFullYear()
}

const isThisYear = (dateString) => {
  const entryDate = new Date(dateString.split('.').reverse().join('-'))
  const today = new Date()
  return entryDate.getFullYear() === today.getFullYear()
}

const groupEntriesByPeriod = (entries, period) => {
  switch (period) {
    case 'today':
      return entries.filter(entry => isToday(entry.date))
    case 'week':
      return entries.filter(entry => isThisWeek(entry.date))
    case 'month':
      return entries.filter(entry => isThisMonth(entry.date))
    case 'year':
      return entries.filter(entry => isThisYear(entry.date))
    default:
      return entries
  }
}

const groupEntriesByDate = (entries) => {
  const grouped = {}
  entries.forEach(entry => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = []
    }
    grouped[entry.date].push(entry)
  })
  return grouped
}

// Navigation Component
function Navigation() {
  const location = useLocation()
  
  return (
    <div className="flex justify-center mb-6">
      <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <Link to="/">
          <Button 
            variant={location.pathname === '/' ? 'default' : 'ghost'}
            className={location.pathname === '/' ? 'bg-blue-500 text-white' : ''}
          >
            <Home className="h-4 w-4 mr-2" />
            Heute
          </Button>
        </Link>
        <Link to="/history">
          <Button 
            variant={location.pathname === '/history' ? 'default' : 'ghost'}
            className={location.pathname === '/history' ? 'bg-blue-500 text-white' : ''}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Verlauf
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Main Dashboard Component
function Dashboard() {
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [entries, setEntries] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  // Load entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = loadEntries()
    if (storedEntries.length === 0) {
      // Initialize with sample data if no stored entries
      const sampleEntries = [
        {
          id: 1,
          date: new Date().toLocaleDateString('de-DE'),
          type: 'income',
          amount: 40.00,
          description: 'Haarschnitt',
          time: '14:30'
        },
        {
          id: 2,
          date: new Date().toLocaleDateString('de-DE'),
          type: 'expense',
          amount: 12.00,
          description: 'Shampoo gekauft',
          time: '10:15'
        }
      ]
      setEntries(sampleEntries)
      saveEntries(sampleEntries)
    } else {
      setEntries(storedEntries)
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      saveEntries(entries)
    }
  }, [entries])

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'de-DE'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
      }
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    } else {
      setSpeechSupported(false)
    }
  }, [])

  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert('Spracheingabe wird von Ihrem Browser nicht unterstützt.')
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  const parseEntry = (text) => {
    // Enhanced parsing logic
    const lowerText = text.toLowerCase()
    
    // Extract amount with better regex
    const amountMatch = text.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:euro|€|eur)?/i)
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0
    
    // Determine type based on keywords
    const expenseKeywords = ['gekauft', 'ausgabe', 'bezahlt', 'kosten', 'ausgegeben', 'material', 'einkauf']
    const incomeKeywords = ['einnahme', 'verdient', 'erhalten', 'haarschnitt', 'schnitt', 'färben', 'waschen']
    
    let isExpense = expenseKeywords.some(keyword => lowerText.includes(keyword))
    let isIncome = incomeKeywords.some(keyword => lowerText.includes(keyword))
    
    // If no clear indicator, default to income for positive amounts
    if (!isExpense && !isIncome && amount > 0) {
      isIncome = true
    }
    
    // Extract description (remove amount and currency)
    let description = text
      .replace(/\d+(?:[.,]\d{1,2})?\s*(?:euro|€|eur)?/gi, '')
      .replace(/einnahme|ausgabe|gekauft|bezahlt/gi, '')
      .trim()
    
    if (!description) {
      description = isExpense ? 'Ausgabe' : 'Einnahme'
    }
    
    return {
      type: isExpense ? 'expense' : 'income',
      amount,
      description
    }
  }

  const handleSubmit = () => {
    if (inputText.trim()) {
      const parsed = parseEntry(inputText)
      
      if (parsed.amount > 0) {
        const now = new Date()
        const newEntry = {
          id: Date.now(),
          date: now.toLocaleDateString('de-DE'),
          time: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
          ...parsed
        }
        
        setEntries(prev => [newEntry, ...prev])
        setInputText('')
      } else {
        alert('Bitte geben Sie einen gültigen Betrag ein.')
      }
    }
  }

  const handleDelete = (id) => {
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
      setEntries(prev => prev.filter(entry => entry.id !== id))
    }
  }

  const handleEdit = (entry) => {
    setEditingId(entry.id)
    setEditText(`${entry.amount} Euro ${entry.description}`)
  }

  const handleSaveEdit = () => {
    if (editText.trim()) {
      const parsed = parseEntry(editText)
      
      if (parsed.amount > 0) {
        setEntries(prev => prev.map(entry => 
          entry.id === editingId 
            ? { ...entry, ...parsed }
            : entry
        ))
        setEditingId(null)
        setEditText('')
      } else {
        alert('Bitte geben Sie einen gültigen Betrag ein.')
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  // Filter today's entries
  const todayEntries = groupEntriesByPeriod(entries, 'today')
  
  const totalIncome = todayEntries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0)

  const totalExpenses = todayEntries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Einnahmen (Heute)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {totalIncome.toFixed(2)} €
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Ausgaben (Heute)
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {totalExpenses.toFixed(2)} €
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Gewinn (Heute)
            </CardTitle>
            <Euro className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {(totalIncome - totalExpenses).toFixed(2)} €
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Neue Buchung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="z.B. '40 Euro Haarschnitt' oder '12 Euro Shampoo gekauft'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-lg py-6 border-2 border-gray-200 focus:border-blue-400 transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button
              onClick={handleVoiceInput}
              variant={isListening ? "destructive" : "secondary"}
              size="lg"
              className={`px-6 py-6 transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : speechSupported
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!speechSupported}
              title={speechSupported ? (isListening ? 'Aufnahme stoppen' : 'Spracheingabe starten') : 'Spracheingabe nicht verfügbar'}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
          </div>
          {isListening && (
            <div className="text-center text-blue-600 font-medium">
              🎤 Sprechen Sie jetzt...
            </div>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full py-6 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={!inputText.trim()}
          >
            <Plus className="h-5 w-5 mr-2" />
            Buchung hinzufügen
          </Button>
        </CardContent>
      </Card>

      {/* Today's Entries */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Heutige Buchungen ({todayEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayEntries.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Noch keine Buchungen für heute. Fügen Sie Ihre erste Buchung hinzu!
              </div>
            ) : (
              todayEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      {editingId === entry.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                              Speichern
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Abbrechen
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium text-gray-800">
                            {entry.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.date} • {entry.time}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-lg font-semibold ${
                      entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.type === 'income' ? '+' : '-'}{entry.amount.toFixed(2)} €
                    </div>
                    {editingId !== entry.id && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(entry)}
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(entry.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// History Component
function History() {
  const [entries, setEntries] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  useEffect(() => {
    const storedEntries = loadEntries()
    setEntries(storedEntries)
  }, [])

  const handleDelete = (id) => {
    if (confirm('Möchten Sie diesen Eintrag wirklich löschen?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id)
      setEntries(updatedEntries)
      saveEntries(updatedEntries)
    }
  }

  const filteredEntries = selectedPeriod === 'all' ? entries : groupEntriesByPeriod(entries, selectedPeriod)
  const groupedEntries = groupEntriesByDate(filteredEntries)
  
  const calculateTotals = (entries) => {
    const income = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0)
    const expenses = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0)
    return { income, expenses, profit: income - expenses }
  }

  const totals = calculateTotals(filteredEntries)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Period Filter */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 mb-8">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            Zeitraum auswählen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Alle' },
              { key: 'today', label: 'Heute' },
              { key: 'week', label: 'Diese Woche' },
              { key: 'month', label: 'Dieser Monat' },
              { key: 'year', label: 'Dieses Jahr' }
            ].map(period => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'outline'}
                onClick={() => setSelectedPeriod(period.key)}
                className={selectedPeriod === period.key ? 'bg-blue-500 text-white' : ''}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Einnahmen ({selectedPeriod === 'all' ? 'Gesamt' : 
                selectedPeriod === 'today' ? 'Heute' :
                selectedPeriod === 'week' ? 'Diese Woche' :
                selectedPeriod === 'month' ? 'Dieser Monat' : 'Dieses Jahr'})
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {totals.income.toFixed(2)} €
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Ausgaben ({selectedPeriod === 'all' ? 'Gesamt' : 
                selectedPeriod === 'today' ? 'Heute' :
                selectedPeriod === 'week' ? 'Diese Woche' :
                selectedPeriod === 'month' ? 'Dieser Monat' : 'Dieses Jahr'})
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {totals.expenses.toFixed(2)} €
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              Gewinn ({selectedPeriod === 'all' ? 'Gesamt' : 
                selectedPeriod === 'today' ? 'Heute' :
                selectedPeriod === 'week' ? 'Diese Woche' :
                selectedPeriod === 'month' ? 'Dieser Monat' : 'Dieses Jahr'})
            </CardTitle>
            <Euro className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {totals.profit.toFixed(2)} €
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grouped Entries */}
      <div className="space-y-6">
        {Object.keys(groupedEntries).length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                Keine Buchungen für den ausgewählten Zeitraum gefunden.
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.keys(groupedEntries)
            .sort((a, b) => new Date(b.split('.').reverse().join('-')) - new Date(a.split('.').reverse().join('-')))
            .map(date => {
              const dayEntries = groupedEntries[date]
              const dayTotals = calculateTotals(dayEntries)
              
              return (
                <Card key={date} className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg text-gray-800">
                        {date}
                      </CardTitle>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600 font-medium">
                          +{dayTotals.income.toFixed(2)} €
                        </span>
                        <span className="text-red-600 font-medium">
                          -{dayTotals.expenses.toFixed(2)} €
                        </span>
                        <span className="text-blue-600 font-medium">
                          = {dayTotals.profit.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-3 h-3 rounded-full ${
                              entry.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">
                                {entry.description}
                              </div>
                              <div className="text-sm text-gray-500">
                                {entry.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`text-lg font-semibold ${
                              entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {entry.type === 'income' ? '+' : '-'}{entry.amount.toFixed(2)} €
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(entry.id)}
                              className="h-8 w-8 p-0 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })
        )}
      </div>
    </div>
  )
}

function App() {
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    setSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💰 Kassabot
          </h1>
          <p className="text-gray-600">
            Einnahmen & Ausgaben einfach per Sprache erfassen
          </p>
          {!speechSupported && (
            <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm max-w-md mx-auto">
              ⚠️ Spracheingabe wird von Ihrem Browser nicht unterstützt
            </div>
          )}
        </div>

        <Navigation />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

