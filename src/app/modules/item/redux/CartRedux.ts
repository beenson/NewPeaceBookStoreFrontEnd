import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// 購物車用的Redux

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  resetCart: 'resetCart',
  deleteCartItem: 'deleteCartItem',
  updateCartItem: 'updateCartItem',
}

const initialCartState: CartState = {
  Carts: [],
  lastUpdate: 0,
}

export interface CartState {
  Carts: {itemId: number; quantity: number}[]
  lastUpdate: number
}

export const reducer = persistReducer(
  {storage, key: 'v100-demo1-Cart', whitelist: ['Carts']}, // Cart存到localStorage持久化保存
  (state: CartState = initialCartState, action: ActionWithPayload<any>) => {
    switch (action.type) {
      case actionTypes.resetCart: {
        return initialCartState
      }

      case actionTypes.deleteCartItem: {
        const itemId: number = action.payload?.itemId
        const item = state.Carts.find((i) => i.itemId === itemId)
        if (item) {
          state.Carts.splice(state.Carts.indexOf(item), 1)
        }
        return {...state}
      }

      case actionTypes.updateCartItem: {
        const itemId: number = action.payload?.itemId
        const quantity: number = action.payload?.quantity
        state.Carts.forEach((i) => {
          const item = state.Carts.find((i) => i.itemId === itemId)
          if (item) {
            state.Carts[state.Carts.indexOf(item)] = {itemId, quantity}
          } else {
            state.Carts.push({itemId, quantity})
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
  resetCart: () => ({
    type: actionTypes.resetCart,
    payload: {},
  }),
  deleteCartItem: (itemId: number) => ({
    type: actionTypes.deleteCartItem,
    payload: {itemId},
  }),
  updateCartItem: (itemId: number, quantity: number) => ({
    type: actionTypes.updateCartItem,
    payload: {itemId, quantity},
  }),
}

export function* saga() {}