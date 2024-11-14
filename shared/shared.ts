
export namespace FormComponents {

    interface Checkbox {
        checked: boolean
    }

    interface RadioButton {
        checked: boolean[]
    }

    interface Dropdown {
        options: string[]
    }

    interface Survey {
        title: string,
        question: string | Checkbox | RadioButton | Dropdown,
    }

}

// also, could be >> export { Checkbox, RadioButton, Dropdown, Survey }