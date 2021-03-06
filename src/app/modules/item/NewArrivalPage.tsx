import React, {FC, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {shallowEqual, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RootState} from '../../../setup'
import {PageTitle} from '../../../system/layout/core'
import SearchInput from '../../../system/helpers/SearchInput'
import getCategoriesAPI from '../category/API/GetCategoriesAPI'
import {CategoryState} from '../category/redux/CategoryRedux'
import {UserModel} from '../auth/redux/AuthModel'
import * as AuthRedux from '../auth/redux/AuthRedux'
import searchTagsAPI from '../tag/API/SearchTagsAPI'
import createItemAPI from './API/CreateItemAPI'

const NewArrivalPage: FC = () => {
  const history = useHistory()
  const categoryState: CategoryState = useSelector((state: RootState) => state.category)
  const onDrop = (acceptedFiles: any[]) => {
    const preImages: string[] = images
    let i = 0
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        i++
        const img = e.target?.result
        if (img) {
          preImages.push(img as string)
        }
        if (i >= acceptedFiles.length) {
          setImages([...preImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }
  const authState: AuthRedux.IAuthState = useSelector<RootState>(
    ({auth}) => auth,
    shallowEqual
  ) as AuthRedux.IAuthState
  const user: UserModel = authState.auth?.user as UserModel
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  const [load, setLoad] = useState(false)
  const [userBanned, setUserBanned] = useState(false)
  const [onSubmit, setOnSubmit] = useState(false)
  const [images, setImages] = useState([] as string[])
  const [createName, setCreateName] = useState('')
  const [createDescription, setCreateDescription] = useState('')
  const [createPrice, setCreatePrice] = useState(0)
  const [createQuantity, setCreateQuantity] = useState(0)
  const [createISBN, setCreateISBN] = useState('')
  const [createDepartment, setCreateDepartment] = useState(0)
  const [tags, setTags] = useState([''] as string[])
  const removeImage = (index: number) => {
    images.splice(index, 1)
    setImages([...images])
  }
  const setTag = (i: number, name: string) => {
    tags[i] = name
    setTags([...tags])
  }
  const addTag = () => {
    tags.push('')
    setTags([...tags])
  }
  const searchExistTag = async (name: string): Promise<string[]> => {
    if (name === '') {
      return []
    }
    const tags = await searchTagsAPI(name)
    const tagNames: string[] = []
    if ('message' in tags) {
      return tagNames
    } else {
      tags.forEach((tag) => {
        tagNames.push(tag.name)
      })
      return tagNames
    }
  }
  const createItem = () => {
    if (createPrice <= 0) {
      toast.warn('?????????????????????')
      return
    }
    if (createQuantity <= 0) {
      toast.warn('?????????????????????')
      return
    }
    if (createName === '') {
      toast.warn('???????????????????????????')
      return
    }
    tags.forEach((tag) => {
      if (tag === '') {
        const index = tags.indexOf(tag)
        tags.splice(index, 1)
      }
    })
    setOnSubmit(true)
    setTimeout(async () => {
      const result = await createItemAPI(
        createName,
        createDescription,
        createISBN,
        createDepartment,
        createPrice,
        createQuantity,
        images,
        tags
      )
      if ('id' in result) {
        toast.success('???????????????')
        history.push(`/item/${result.id}`)
      } else {
        toast.error(`???????????????${result.message}`)
      }
      setOnSubmit(false)
    }, 500)
  }

  //???????????????ban????????????
  const btnOrderShow = () => {
    if (userBanned) {
      return (
        <button
          type='button'
          className='btn btn-danger'
          onClick={() => {
            toast.error(
              <span>
                ????????????????????????????????????????????????
                <br />
                ????????????????????????????????????????????????
              </span>
            )
          }}
        >
          ?????????
        </button>
      )
    } else {
      return (
        <button className='btn btn-primary' disabled={onSubmit} onClick={createItem}>
          {onSubmit ? (
            <span className='indicator-label'>
              ?????????
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          ) : (
            <span className='indicator-label'>????????????</span>
          )}
        </button>
      )
    }
  }

  if (!load) {
    setUserBanned(user.role === -1)
    setLoad(true)
    ;(async () => {
      const categories = await getCategoriesAPI()
      if (!('message' in categories)) {
        setCreateDepartment(categories[0].id)
      }
    })()
  }
  return (
    <>
      <PageTitle breadcrumbs={[]}>{`????????????`}</PageTitle>
      <div className='container-xxl'>
        <div className='d-flex flex-column gap-7 gap-lg-10'>
          <div
            data-kt-swapper='true'
            data-kt-swapper-mode='prepend'
            data-kt-swapper-parent="{default: '#kt_content_container'}"
            className='page-title d-flex align-items-center flex-wrap me-3 mb-5 mb-lg-0'
          ></div>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2 className='required'>????????????</h2>
              </div>
            </div>
            <div className='card-body pt-0'>
              <div className='fv-row mb-2'>
                <div className='dropzone' {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className='dz-message needsclick d-flex'>
                    <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                    <div className='ms-4'>
                      <h3 className='fs-5 fw-bolder text-gray-900 my-3'>
                        ????????????????????????????????????????????????
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                  {images.map((image, i) => (
                    <div>
                      <img src={image} style={{maxWidth: '175px'}} alt='' />
                      <button
                        style={{
                          position: 'relative',
                          right: '10px',
                          verticalAlign: 'top',
                          borderRadius: '50%',
                          border: '10px',
                          backgroundColor: '#cccccc',
                          color: '#000000',
                        }}
                        onClick={() => removeImage(i)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className='card card-flush py-4'>
            <div className='card-header'>
              <div className='card-title'>
                <h2>????????????</h2>
              </div>
            </div>
            <div className='card-body pt-0'>
              <div className='mb-10 fv-row'>
                <label className='required form-label'>????????????</label>
                <input
                  type='text'
                  className='form-control mb-2'
                  placeholder='????????????'
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </div>
              <div className='mb-10 fv-row'>
                <label className='required form-label'>??????</label>
                <input
                  type='number'
                  className='form-control mb-2'
                  placeholder='??????'
                  min={1}
                  value={createPrice}
                  onChange={(e) => setCreatePrice(parseInt(e.target.value))}
                />
              </div>
              <div className='mb-10 fv-row'>
                <label className='required form-label'>??????</label>
                <input
                  type='number'
                  className='form-control mb-2'
                  placeholder='??????'
                  min={1}
                  max={99}
                  value={createQuantity}
                  onChange={(e) => setCreateQuantity(parseInt(e.target.value))}
                />
              </div>
              <div className='mb-10 fv-row'>
                <label className='form-label'>ISBN</label>
                <input
                  className='form-control mb-2'
                  placeholder='ISBN'
                  value={createISBN}
                  onChange={(e) => setCreateISBN(e.target.value)}
                />
              </div>
              <div className='mb-10 fv-row'>
                <label className='required form-label'>??????</label>
                <textarea
                  rows={10}
                  className='form-control mb-2'
                  placeholder='??????'
                  value={createDescription}
                  style={{
                    resize: 'none',
                  }}
                  onChange={(e) => setCreateDescription(e.target.value)}
                />
              </div>
              <div className='mb-10 fv-row'>
                <label className='required form-label'>?????????(???)???</label>
                <select
                  className='form-select mb-2'
                  value={createDepartment}
                  onChange={(e) => setCreateDepartment(parseInt(e.target.value))}
                >
                  {categoryState.categories.map((category, i) => (
                    <option key={`category${i}`} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-10 fv-row'>
                <label className='form-label d-block'>????????????</label>
                <div className='row'>
                  {tags.map((tag, i) => (
                    <div className='col-xl-3 col-lg-4 col-md-6 col-12' key={i}>
                      <SearchInput
                        placeholder='?????????Tag'
                        state={tag}
                        setState={(msg: string) => setTag(i, msg)}
                        apiFunc={(msg: string) => searchExistTag(msg)}
                      />
                    </div>
                  ))}
                  <div className='col-xl-3 col-lg-4 col-md-6 col-12'>
                    <button className='w-100 btn btn-primary' onClick={() => addTag()}>
                      ????????????
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-end'>{btnOrderShow()}</div>
        </div>
      </div>
    </>
  )
}
export default NewArrivalPage
