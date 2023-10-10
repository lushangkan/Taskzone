import {Priority} from "@/data/enum/Priority";

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
            [Priority.MEDIUM]: 'Medium',
            [Priority.HIGH]: 'High',
            def: 'No priority'
        }
    },
    taskView: {
        completed: 'Completed'
    },
    date: {
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
    }

}
