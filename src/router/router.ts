import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import TaskView from "@/views/TasksView.vue";
import WelcomeView from "@/views/WelcomeView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        name: 'tasks',
        path: '/',
        alias: ["/tasks/:taskGroupId", '/tasks/day/:date'],
        component: TaskView,
        props: (route) => ({date: route.params.date, taskGroupId: route.params.taskGroupId})
    },
    {
        name: 'welcome',
        path: '/welcome',
        component: WelcomeView
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
