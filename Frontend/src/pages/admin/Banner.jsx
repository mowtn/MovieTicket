import { useEffect, useRef, useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdOutlineFileUpload } from 'react-icons/md'
import { toast } from 'react-toastify'

import Modal from '../../components/Modal'
import Dropdown from '../../components/Dropdown'
import adminAPI from '../../api/adminAPI'
import webAPI from '../../api/webAPI'
import arrayUtil from '../../utils/arrayUtil'
import { validateField, validateObject } from '../../utils/validateUtil'
import Image from '../../components/Image'
import { handleError } from '../../api/axiosConfig'

const dataRequestInit = {
    id: '',
    thumbnailFile: null,
    link: '',
    active: true,
}
const validateRules = [
    {
        name: 'link',
        message: 'Link không được để trống.',
        test: (value) => !value,
    },
]

function Banner() {
    const [isLoading, setLoading] = useState(true)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const [showModalUpdate, setShowModalUpdate] = useState(false)
    const [showModalDelete, setShowModalDelete] = useState(false)

    const [banners, setBanners] = useState([])

    const [selectedId, setSelectedId] = useState([])
    const [dataRequest, setDataRequest] = useState(dataRequestInit)
    const [errors, setErrors] = useState({})

    const thumbnailUrl = useRef()

    useEffect(() => {
        async function loadBanners() {
            try {
                const res = await adminAPI.banner.getAll()
                setBanners(res.data)
            } catch (error) {
                toast.error('Lỗi load danh sách')
                console.log(error)
            }
        }

        ;(async function () {
            await loadBanners()
            setLoading(false)
        })()
    }, [])

    const handleFormInputChange = (e) => {
        const { name, value, type, checked, files } = e.target
        if (type === 'file') {
            const file = files[0]
            thumbnailUrl.current = URL.createObjectURL(file)
            setDataRequest((prev) => ({ ...prev, [name]: file }))
        } else if (type === 'checkbox') setDataRequest((prev) => ({ ...prev, [name]: checked }))
        else {
            const errs = validateField(name, value, validateRules, errors)
            setErrors(errs)
            setDataRequest((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleFormCreateSubmit = async (e) => {
        e.preventDefault()
        const errs = validateObject(dataRequest, validateRules)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        try {
            const res = await adminAPI.banner.create(dataRequest)
            toast.success('Thêm mới thành công')
            setBanners((prev) => [res.data, ...prev])
            setShowModalCreate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleFormUpdateSubmit = async (e) => {
        e.preventDefault()
        const errs = validateObject(dataRequest, validateRules)
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        try {
            const res = await adminAPI.banner.update(dataRequest.id, dataRequest)
            toast.success('Cập nhật thành công')
            setBanners((prev) => prev.map((banner) => (banner.id === res.data.id ? res.data : banner)))
            setShowModalUpdate(false)
        } catch (error) {
            handleError(error)
        }
    }

    const handleDelete = async () => {
        try {
            await adminAPI.banner.delete(selectedId)
            toast.success('Xoá thành công')
            setBanners((prev) => prev.data.filter((banner) => !selectedId.includes(banner.id)))
            setSelectedId([])
            setShowModalDelete(false)
        } catch (error) {
            toast.error('Lỗi xoá đồ ăn')
        }
    }

    return isLoading ? (
        <></>
    ) : (
        <>
            <h1 className="mb-3 text-lg font-semibold">Danh Sách</h1>
            <div className="bg-white rounded shadow p-5">
                <div className="mb-3">
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-green-primary text-white hover:opacity-80 disabled:opacity-50 mr-2"
                        onClick={() => {
                            setDataRequest(dataRequestInit)
                            setErrors({})
                            thumbnailUrl.current = undefined
                            setShowModalCreate(true)
                        }}
                    >
                        <IoMdAdd />
                        Thêm
                    </button>
                    <button
                        className="inline-flex gap-1 items-center py-1 px-3 rounded bg-red-secondary text-white hover:opacity-80 disabled:opacity-50"
                        disabled={selectedId.length === 0}
                        onClick={() => setShowModalDelete(true)}
                    >
                        <AiFillDelete />
                        Xóa ({selectedId.length})
                    </button>
                </div>
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="w-1">
                                <input
                                    type="checkbox"
                                    checked={selectedId.length === banners.length}
                                    onChange={() => {
                                        if (selectedId.length === banners.length) setSelectedId([])
                                        else if (selectedId.length < banners.length)
                                            setSelectedId(banners.map((item) => item.id))
                                    }}
                                />
                            </th>
                            <th>#</th>
                            <th className="w-1">Ảnh</th>
                            <th>Link</th>
                            <th>Kích hoạt</th>
                            <th className="w-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((banner) => (
                            <tr key={banner.id}>
                                <td>
                                    <input
                                        className="p-2"
                                        type="checkbox"
                                        checked={selectedId.includes(banner.id)}
                                        onChange={() =>
                                            setSelectedId((prev) => arrayUtil.addOrRemoveValue(prev, banner.id))
                                        }
                                    />
                                </td>
                                <td>{banner.id}</td>
                                <td>
                                    <div className="rounded border w-72 overflow-hidden">
                                        <Image
                                            className="w-full max-h-[15rem] object-cover"
                                            src={webAPI.getUpload(banner.thumbnail)}
                                        />
                                    </div>
                                </td>
                                <td>{banner.link}</td>
                                <td>
                                    {banner.active ? (
                                        <span className="text-xs rounded text-white p-1 bg-green-primary whitespace-nowrap">
                                            Đã kích hoạt
                                        </span>
                                    ) : (
                                        <span className="text-xs rounded text-white p-1 bg-red-secondary whitespace-nowrap">
                                            Chưa kích hoạt
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <Dropdown
                                        className="p-2 rounded-full hover:bg-gray-secondary"
                                        Menu={({ isShow }) => (
                                            <div
                                                className="absolute bottom-full right-0 bg-white rounded shadow py-2"
                                                hidden={!isShow}
                                            >
                                                <button
                                                    className="block w-full text-left whitespace-nowrap px-3 py-1 hover:bg-gray-secondary"
                                                    onClick={() => {
                                                        setDataRequest(banner)
                                                        setErrors({})
                                                        thumbnailUrl.current = webAPI.getUpload(banner.thumbnail)
                                                        setShowModalUpdate(true)
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                            </div>
                                        )}
                                    >
                                        <BsThreeDotsVertical />
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModalCreate && (
                <Modal onHideClick={(e) => setShowModalCreate(false)}>
                    <form onSubmit={handleFormCreateSubmit}>
                        <header className="flex items-center justify-between mb-3">
                            <h1 className="font-bold text-xl">Thêm</h1>
                        </header>
                        <main>
                            <div className="mb-3">
                                <label className="block relative rounded border overflow-hidden group cursor-pointer">
                                    <Image
                                        className="w-full max-h-[15rem] object-cover"
                                        src={thumbnailUrl.current}
                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                    />
                                    <div className="absolute top-3/4 bottom-0 inset-0 flex items-center justify-center text-4xl text-blue-primary bg-blue-secondary opacity-60 group-hover:opacity-80">
                                        <MdOutlineFileUpload />
                                    </div>
                                    <input
                                        className="hidden"
                                        type="file"
                                        name="thumbnailFile"
                                        id="thumbnailFile"
                                        onChange={handleFormInputChange}
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    Link
                                    <input
                                        type="text"
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        name="link"
                                        value={dataRequest.link}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.link}
                                    />
                                </label>
                                {errors.link && <div className="mt-1 text-red-primary">{errors.link}</div>}
                            </div>
                            <div className="mb-3 select-none">
                                <span>Kích hoạt</span>
                                <div>
                                    <label>
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            name="active"
                                            checked={dataRequest.active}
                                            onChange={handleFormInputChange}
                                        />
                                        Đã kích hoạt
                                    </label>
                                </div>
                            </div>
                        </main>
                        <footer className="text-right">
                            <button className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80">
                                Thêm mới
                            </button>
                        </footer>
                    </form>
                </Modal>
            )}
            {showModalUpdate && (
                <Modal onHideClick={(e) => setShowModalUpdate(false)}>
                    <form onSubmit={handleFormUpdateSubmit}>
                        <header className="flex items-center justify-between mb-3">
                            <h1 className="font-bold text-xl">Cập nhật thông tin</h1>
                        </header>
                        <main>
                            <div className="mb-3">
                                <label className="block relative rounded border overflow-hidden group cursor-pointer">
                                    <Image
                                        className="w-full h-60 object-cover"
                                        src={thumbnailUrl.current}
                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                    />
                                    <div className="absolute top-3/4 bottom-0 inset-0 flex items-center justify-center text-4xl text-blue-primary bg-blue-secondary opacity-60 group-hover:opacity-80">
                                        <MdOutlineFileUpload />
                                    </div>
                                    <input
                                        className="hidden"
                                        type="file"
                                        name="thumbnailFile"
                                        id="thumbnailFile"
                                        onChange={handleFormInputChange}
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                <label>
                                    Link
                                    <input
                                        type="text"
                                        className="border aria-[invalid]:outline-red-primary rounded-md px-3 py-2 w-full focus:outline outline-blue-primary"
                                        name="link"
                                        value={dataRequest.link}
                                        onChange={handleFormInputChange}
                                        aria-invalid={errors.link}
                                    />
                                </label>
                                {errors.link && <div className="mt-1 text-red-primary">{errors.link}</div>}
                            </div>
                            <div className="mb-3 select-none">
                                <span>Kích hoạt</span>
                                <div>
                                    <label>
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            name="active"
                                            checked={dataRequest.active}
                                            onChange={handleFormInputChange}
                                        />
                                        Đã kích hoạt
                                    </label>
                                </div>
                            </div>
                        </main>
                        <footer className="text-right">
                            <button className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80">
                                Cập nhật
                            </button>
                        </footer>
                    </form>
                </Modal>
            )}
            {showModalDelete && (
                <Modal onHideClick={(e) => setShowModalDelete(false)}>
                    <header className="flex items-center justify-between mb-3">
                        <h1 className="font-bold text-xl">Xóa</h1>
                    </header>
                    <main>
                        <p className="mb-3">
                            Bạn có chắc muốn xóa{' '}
                            <span className="text-blue-primary">{selectedId.map((id) => `#${id}`).join(', ')}</span> ?
                        </p>
                    </main>
                    <footer className="text-right">
                        <button
                            className="py-2 px-5 rounded-md bg-blue-primary text-white hover:opacity-80"
                            onClick={handleDelete}
                        >
                            Xác nhận
                        </button>
                    </footer>
                </Modal>
            )}
        </>
    )
}

export default Banner
