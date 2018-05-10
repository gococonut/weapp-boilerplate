import Rest from './Rest'
import IndexedList from './IndexedList'
import regeneratorRuntime from './lib/regenerator'

export default class InfiniteScrollList {
  _indexedItems = null;
  _meta = {
    totalCount: 0,
    totalPage: 0,
    perPage: 0
  }

  constructor (options = { requestFunction: null, path: null, params: null }) {
    options.params.page = options.params.page || 1
    options.params['per-page'] = options.params['per-page'] || 20
    options.idField = options.idField || 'id'
    this._options = options
    this._indexedItems = new IndexedList(options)
  }

  loadMore = async () => {
    let result
    if (this._options.path) {
      result = await rest.get(this._options.path, this._options.params)
    } else if (this._options.requestFunction) {
      result = await this._options.requestFunction(this._options.params)
    }

    if (result) {
      this._options.params.page += 1
      for (const item of result.items) {
        this.push(item)
      }
      this._meta = result._meta
    }
  }

  push = (item) => {
    this._indexedItems.push(item)
  }

  delete = (id) => {
    this._indexedItems.delete(id)
  }

  deleteItems = (ids) => {
    for (const id of ids) {
      this.delete(id)
    }
  }

  reset = () => {
    this._indexedItems.reset()
  }

  getArray = () => {
    return this._indexedItems.getArray()
  }

  getTotalCount = () => {
    return this._meta.totalCount
  }

  getPerPage = () => {
    return this._meta.perPage
  }

  getTotalPage = () => {
    return this._meta.totalPage
  }

  getCurrentCount = () => {
    return this.getArray().length
  }

  hasMoreData = () => {
    return this.getCurrentCount() < this.getTotalCount()
  }
}
