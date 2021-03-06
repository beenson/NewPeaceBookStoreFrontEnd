import axios from 'axios'
import * as OrderRedux from '../redux/OrderRedux'
import {ErrorResponse, NetworkErrorResponse} from '../../errors/ErrorDataTypes'
import {dispatch} from '../../../../setup/redux/Store'
import {OrderModel} from '../redux/OrderModel'

export type Response = {
  status: number
  data: OrderModel
}

export const API_URL = (userId: number, orderId: number) =>
  `${import.meta.env.VITE_API_URL}/user/${userId}/order/${orderId}`

// 取得會員單筆訂單詳細資訊
export default async function getUserOrderAPI(
  userId: number,
  orderId: number
): Promise<OrderModel | ErrorResponse> {
  try {
    const {data} = await axios.get<Response>(API_URL(userId, orderId))
    dispatch(OrderRedux.actions.updateOrders([data.data]))
    return data.data
  } catch (err: any) {
    console.log(err)
    return (err.response?.data as ErrorResponse) || NetworkErrorResponse
  }
}
