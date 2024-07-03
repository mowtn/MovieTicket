import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import Loading from '../../components/Loading'
import webAPI from '../../api/webAPI'
import { handleError } from '../../api/axiosConfig'
import { toast } from 'react-toastify'

function VnPayReturn() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            try {
                const params = Object.fromEntries(searchParams.entries())
                const res = await webAPI.profile.vnpayReturn(params)
                if (res.data.code === '00') {
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
            } catch (error) {
                handleError(error)
            }

            navigate('/profile/ticket', { replace: true })
        })()
    }, [searchParams])

    return <Loading />
}

export default VnPayReturn
