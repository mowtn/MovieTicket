import React, { useEffect } from 'react'

function FacebookComment({ url, numPosts = 5 }) {
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse()
        }
    }, [])

    return <div className="fb-comments" data-href={url} width="100%" data-numposts={numPosts}></div>
}

export default FacebookComment
