import {Priority} from "@/data/enum/Priority";

export const langZhCn = {
    page: {
        welcome: {
            name: '欢迎',
            tipsLine: 'Emm... 好像还没有任务 <br> 点击＋新建任务',
        },
        tasks: {
            today: '今天',
            titleDate: '{date}',
            notFoundTaskGroup: '找不到任务组',
        },
        pageNotFound: '页面不存在',
    },
    menu: {
        searchPapi: '搜索任务',
        dayTask: '日任务',
        tags: '标签',
        setting: '设置',
        taskList: '任务列表',
    },
    addTaskBtn: {
        addTask: '任务',
        addTaskList: '任务列表'
    },
    taskEditor: {
        createTask: '新建任务',
        taskName: '任务名称',
        taskNamePlaceholder: '任务名称',
        taskTag: '任务标签',
        deadline: '截止时间',
        deadlinePlaceholder: '选择时间',
    },
    emojiPicker: {
        groupNames: {
            "recent": "最近使用",
            "smileys_emotion": "表情和心情",
            "people_body": "人物和身体",
            "animals_nature": "动物和自然",
            "food_drink": "食物和饮料",
            "activities": "活动",
            "travel_places": "旅行和地点",
            "objects": "物品",
            "symbols": "符号",
            "flags": "旗帜"
        },
        staticText: {
            placeholder: "搜索表情",
            skinTone: "肤色",
        }
    },
    colorPicker: {
        color: {
            gray: '灰色',
            red: '红色',
            pink: '粉色',
            grape: '葡萄紫',
            violet: '紫色',
            indigo: '靛蓝',
            blue: '蓝色',
            cyan: '青色',
            teal: '蓝绿色',
            green: '绿色',
            lime: '酸橙色',
            yellow: '黄色',
            orange: '橙色',
        },
    },
    taskCard: {
        defTaskName: '任务',
        defDeadLine: '无截止时间',
        priority: {
            [Priority.LOW]: '低',
            [Priority.MEDIUM]: '中',
            [Priority.HIGH]: '高',
            def: '无优先级'
        }
    },
    taskView: {
        completed: '已完成'
    },
    date: {
        today: '今天',
        yesterday: '昨天',
        tomorrow: '明天',
    }
}
