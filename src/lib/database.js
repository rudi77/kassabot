// Database utilities for Kassabot
import initSqlJs from 'sql.js'

class KassabotDB {
  constructor() {
    this.db = null
    this.isInitialized = false
  }

  async init() {
    if (this.isInitialized) return

    try {
      // Initialize SQL.js
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      })

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('kassabot_sqlite_db')
      
      if (savedDb) {
        // Load existing database
        const uint8Array = new Uint8Array(JSON.parse(savedDb))
        this.db = new SQL.Database(uint8Array)
      } else {
        // Create new database
        this.db = new SQL.Database()
        await this.createTables()
        await this.migrateFromLocalStorage()
      }

      this.isInitialized = true
      console.log('✅ SQLite database initialized')
    } catch (error) {
      console.error('❌ Failed to initialize SQLite:', error)
      throw error
    }
  }

  async createTables() {
    const createEntriesTable = `
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        color TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
      CREATE INDEX IF NOT EXISTS idx_entries_type ON entries(type);
      CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at);
    `

    try {
      this.db.run(createEntriesTable)
      this.db.run(createCategoriesTable)
      this.db.run(createIndexes)
      
      // Insert default categories
      this.insertDefaultCategories()
      
      console.log('✅ Database tables created')
    } catch (error) {
      console.error('❌ Failed to create tables:', error)
      throw error
    }
  }

  insertDefaultCategories() {
    const defaultCategories = [
      { name: 'Haarschnitt', type: 'income', color: '#10B981' },
      { name: 'Färben', type: 'income', color: '#3B82F6' },
      { name: 'Waschen', type: 'income', color: '#8B5CF6' },
      { name: 'Material', type: 'expense', color: '#EF4444' },
      { name: 'Einkauf', type: 'expense', color: '#F59E0B' },
      { name: 'Sonstiges', type: 'expense', color: '#6B7280' }
    ]

    const insertCategory = `
      INSERT OR IGNORE INTO categories (name, type, color)
      VALUES (?, ?, ?)
    `

    defaultCategories.forEach(category => {
      try {
        this.db.run(insertCategory, [category.name, category.type, category.color])
      } catch (error) {
        console.warn('Category already exists:', category.name)
      }
    })
  }

  async migrateFromLocalStorage() {
    try {
      const oldEntries = localStorage.getItem('kassabot_entries')
      if (!oldEntries) return

      const entries = JSON.parse(oldEntries)
      console.log(`🔄 Migrating ${entries.length} entries from localStorage...`)

      const insertEntry = `
        INSERT INTO entries (id, date, time, type, amount, description, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `

      entries.forEach(entry => {
        try {
          this.db.run(insertEntry, [
            entry.id,
            entry.date,
            entry.time,
            entry.type,
            entry.amount,
            entry.description
          ])
        } catch (error) {
          console.warn('Failed to migrate entry:', entry.id, error)
        }
      })

      // Save database after migration
      this.saveDatabase()

      // Remove old localStorage data
      localStorage.removeItem('kassabot_entries')
      console.log('✅ Migration completed, localStorage cleared')
    } catch (error) {
      console.error('❌ Migration failed:', error)
    }
  }

  saveDatabase() {
    try {
      const data = this.db.export()
      const dataArray = Array.from(data)
      localStorage.setItem('kassabot_sqlite_db', JSON.stringify(dataArray))
    } catch (error) {
      console.error('❌ Failed to save database:', error)
    }
  }

  // CRUD Operations
  async getAllEntries() {
    const query = `
      SELECT * FROM entries 
      ORDER BY date DESC, time DESC
    `
    
    try {
      const result = this.db.exec(query)
      if (result.length === 0) return []
      
      const columns = result[0].columns
      const values = result[0].values
      
      return values.map(row => {
        const entry = {}
        columns.forEach((col, index) => {
          entry[col] = row[index]
        })
        return entry
      })
    } catch (error) {
      console.error('❌ Failed to get entries:', error)
      return []
    }
  }

  async getEntriesByDateRange(startDate, endDate) {
    const query = `
      SELECT * FROM entries 
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC, time DESC
    `
    
    try {
      const result = this.db.exec(query, [startDate, endDate])
      if (result.length === 0) return []
      
      const columns = result[0].columns
      const values = result[0].values
      
      return values.map(row => {
        const entry = {}
        columns.forEach((col, index) => {
          entry[col] = row[index]
        })
        return entry
      })
    } catch (error) {
      console.error('❌ Failed to get entries by date range:', error)
      return []
    }
  }

  async addEntry(entry) {
    const query = `
      INSERT INTO entries (date, time, type, amount, description, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    
    try {
      const result = this.db.run(query, [
        entry.date,
        entry.time,
        entry.type,
        entry.amount,
        entry.description,
        entry.category || null
      ])
      
      this.saveDatabase()
      
      // Return the inserted entry with ID
      return {
        id: result.lastInsertRowid,
        ...entry
      }
    } catch (error) {
      console.error('❌ Failed to add entry:', error)
      throw error
    }
  }

  async updateEntry(id, entry) {
    const query = `
      UPDATE entries 
      SET date = ?, time = ?, type = ?, amount = ?, description = ?, category = ?, updated_at = datetime('now')
      WHERE id = ?
    `
    
    try {
      this.db.run(query, [
        entry.date,
        entry.time,
        entry.type,
        entry.amount,
        entry.description,
        entry.category || null,
        id
      ])
      
      this.saveDatabase()
      return { id, ...entry }
    } catch (error) {
      console.error('❌ Failed to update entry:', error)
      throw error
    }
  }

  async deleteEntry(id) {
    const query = `DELETE FROM entries WHERE id = ?`
    
    try {
      this.db.run(query, [id])
      this.saveDatabase()
      return true
    } catch (error) {
      console.error('❌ Failed to delete entry:', error)
      throw error
    }
  }

  async getStatistics(startDate = null, endDate = null) {
    let query = `
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM entries
    `
    
    const params = []
    if (startDate && endDate) {
      query += ` WHERE date BETWEEN ? AND ?`
      params.push(startDate, endDate)
    }
    
    query += ` GROUP BY type`
    
    try {
      const result = this.db.exec(query, params)
      if (result.length === 0) return { income: 0, expenses: 0, profit: 0 }
      
      const stats = { income: 0, expenses: 0, profit: 0 }
      
      result[0].values.forEach(row => {
        const [type, total] = row
        if (type === 'income') {
          stats.income = total
        } else if (type === 'expense') {
          stats.expenses = total
        }
      })
      
      stats.profit = stats.income - stats.expenses
      return stats
    } catch (error) {
      console.error('❌ Failed to get statistics:', error)
      return { income: 0, expenses: 0, profit: 0 }
    }
  }

  async getCategories(type = null) {
    let query = `SELECT * FROM categories`
    const params = []
    
    if (type) {
      query += ` WHERE type = ?`
      params.push(type)
    }
    
    query += ` ORDER BY name`
    
    try {
      const result = this.db.exec(query, params)
      if (result.length === 0) return []
      
      const columns = result[0].columns
      const values = result[0].values
      
      return values.map(row => {
        const category = {}
        columns.forEach((col, index) => {
          category[col] = row[index]
        })
        return category
      })
    } catch (error) {
      console.error('❌ Failed to get categories:', error)
      return []
    }
  }

  async exportDatabase() {
    try {
      const data = this.db.export()
      const blob = new Blob([data], { type: 'application/x-sqlite3' })
      return blob
    } catch (error) {
      console.error('❌ Failed to export database:', error)
      throw error
    }
  }

  async exportCSV() {
    try {
      const entries = await this.getAllEntries()
      
      const headers = ['Datum', 'Zeit', 'Typ', 'Betrag', 'Beschreibung', 'Kategorie']
      const csvContent = [
        headers.join(','),
        ...entries.map(entry => [
          entry.date,
          entry.time,
          entry.type === 'income' ? 'Einnahme' : 'Ausgabe',
          entry.amount.toFixed(2),
          `"${entry.description}"`,
          entry.category || ''
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      return blob
    } catch (error) {
      console.error('❌ Failed to export CSV:', error)
      throw error
    }
  }
}

// Create singleton instance
const kassabotDB = new KassabotDB()

export default kassabotDB

