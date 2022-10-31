import { LightningElement, track } from 'lwc';
import getTasks from '@salesforce/apex/todoListApp.getTasks';
import updateTasks from '@salesforce/apex/todoListApp.updateTasks';
import deleteTask from '@salesforce/apex/todoListApp.deleteTask';

// import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TodoListApp extends LightningElement {

    @track newTaskList = [];
    @track removeValue;
    // addedValue;
    newTask = '';

    processing = true;

    connectedCallback() {
        this.getTasksMethod();
    }

    addNewTask(event) {
        // console.log(JSON.stringify(event.target));
        this.newTask = event.target.value;
        // this.addedValue = this.newTask;
        console.log(' this.newTask---', this.newTask);
    }
    handleAddButtonClick(event) {
        // this.newTaskList.push({
        //     id: this.newTaskList.length + 1,
        //     name: this.newTask
        // })
        // this.newTask = '';
        console.log(' this.newTask---', this.newTask);
        this.processing = true;

        if (this.newTask == '') {  //if we not add any new task in input box then-
            this.processing = false; //-it shouldn't add in the list and return the previoud list only.
            return;
        }


        updateTasks({ Subject: this.newTask })
            .then(response => {
                var temp = JSON.parse(JSON.stringify(response)); //isme to bs updated wala aaya hai
                console.log('temp', JSON.stringify(temp));
                this.getTasksMethod();
                this.newTask = '';
                //this.processing = false;
            })
            .catch(error => {
                console.log('error', error);
                //this.processing = false;
            })
            .finally(() => this.processing = false);


    }
    deleteTaskHandler(event) {

        let idToDelete = event.currentTarget.dataset.id; // jise delete krna ho // id --2
        console.log('idToDelete', idToDelete);
        let taskListArray = this.newTaskList;
        console.log('taskListArray', JSON.stringify(taskListArray));
        let taskListIndex;
        let recordIdToDelete;
        this.processing = true;
        // this.newTaskList = this.newTaskList.filter(value => value != this.removeValue);

        // console.log(' this.newTaskList', JSON.stringify(this.newTaskList));
        // for (var i = (this.newTaskList.length); i >= 0; i--) {
        //     console.log('iiiii');
        //     if (i == id1) {
        //         list.remove(id1);
        //     }
        // }

        // Method 1 ---->   by using for loop and getting the index from list (means the item) to delete
        for (let i = 0; i < taskListArray.length; i++) {
            if (idToDelete == taskListArray[i].Id) {
                taskListIndex = i;
            }
        }

        recordIdToDelete = taskListArray[taskListIndex].Id;
        console.log('recordIdToDelete--------', recordIdToDelete);

        deleteTask({ deleteTaskId: recordIdToDelete })
            .then(response => {
                console.log('response is====', response);
            })
            .catch(error => {
                console.log('error', error);
            })
            .finally(() => this.processing = false);


        taskListArray.splice(taskListIndex, 1);
        console.log('taskListArray', taskListArray);

        /*

        //Method 2---> in js we have 
        // findIndex() which is used to find the  index  from an array.


        */

        /*   var found = taskListArray.findIndex(function (index) {
               return index.id == idToDelete;
           })
           console.log('found', found);
           taskListArray.splice(found, 1);
   
   
           */

        //Method 3 ---> directly use splice and 1 line function

        // taskListArray.splice(taskListArray.findIndex(function (index) {
        //     return index.id == idToDelete;
        // }), 1);

        //        taskListArray.splice(taskListArray.findIndex(index => index.id == idToDelete), 1);


        /*  deleteRecord('00T5i00000kuoCNEAY')  // wonlt work because - Object Task is not supported in UI API
              .then(() => {
                  console.log('deletion');
                  this.dispatchEvent(
                      new ShowToastEvent({
                          title: 'Success',
                          message: 'Task deleted',
                          variant: 'success'
                      })
                  );
                  this.getTasksMethod();
                  
              })
              .catch(error => {
                  this.dispatchEvent(
                      new ShowToastEvent({
                          title: 'Error deleting record',
                          message: error.body.message,
                          variant: 'error'
                      })
                  );
              });*/
    }



    getTasksMethod() {
        getTasks()
            .then(response => {
                //console.log('response', JSON.stringify(response));
                var temp = JSON.parse(JSON.stringify(response));
                this.newTaskList = response;
                console.log(' this.newTaskList+++++', JSON.stringify(this.newTaskList));
                if (response) {
                    this.processing = false;
                }
            })
            .catch(error => {
                console.log('error');
            })
    }

    refreshHandler() {
        this.processing = true;
        this.getTasksMethod();
    }
}