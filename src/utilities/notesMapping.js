export const options = [
    { key: 'Business', text: 'Business'  , value: 'Business' },
    { key: 'Cooking', text: 'Cooking', value: 'Cooking' },
    { key: 'Health' , text: 'Health' , value: "Health"},
    { key: 'Wellness' ,text: 'Wellness', value: 'Wellness'},
    { key: 'Coding' , text: 'Coding' , value: "Coding"}
]

export const privacyOptions = [
    { key: 'public', text: 'Public'  , value: 'public' },
    { key: 'private', text: 'Private', value: 'private' }   
]

export const importanceOptions = [
    {key: 1, text: "Important", value: 1},
    {key: 2, text: "Normal" , value: 2},
    {key: 3, text: "Not Important" , value: 3}
]


export const colors = {
    Business: "red",
    Cooking: "yellow",
    Wellness: "purple",
    Coding: "black",
    Health:  "green"
}

export const importanceMapping = {
    1: {
        label: "Important",
        color: "red",
    },
    2: {
        label: "Normal",
        color : "yellow"
    },
    3: {
        label: "Not Important",
        color: "blue"
    }
} 




