export default class IndexedList {
  _index = {}
  _array = []

  constructor (options = {}) {
    options.idField = options.idField || 'id'
    this.options = options
  }

  push (item) {
    const id = this._getItemId(item)
    if (this._index[id]) {
      return
    }

    this._array = [...this._array, item]
    this._index[id] = { value: item, arrayIndex: this._array.length - 1 }
  }

  get (id) {
    if (!this._index[id]) {
      return null
    }

    return this._index[id].value
  }

  update (item) {
    const id = this._getItemId(item)
    if (!this._index[id]) {
      this.push(item)
      return
    }

    this._array[this._index[id].arrayIndex] = item
    this._array = [...this._array]
    this._index[id].value = item
  }

  delete (id) {
    if (!this._index[id]) {
      return
    }

    const arrayIndex = this._index[id].arrayIndex
    this._array.splice(arrayIndex, 1)
    for (let i = arrayIndex; i < this._array.length; i++) {
      const itemId = this._getItemId(this._array[i])
      this._index[itemId].arrayIndex--
    }

    delete this._index[id]
  }

  reset () {
    this._index = {}
    this._array = []
  }

  getArray () {
    return this._array
  }

  _getItemId (item) {
    for (let key in item) {
      if (key === this.options.idField) {
          return item[key]
      }
    }
  }
}
