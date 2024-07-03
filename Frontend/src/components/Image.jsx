import { useEffect, useState } from 'react'
import webAPI from '../api/webAPI'

function Image(props) {
    const [isError, setError] = useState(false)

    useEffect(() => {
        if (props.src) setError(false)
        else setError(true)
    }, [props.src])

    return isError ? (
        <img alt="error" {...props} src={webAPI.getStatic('default-image.jpg')} />
    ) : (
        <img alt="error" {...props} onError={(e) => setError(true)} />
    )
}

export default Image
