import Path from '../Path'

export default class HistoryPath extends Path {
  type: string = 'history'

  constructor(userId: number) {
    super()
    this.form.userId = userId
    this.pushHandleFunction()
  }

  // TODO: Handle
  /**
   * {
   *    created_at: "2021-12-17T04:39:44.000000Z",
   *    from_user: 3,
   *    id: 1,
   *    message: "aaaaaaaa",
   *    to_user: 2
   * }
   */
  public recieveHandle(res: any) {
    const userId = res.userId
    const messages: {
      id: number
      message: string
      from_user: number
      to_user: number
      created_at: string
    }[] = res.messages
    console.log(userId, messages)
  }
}
