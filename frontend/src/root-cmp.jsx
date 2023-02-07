import React from 'react'
import { Routes, Route } from 'react-router'

// import { AppHeader } from './cmps/app-header'
// import { AppFooter } from './cmps/app-footer'
import { MainApp } from './pages/main-app'

export function RootCmp() {

    return (
        <div>
            {/* <AppHeader /> */}
            <main>
                <Routes>
                    <Route path="/" element={<MainApp />} />
                </Routes>
            </main>
            {/* <AppFooter /> */}
        </div>
    )
}


