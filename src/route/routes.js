/* eslint-disable no-undef */
/* eslint-disable */
/* eslint-disable no-console */
import { lazy } from 'react';
import DefaultLayout from '../layout/defaultLayout'

const Login = lazy(() => import('../components/login'));
const Dashboard = lazy(() => import('../components/dashboard'));
const Notes = lazy(() => import('../views/notes'));

export var routes = [
    {
        path: '/',
        component: Login,
        isNotRequired: true,
        linkName: ''
    },
    {
        path: '/login',
        component: Login,
        isNotRequired: true,
        linkName: ''
    },
    {
        path: '/logout',
        component: Login,
        linkName: ''
    },
    {
        path: '/dashboard',
        component: Dashboard,
        layout: DefaultLayout,
        linkName: '',
        isAccessible: 'showDashboard'
    },
    {
        path: '/notes',
        component: Notes,
        layout: DefaultLayout,
        pageTitle: 'Notes',
        linkName: 'notes',
        isAccessible: "showMasterIcon"
    },
    {
        path: '*',
        component: Dashboard,
        layout: DefaultLayout,
        pageTitle: '',
        linkName: 'quickaccess',
        isAccessible: 'showMasterIcon'
    }
]
