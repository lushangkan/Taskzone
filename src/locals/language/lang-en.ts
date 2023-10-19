import {Priority} from "@/data/enum/Priority";
import {RepeatMode} from "@/data/enum/RepeatMode";
import {ReminderMode} from "@/data/enum/ReminderMode";

export const langEn = {
    page: {
        welcome: {
            name: 'Welcome',
            tipsLine: 'I don\'t think there\'s a task yet <br> Click + to create a new task',
        },
        tasks: {
            today: 'Today',
            titleDate: '{date}',
            notFoundTaskGroup: 'Task group not found',
        },
        pageNotFound: 'Page not found',
    },
    menu: {
        searchPapi: 'Search task',
        dayTask: 'Day task',
        tags: 'Tags',
        setting: 'Setting',
        taskList: 'Task list',
    },
    addTaskBtn: {
        addTask: 'Task',
        addTaskList: 'Task list'
    },
    taskEditor: {
        createTask: 'Create task',
        taskName: 'Task name',
        taskNamePlaceholder: 'Task name',
        taskTag: 'Task tag',
        deadline: 'Deadline',
        deadlinePlaceholder: 'Select time',
    },
    emojiPicker: {
        groupNames: {
            "recent": "Recently used",
            "smileys_emotion": "Smiles & Emotion",
            "people_body": "People & Body",
            "animals_nature": "Animals & Nature",
            "food_drink": "Food & Drink",
            "activities": "Activities",
            "travel_places": "Travel places",
            "objects": "Objects",
            "symbols": "Symbols",
            "flags": "Flags"
        },
        staticText: {
            placeholder: "Search emoji",
            skinTone: "Skin tone",
        }
    },
    colorPicker: {
        color: {
            gray: 'Gray',
            red: 'Red',
            pink: 'Pink',
            grape: 'Grape',
            violet: 'Violet',
            indigo: 'Indigo',
            blue: 'Blue',
            cyan: 'Cyan',
            teal: 'Teal',
            green: 'Green',
            lime: 'Lime',
            yellow: 'Yellow',
            orange: 'Orange',
        },
    },
    taskCard: {
        defTaskName: 'Task',
        defDeadLine: 'No deadline',
        priority: {
            [Priority.LOW]: 'Low',
            [Priority.NORMAL]: 'Normal',
            [Priority.MEDIUM]: 'Medium',
            [Priority.HIGH]: 'High',
        }
    },
    taskView: {
        completed: 'Completed'
    },
    date: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
    },
    repeatMode: {
        [RepeatMode.ONLY_ONCE]: 'Only once',
        [RepeatMode.ALWAYS]: 'Every day',
        [RepeatMode.WORKDAY]: 'Workday',
        [RepeatMode.HOLIDAYS_AND_WEEKEND]: 'Weekend and holidays',
        [RepeatMode.CUSTOM]: 'Custom',
    },
    reminderMode: {
        [ReminderMode.NONE]: 'None',
        [ReminderMode.NOTIFICATION_ONLY]: 'Notification',
        [ReminderMode.VIBRATION_NOTIFICATION]: 'Vibration',
        [ReminderMode.VIBRATION_RINGTONE_NOTIFICATION]: 'Vibration & ringtone',
        [ReminderMode.ALARM]: 'Alarm',
    }

}
