import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/AuthContext'
import CheckAuth, { RoleName } from './components/CheckAuth'
import { AdminLayout, HomeLayout, ProfileLayout } from './layouts'
import {
    Home,
    Login,
    Dashboard,
    UserManage,
    MovieManage,
    FoodManage,
    Movie,
    MovieDetail,
    CinemaManage,
    RoomManage,
    SeatManage,
    ShowtimeManage,
    VnPayReturn,
    TicketManage,
    ReportManage,
    Cinema,
    Profile,
    Ticket,
    PrintTicket,
    Register,
    ChangePass,
    BannerManage,
} from './pages'
import FacebookProvider from './vendors/facebook/FacebookProvider'

const router = createBrowserRouter([
    {
        path: '/*',
        element: <HomeLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'movie', element: <Movie /> },
            { path: 'movie/:slug', element: <MovieDetail /> },
            { path: 'cinema', element: <Cinema /> },
            { path: '*', element: <Navigate to="/" replace /> },
        ],
    },
    {
        path: 'admin/*',
        element: (
            <CheckAuth roles={[RoleName.SHOW_ADMIN]}>
                <AdminLayout />
            </CheckAuth>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            {
                path: 'user',
                element: (
                    <CheckAuth roles={[RoleName.MANAGE_USER]}>
                        <UserManage />
                    </CheckAuth>
                ),
            },
            {
                path: 'cinema/*',
                element: (
                    <CheckAuth roles={[RoleName.MANAGE_CINEMA]}>
                        <Outlet />
                    </CheckAuth>
                ),
                children: [
                    { index: true, element: <CinemaManage /> },
                    { path: ':cinemaId/room', element: <RoomManage /> },
                    { path: 'room/:roomId/seat', element: <SeatManage /> },
                ],
            },
            {
                path: 'food',
                element: (
                    <CheckAuth roles={[RoleName.MANAGE_FOOD]}>
                        <FoodManage />
                    </CheckAuth>
                ),
            },
            {
                path: 'banner',
                element: <BannerManage />,
            },
            {
                path: 'movie',
                element: (
                    <CheckAuth roles={[RoleName.MANAGE_MOVIE]}>
                        <MovieManage />
                    </CheckAuth>
                ),
            },
            {
                path: 'showtime',
                element: (
                    <CheckAuth roles={[RoleName.MANAGE_SHOWTIME]}>
                        <ShowtimeManage />
                    </CheckAuth>
                ),
            },
            {
                path: 'ticket',
                element: (
                    <CheckAuth roles={[RoleName.MANAGE_TICKET]}>
                        <TicketManage />
                    </CheckAuth>
                ),
            },
            { path: 'report', element: <ReportManage /> },
            { path: '*', element: <Navigate to="/admin" replace /> },
        ],
    },
    {
        path: 'profile/*',
        element: (
            <CheckAuth>
                <HomeLayout />
            </CheckAuth>
        ),
        children: [
            {
                element: <ProfileLayout />,
                children: [
                    { index: true, element: <Profile /> },
                    { path: 'ticket', element: <Ticket /> },
                    { path: 'change-pass', element: <ChangePass /> },
                ],
            },
            { path: 'vnpay_return', element: <VnPayReturn /> },
            { path: '*', element: <Navigate to="/profile" replace /> },
        ],
    },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'print-ticket', element: <PrintTicket /> },
    { path: '*', element: <Navigate to="/" replace /> },
])

function App() {
    return (
        <>
            <FacebookProvider appId={process.env.REACT_APP_FB_APP_ID}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </FacebookProvider>
            <ToastContainer />
        </>
    )
}

export default App
