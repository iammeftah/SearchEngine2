'use client'

import React, { useEffect, useState } from 'react'
import { newtonsCradle } from 'ldrs'

const Loader: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        try {
            newtonsCradle.register()
            setIsLoaded(true)
        } catch (error) {
            console.error('Failed to register newtonsCradle:', error)
        }
    }, [])

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex justify-center items-center h-full text-black dark:text-white">
            <l-newtons-cradle
                size="78"
                speed="1.4"
                color="#e11d48"
            />
        </div>
    )
}

export default Loader


