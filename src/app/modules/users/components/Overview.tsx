/* eslint-disable jsx-a11y/anchor-is-valid */
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import {
  ChartsWidget1,
  TablesWidget1,
  ListsWidget5,
  TablesWidget5,
} from '../../../../system/partials/widgets'
import {UserModel} from '../../auth/redux/AuthModel'
import * as AuthRedux from '../../auth/redux/AuthRedux'

export function Overview() {
  const authState: AuthRedux.IAuthState = useSelector<RootState>(
    ({auth}) => auth,
    shallowEqual
  ) as AuthRedux.IAuthState
  const user: UserModel = authState.auth?.user as UserModel
  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>詳細資訊</h3>
          </div>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>名稱</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>{user.name}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>連絡電話</label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{user.phone}</span>
              {user.phone_verify?.status === 1 ? (
                <span className='badge badge-success'>已驗證</span>
              ) : (
                <span className='badge badge-danger'>未驗證</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ChartsWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ListsWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>
    </>
  )
}
