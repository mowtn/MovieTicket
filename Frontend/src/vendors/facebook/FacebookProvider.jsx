import { useEffect } from 'react'

function FacebookProvider({ children, appId, locale = 'vi_VN' }) {
    useEffect(() => {
        const initFacebookSDK = () => {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId, // You App ID
                    cookie: true, // enable cookies to allow the server to access the session
                    xfbml: true, // parse social plugins on this page
                    version: 'v17.0', // use version 2.1
                })
            }
            // Load the SDK asynchronously
            ;(function (d, s, id) {
                const fjs = d.getElementsByTagName(s)[0]
                if (d.getElementById(id)) return
                const js = d.createElement(s)
                js.id = id
                js.src = `//connect.facebook.net/${locale}/sdk.js`
                fjs.parentNode.insertBefore(js, fjs)
            })(document, 'script', 'facebook-jssdk')
        }
        initFacebookSDK()
    }, [appId, locale])

    return children
}

export default FacebookProvider
