const fs = require('fs')
const path = require('path')
const { threadId } = require('worker_threads')
const ps = require('prompt-sync')()
const currentDate = new Date()

let key_list = ["name", "description", "status", "create", "update"]
let name, description, id, status, date_create, date_update
let filePath = './tasks/tasks.json'

function create_task() {
    let data_json

    console.log('Start reading')
    fs.readFile(filePath, 'utf-8', (err,data) => {
        if (err) throw err;
        console.log('Data has been read')

        data_json = JSON.parse(data)
        
        for (id = 0; data_json[id] != null; id++) {
            console.log(id)
        }

        date_create = `${currentDate.getHours()}:${currentDate.getMinutes()}`

        console.log(`Creating a task with these parameters: 
            - Name: ${name}, 
            - Description: ${description}, 
            - id: ${id}, 
            - Status: ${status}, 
            - Creation date: ${date_create}, 
            - Update date: ${date_update}`)
                
        data_json[id] = {'name': name, 'description': description, 'status': status, 'create': date_create, 'update': date_update}
        data_json = JSON.stringify(data_json,null,2)

        fs.writeFile(filePath, data_json,'utf-8', (err) => {
            if (err) throw err;
            console.log('The task has been created!')
        })
    });
}

function update_task(id, n_name, n_description, n_status) {
    let data_json

    fs.readFile(filePath, 'utf-8', (err,data) => {
        if (err) throw err;

        data_json = JSON.parse(data)

        if (!data_json[id]) {
            console.log('ERROR. Updating is not possible!')
            process.exit()
        }

        if (n_name != ''){
            data_json[id]['name'] = n_name
        }
        if (n_description != ''){
            data_json[id]['description'] = n_description
        }
        if (n_status != ''){
            data_json[id]['status'] = n_status
        }
        data_json[id]['update'] = `${currentDate.getHours()}:${currentDate.getMinutes()}`
        data_json = JSON.stringify(data_json,null,2)

        fs.writeFile(filePath, data_json,'utf-8', (err) => {
            if (err) throw err;
            console.log('The task has been updated!')
        })
    })
}

function delete_task(id_delete) {
    let data_json

    fs.readFile(filePath, 'utf-8', (err,data) => {
        if (err) throw err;

        data_json = JSON.parse(data)

        if (data_json[id_delete] == null) {
            console.log('There is no task with this id!')
            process.exit()
        }

        delete data_json[id_delete]

        let deletedJsonData = JSON.stringify(data_json, null, 2)

        fs.writeFileSync(filePath, deletedJsonData, 'utf-8')

        console.log(`Task ${id_delete} has been deleted!`)
    })
}

function list_tasks() {
    let data_json
    fs.readFile(filePath, (err,data) => {
        console.log('The list has been read!')

        data_json = JSON.parse(data)

        for (let idl = 0; data_json[idl] != null; idl++) {
            console.log(idl)
            key_list.forEach(function(item,_i,_arr) {
                console.log(item,data_json[idl][item])
            })
        }
    })
}

function debug_file_n_dir() {
    console.log('Start of check...')

    try {
        fs.accessSync('./tasks')
        console.log('Folder found!')
    } catch (err) {
        console.log('Folder not found! Creating a folder...')
        fs.mkdirSync('tasks')
        console.log('The folder has been created!')
    }

    try {
        fs.accessSync('./tasks/tasks.json')
        console.log('The file has been found!')
    } catch (err) {
        console.log('the file was not found! Creating a file...')
        fs.writeFileSync(filePath,'{}')
        console.log('The file was successfully created!')
    }

    console.log('Check completed!')
}

function program() {
    debug_file_n_dir()

    console.log('Create, update, delete, list')
    let command = ps('Enter the command:')
    
    if (command == 'create') {
        name = ps('Enter the task name: ')
        description = ps('Enter a brief description of the task:')
        status = ps('Enter task status: ')
        create_task()

    } else if (command == 'update') {
        id = ps('Which task do you want to update? Enter her id:')
        let new_name = ps('Enter a new name (leave it blank if you do not need to update it): ')
        let new_description = ps('Enter a new description (leave it blank if you do not need to update it): ')
        let new_status = ps('Enter a new status (leave it blank if you do not need to update it): ')

        update_task(id,new_name,new_description,new_status)

    } else if (command == 'delete') {
        id = ps('Which task do you want to delete? Enter her id: ')
        delete_task(id)

    } else if (command == 'list') {
        list_tasks()
    
    } else if (command == 'exit') {
        console.log('Completing the program...')
        process.exit()
    
    } else {
        console.log('Error. Unknown team!')
    }
}

program()
