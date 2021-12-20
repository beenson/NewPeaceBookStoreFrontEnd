import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {ItemModel} from './ItemModel'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  setItems: 'setItems',
  createItem: 'createItem',
  deleteItem: 'deleteItem',
  setItem: 'setItem',
  updateItems: 'updateItems',
}

const initialItemState: ItemState = {
  items: [],
  lastUpdate: 0,
}

export interface ItemState {
  items: ItemModel[]
  lastUpdate: number
}

export const reducer = persistReducer(
  {storage, key: 'v100-demo1-Item', whitelist: ['items']}, // Item存到localStorage持久化保存
  (state: ItemState = initialItemState, action: ActionWithPayload<any>) => {
    switch (action.type) {
      case actionTypes.setItems: {
        const items: ItemModel[] = action.payload?.items
        const lastUpdate = Date.now()
        return {items, lastUpdate}
      }

      case actionTypes.createItem: {
        const item: ItemModel = action.payload?.item
        state.items.push(item)
        return {...state}
      }

      case actionTypes.deleteItem: {
        const id: number = action.payload?.id
        const item = state.items.find((i) => i.id === id)
        if (item) {
          state.items.splice(state.items.indexOf(item), 1)
        }
        return {...state}
      }

      case actionTypes.setItem: {
        const item: ItemModel = action.payload.item
        const id: number = item.id
        const Item = state.items.find((i) => i.id === id)
        if (Item) {
          state.items[state.items.indexOf(item)] = {...item}
        } else {
          state.items.push(item)
        }
        return {...state}
      }

      case actionTypes.updateItems: {
        const items: ItemModel[] = action.payload.items
        items.forEach((item) => {
          const Item = state.items.find((i) => i.id === item.id)
          if (Item) {
            state.items[state.items.indexOf(item)] = {...item}
          } else {
            state.items.push(item)
          }
        })
        return {...state}
      }

      default:
        return state
    }
  }
)

export const actions = {
  setItems: (items: ItemModel[]) => ({
    type: actionTypes.setItems,
    payload: {items},
  }),
  createItem: (item: ItemModel) => ({
    type: actionTypes.createItem,
    payload: {item},
  }),
  deleteItem: (id: number) => ({
    type: actionTypes.deleteItem,
    payload: {id},
  }),
  setItem: (item: ItemModel) => ({
    type: actionTypes.setItem,
    payload: {item},
  }),
  updateItems: (items: ItemModel[]) => ({
    type: actionTypes.updateItems,
    payload: {items},
  }),
}

export function* saga() {}