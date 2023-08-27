import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import DayTaskView from "@/views/DayTaskView.vue";
import WelcomeView from "@/views/WelcomeView.vue";
import ColorPickerTest from "@/views/ColorPickerTest.vue";

const routes: Array<RouteRecordRaw> = [
    {
        name: 'daytask',
        path: '/',
        alias: '/daytask/:date',
        component: DayTaskView,
        props: (route) => ({date: route.params.date})
    },
    {
        name: 'welcome',
        path: '/welcome',
        component: WelcomeView
    },
    {
        name: 'colorpicker-test',
        path: '/colorpicker',
        component: ColorPickerTest
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
