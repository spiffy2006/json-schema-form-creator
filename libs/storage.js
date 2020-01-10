import shortid from 'shortid'
const STORAGE_ID = 'form-creator-blocks'
export default class Storage {
  constructor (storage) {
    this.blocks = JSON.parse(storage.getItem(STORAGE_ID) || '{}')
    this.storage = storage
  }

  add (data) {
    const id = shortid.generate()
    this.blocks[id] = { id, data }
    this.storage.setItem(STORAGE_ID, JSON.stringify(this.blocks))
    return id
  }

  update (id, data) {
    this.blocks[id] = { id, data }
    this.storage.setItem(STORAGE_ID, JSON.stringify(this.blocks))
    return id
  }

  remove (id) {
    if (this.blocks[id]) {
      delete this.blocks[id]
    }
    this.storage.setItem(STORAGE_ID, JSON.stringify(this.blocks))
    return id
  }

  get (id) {
    return this.blocks[id] || null
  }

  getAll () {
    return Object.values(this.blocks) || []
  }
}
