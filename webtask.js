"use latest";
var firebase = require('firebase');
module.exports = (ctx, cb) => {
    var config = {
        apiKey: ctx.secrets.apiKey,
        authDomain: ctx.secrets.authDomain,
        databaseURL: ctx.secrets.databaseURL,
        projectId: ctx.secrets.projectId,
        storageBucket: ctx.secrets.storageBucket,
        messagingSenderId: ctx.secrets.messagingSenderId
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    /**
     * Gets the Firebase reference for a particular user's todos
     */
    var todosRef = firebase.database().ref(`${ctx.body.user_id}/todos`);

    /**
     * Transforms a an object of objects to an array of objects
     * Needed so we can map through the collection of todos Firebase sends back
     * @param object
     * @returns {Array}
     */
    var toArray = (object) => {
        var arr = [];
        for (var key in object) {
            arr.push(object[key]);
        }
        return arr;
    };
    /**
     * Random number used as the key and id for our todos
     * @returns num
     */
    var generateId = Math.floor(Math.random() * 100000);
    /**
     * Returns collection of all todos
     */
    var getTodos = () => todosRef.once("value");
    /**
     * Adds a todo to Firebase
     * @param todo
     */
    var addToDo = (todo) => {
        var id = generateId();
        todosRef.child(`${id}`).set({
            id: id,
            complete: false,
            name: todo
        });
    };
    /**
     * Updates a todo at a particular id
     * @param id
     * @param todo
     */
    var updateTodo = (id, todo) => {
        todosRef.child(`${id}`).update({
            name: todo
        });
    };
    /**
     * Sets the todo to completed
     * @param id
     */
    var completeTodo = (id) => {
        todosRef.child(`${id}`).update({
            complete: true
        });
    };
    /**
     * Deletes a todo of a particular ID
     * @param id
     */
    var deleteTodo = (id) => todosRef.child(`${id}`).remove();
    /**
     * Breaks the ctx.body.text so it can be parsed for commands and the todo body
     * @type {Array}
     */
    var bodyArray = ctx.body.text.split(" ");
    /**
     * Command to be run
     */
    var command = bodyArray[0];
    // switch case that parses the command
    switch (command) {
        case 'add':
            var todo = bodyArray.slice(1, bodyArray.length).join(" ");
            addToDo(todo);
            cb(null, {"text": `Awesome! Added the follow todo:\n${todo}`});
            break;
        case 'update':
            var todo = bodyArray.slice(2, bodyArray.length).join(" ");
            updateTodo(bodyArray[1], todo);
            cb(null, {'text': `Success! Updated todo ${todo}`});
            break;
        case 'complete':
            completeTodo(bodyArray[1]);
            cb(null, {'text': `Success! Completed todo  ${bodyArray[1]}`});
            break;
        case 'delete':
            deleteTodo(bodyArray[1]);
            cb(null, {'text': `Success! Deleted todo ${bodyArray[1]}`});
            break;
        case 'help':
            cb(null, {
                "attachments": [{
                    "fallback": "Here's a summary of the commands available to you.",
                    "color": "#36a64f",
                    "title": "Slack TODO Help",
                    "text": "Hey there, @${ctx.body.user_name}. I heard you needed some help.\n Here's a list of all available commands.\nAll commands should be ran with '/wt todo'",
                    "fields": [
                        {"title": "help", "value": "Lists out all available commands"},
                        {"title": "no command", "value": "Running simply '/wt todo' without a command will return all todos"},
                        {"title": "add {todo to add}", "value": "Command for adding a new todo"},
                        {"title": "complete {todoId}", "value": "Completes the todo of the appropriate ID"}
                    ]
                }]
            });
            break;
        default:
            getTodos().then(snapshot => {
                var todos = toArray(snapshot.val());
                var message = {
                    "attachments": [{
                        "fallback": "Here's a summary of the todos left to do.",
                        "color": "#36a64f",
                        "title": "Available Todos",
                        "text": `Hey there, @${ctx.body.user_name}. Here's the todos you have left to do.`,
                        "fields": todos.map(todo => {
                            var completed = todo.complete ? 'COMPLETED' : 'NOT COMPLETE';
                            return {"title": `ID: ${todo.id}`, "value": `TODO: ${todo.name} // ${completed}`};
                        })
                    }]
                };
                cb(null, message);
            });
    }
};
