import React from 'react'
import Logo from './Logo'

function Loading() {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse">
                <Logo />
            </div>
        </div>
    )
}

export default Loading
