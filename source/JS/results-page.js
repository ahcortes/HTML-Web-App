const localStorage = window.localStorage;
const checkmarkPATH = "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"
const xPATH = "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"
class TaskItem extends HTMLElement {
    static get observedAttributes() {
        return ['completed', 'name', 'actualpomos', 'expectedpomos']
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    
        let style = document.createElement('style')
        style.textContent = `
            .task-comp {
                border-radius: 5px;
                border: 2px rgba(235, 235, 235, 0.8);
                background-color: rgba(245, 245, 245, 0.8);
                width: 70%;
                height: 50px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding-left: 15px;
                padding-right: 15px;
                margin-left:auto;
                margin-right:auto;
                margin-bottom:15px;
            }
              .task-main {
                display: flex;
                flex-direction: row;
                align-items: center;
            }

              .task-name {
                font-family: 'Open Sans', sans-serif;
                color: black;
                font-size: 18px;
                font-style: normal;
                font-weight: 500;
                padding-left: 10px;
            }

              .actual-pomo {
                font-family: 'Open Sans', sans-serif;
                color: black;
                font-size: 18px;
                font-style: normal;
                font-weight: bold;
            }

              .expected-pomo {
                font-family: 'Open Sans', sans-serif;
                color: black;
                font-size: 15px;
                font-style: normal;
            }
        `

        const container = document.createElement('div');
        container.setAttribute('class', 'task-comp');
        const taskMain = container.appendChild(document.createElement('div'));
        taskMain.setAttribute('class', 'task-main')
        const svg = taskMain.appendChild(document.createElement("svg"));
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");
        const path = svg.appendChild(document.createElement("path"));
        this.path = path;
        path.setAttribute("d", checkmarkPATH);
        path.setAttribute("style", "fill: green;");

        const taskName = taskMain.appendChild(document.createElement("span"));
        taskName.setAttribute("class", "task-name");
        this.taskName = taskName;

        const taskInfo = container.appendChild(document.createElement('div'));
        taskInfo.setAttribute('class', 'task-info')


        const actualPomos = taskInfo.appendChild(document.createElement("span"));
        actualPomos.setAttribute("class", "actual-pomo");
        this.actualPomos = actualPomos;
        actualPomos.textContent = "0";

        const expectedPomos = taskInfo.appendChild(document.createElement("span"));
        expectedPomos.setAttribute("class", "expected-pomo");
        this.expectedPomos = expectedPomos;
        expectedPomos.textContent = "0";

        

        this.shadowRoot.append(style, container)

    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name == "name"){
            this.taskName.textContent = newValue;
        }
        else if (name == "actualpomos"){
            this.actualPomos.textContent = newValue;
        }
        else if (name == 'expectedpomos'){
            this.expectedPomos.textContent = newValue;
        }
        else if (name == "completed") {
            updatePath(newValue);
        }
    }  

    updatePath(compValue){
        if (compValue == "true"){
            this.path.setAttribute("d", checkmarkPATH);
            if (Number(this.actualPomos.textContent) > Number(this.expectedPomos.textContent)) {
                this.path.setAttribute("style", "fill:yellow")
            }
            else {
                this.path.setAttribute("style", "fill:green")
            }
        }
        else {
            this.path.setAttribute("d", xPATH);
            this.path.setAttribute("style", "fill:red")
        }
        
    }
}

customElements.define('task-item', TaskItem);




/**
 * Populates the tasks completed and tasks left to do
 * by checking the tasks stored in local storage once
 * the page loads
 */
window.addEventListener('DOMContentLoaded', () => {
    populateTasks();
});

/**
 * Using the local storage, populates the two ordered lists containing
 * completed and uncompleted tasks.
 */
function populateTasks(){
    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    if (!localStorage.getItem('tasks')) {
        //console.log("There are no tasks in the storage?");
        checkEmpty();
    }
    else {
        const data = JSON.parse(localStorage.getItem('tasks'));
        for (let i = 0; i < data.length; i++ ) {
            if (data[i].completed === true){
                let item = completedItems.appendChild(document.createElement("li"));
                item.setAttribute('class', 'li-task');
                item.textContent = `${data[i].taskdescription} (${data[i].actualpomos} pomos)`;
            }
            else if (data[i].completed === false){
                let item = uncompletedItems.appendChild(document.createElement("li"));
                item.setAttribute('class', 'li-task');
                item.textContent = `${data[i].taskdescription} (${data[i].actualpomos} pomos)`;
            }
        }
        checkEmpty();
    }
}


/**
 * Checks to see whether either the completed items or uncompleted items 
 * arrays are empty or not and appropriately adds a message if so
 */
function checkEmpty(){
    const completedItems = document.getElementById('complete-items');
    const uncompletedItems = document.getElementById('uncomplete-items');
    let complete_count = completedItems.childNodes.length - 1;
    let uncomplete_count = uncompletedItems.childNodes.length - 1;
    const message = document.getElementById('message');
    if (complete_count <= 0) {
        let complete_error = completedItems.appendChild(document.createElement("p"));
        complete_error.setAttribute('class', 'p-body');
        complete_error.textContent = `No tasks completed`;
        
    }
    if (uncomplete_count <= 0) {
        let uncomplete_error = uncompletedItems.appendChild(document.createElement("p"));
        uncomplete_error.setAttribute('class', 'p-body');
        uncomplete_error.textContent = `No tasks uncompleted`;
        if (complete_count > 0) {
            message.textContent = `Congratulations! You finished all your tasks this session!`;
        }
    }
}

module.exports = {populateTasks, checkEmpty};