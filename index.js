
// -------------------------------------------------------
//Database Reference: The First line of the code below has a reference to the main root of the Firebase database. The second line has a reference to the users key root of the database. If we want to get all the values of the users, we simply use users root.
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');
// -------------------------------------------------------

// -------------------------------------------------------
// userListUI: Get a DOM element reference for userList
const userListUI = document.getElementById("userList");
const userDetailUI = document.getElementById("userDetail");
//Get User List using Child_Added() method:
// usersRef.on("child_added", snap => {
//     let user = snap.val();
//     let $li = document.createElement("li");
//     $li.innerHTML = user.name;
//     $li.setAttribute("child-key", snap.key); 
//     $li.addEventListener("click", userClicked)
//     userListUI.append($li);
// });

usersRef.on("value", snap => {

    userListUI.innerHTML = ""
    userDetailUI.innerHTML = "<p> click on a user to view their details </p>"

    snap.forEach(childSnap => {

        let key = childSnap.key,
            value = childSnap.val()
          
        let $li = document.createElement("li");

        // edit icon
        let editIconUI = document.createElement("button");
        editIconUI.class = "edit-user";
        editIconUI.innerHTML = " ✎";
        editIconUI.setAttribute("userid", key);
        editIconUI.addEventListener("click", editButtonClicked)

        // delete icon
        let deleteIconUI = document.createElement("button");
        deleteIconUI.class = "delete-user";
        deleteIconUI.innerHTML = " ☓";
        deleteIconUI.setAttribute("userid", key);
        deleteIconUI.addEventListener("click", deleteButtonClicked)
        
        $li.innerHTML = `<a user-key="${key}" onclick="userClicked(event)" class="userLink">${value.name}</a>`;
        $li.className = "a_user"
        $li.append(editIconUI);
        $li.append(deleteIconUI);
        userListUI.append($li);

     });


})
// ^^^ child_added: Attach a child_added event to the userRef database reference object. It is a Firebase event similar to click event in JavaScript and it typically retrieves a list of items from the Firebase database.
// callback: This event takes TWO arguments,  a string “child_added” and the callback which will run on each interaction.
// snap: In each interaction snap object, which is a parameter of the callback,  will hold information about a single user item that we can have access to.
// snap.key: This will hold an index number of each user item as we store them in an array in our Firebase Database JSON tree structure.
// snap.val(): val() function will return user object so that we can access any item in that object using dot notation.
// snap: Assign each user object to a variable user, at this point I would just need only one value out of the user object which is .name.
// li.innerHTML: Create li element and set the name of the user using user.name value.
// child-key: Set an attribute called child-key to li which will have the key of each li.
// child-key: Set an attribute called child-key to li which will have the key of each li.
// userClicked: Attach click event to li so that if any user clicks on the left we can show more information on the right.
// append: This will add li to ul on every iteration.
// -------------------------------------------------------


// -------------------------------------------------------
//Show User Detail on li click:
function userClicked(e) {
  
    var userID = e.target.getAttribute("user-key");
    const userRef = dbRef.child('users/' + userID);

    const userDetailUI = document.getElementById("userDetail");
    userDetailUI.innerHTML = ""
  
    userRef.on("child_added", snap => {
        var $p = document.createElement("p");
        $p.innerHTML = snap.key + " - " + snap.val()
        userDetailUI.append($p);
    });

    
    e.preventDefault()
  
}
// ^^^ userID: get the child-key attribute on clicking the username (li)
// userRef: This time the root is “users/” +  userID. which will give us a specific user object when we use child_added event.
// child_added:  get the snap object on each iteration which will have all the key-value pairs of a user object.
// Finally, add each key and value into p element then append them into userDetailUI DOM element.
// -------------------------------------------------------


// At this state, you should have an application that can talk to Firebase database and retrieve data to the browser using vanilla JavaScript.

// I recommend using push unique key because it has a timestamp in it to avoid overwrites when multiple users push() data at the same time.
// I hope I convinced you to use push() method. 🙂

// Oh. Let me explain other two methods set() and update() later in the  STEP #2 Update section.

// PART 2, STEP 1: ADD DATA
// -------------------------------------------------------
// Attach Click Event to the Add User Button: Cache #add-user-btn DOM element which is inside the Add User Form. Then, attach a click event to it with the callback function addUserBtnClicked().
const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked);

// Create a new user Object: Inside the call back function, create a Firebase Database reference path where you want to insert the new user data.
function addUserBtnClicked(){

    // then, Get all the input fields from the Add User Form and cache them into an array variable addUserInputsUI like so.
    const addUserInputsUI = document.getElementsByClassName("user-input");

    // this object will hold the new user information
    let newUser = {};

    // Now, Loop though addUserInputsUI array that has three input fields. 
    // loop through View to get the data for the model 
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

        // Then, Inside each iteration get the value of input attribute data-key and store it into the variable 'key'.
        let key = addUserInputsUI[i].getAttribute('data-key');
        // After that… create another variable called 'value' and store in it the actual user typed value.
        let value = addUserInputsUI[i].value;
        
        // Assign the 'key' and 'value' variables to the newUser object on each iteration. So, you will have an object something like this.
        // {
        //     "age" : "21",
        //     "email" : "rtamil@email.com",
        //     "name" : "Raja Tamil"
        // }
        newUser[key] = value;

    }

    // Push it to the Firebase Database:  Finally, push() method will go ahead insert the new user data to the Firebase Database in a given path which is in usersRef.
    usersRef.push(newUser, function(){
        console.log("data has been inserted");
    })

}

// That’s simple eh!
// As you notice, my user list on the browser has been updated automatically because I am using Firebase event called value to get a list of users.
// The cool thing about value event is that it’s triggered whenever there is a change which could be Add, Delete or Edit in the database reference that this event runs on. 
// -------------------------------------------------------


// -------------------------------------------------------
// PART 2, STEP 2: UPDATE DATA

// You can either use Update() or Set() to make any change to an existing user data.

// Let’s take a look at Update first…

// Update(data, callback):
// • You can make changes to one or more values of a user using update(). For example, If I want to update just a name,  I can do it without affecting other keys such as name and age.


// • What happens if I send an object that has a key which is not in the Firebase Database? well, the cool thing about the update() method is whenever there is a key match, this method will update the value of it.

// • If there is no key match, then update() method will insert it in as a new key.

// On the other hand,

// Set(data, callback):

// • set() method will replace everything in a given Firebase Database Reference path. For example, if the javascript object that you’re going to update, has the only {name: “raja”}, set() method will overwrite everything in that specific path and all other keys will be deleted. It’s kind of dangerous because you may lose data without knowing. 

// • If you want to intentionally change any user object value to be null, set() method would be great for it.


function editButtonClicked(e){

    // Show Edit Form with the User Data: Get the Edit User Form DOM element and set the display property to block which makes the Form visible.
    // show the Edit User Form
    document.getElementById('edit-user-module').style.display = "block";

    // Then, assign user id which you get from the edit button with an attribute userid to the hidden <input> text field edit-userid. So that I will have user id is available when I click the save button from the Edit From to update the user data later.
    //set user id to the hidden input field
    document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

    // After that,  create a Firebase Database reference path where to get selected user data by userid.
    const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));

    // Next, create a variable that will have all the input fields from the Edit User Form
    // set data to the user field
    const editUserInputsUI = document.querySelectorAll(".edit-user-input");

    // Now, I am going to define a firebase event called  “value” on the userRef variable. The second argument in that event is a call back function with parameter snap which will have the selected user data.
    userRef.on("value", snap => {
        
        for(var i = 0, len = editUserInputsUI.length; i < len; i++) {
            var key = editUserInputsUI[i].getAttribute("data-key");
            editUserInputsUI[i].value = snap.val()[key];
        }

    });
    // ^^^ Inside that callback event, loop through the editUserInputsUI array and get the value of an attribute data-key on each iteration and store it in a variable key. So that I can assign an appropriate value from snap.val()[key] to the input field.

    // At this stage, a user will be able to see the Edit User Form with selected user data filled in when the edit button is clicked.

    // Save the updated user data on to the Firebase Database: When a user makes some changes and hit save button, the edited data will be saved to the Firebase database.
    // To do that, Get a save button and attach a click event to that with the callback function editButtonClicked(). 
    const saveBtn = document.querySelector("#edit-user-btn");
    saveBtn.addEventListener("click", saveUserBtnClicked)
    // ^^ As you can see I have created saveBtn and  attach click event with the callback function saveUserBtnClicked. 

}


function saveUserBtnClicked(){

    // Inside the callback function, create variable that will have the userid value which you can get it from the hidden text field.
    const userID = document.querySelector(".edit-userid").value;

    // Then, create a database reference where you want to update the new changes. 
    const userRef = dbRef.child('users/' + userID);

    // After that, create an empty object that I will store the updated data  from the user input fields.
    var editedUserObject = {}

    // Get all the <input> fields from Edit User Form and store them in an array editUserInputsUI. 
    const editUserInputsUI = document.querySelectorAll(".edit-user-input");

    //Now, Loop though editUserInputsUI array and in each iteration get the value from the <input> attribute data-key and store it in the key variable and get the user typed value from <input> field and store in the variable value.
    editUserInputsUI.forEach(function(textField) {
        
        // Then, assign the 'key' and 'value' variables to the 'editedUserObject' object on each iteration.
        let key = textField.getAttribute("data-key");
        let value = textField.value;
        editedUserObject[textField.getAttribute("data-key")] = textField.value
    });
    // Now, you will have an object that is ready to update.

    // Finally, user update() method.
    userRef.update(editedUserObject, function(){

        console.log("user has been updated"); 

    });

    // One more thing, I need to do for the usabliltiy purpose which is to hide the Edit User Form when a user clicks the save button.
    document.getElementById('edit-user-module').style.display = "none";
    
}
// -------------------------------------------------------

// -------------------------------------------------------
//PART 2, STEP 3: DELETE DATA

// remove(data, callback)
// The remove() method will remove everything from a given database reference path and it takes two arguments, one is the data in this case user id and the callback function that will run once the delete operation is completed.

// If you want to keep the userid and remove all the data inside it, you could use set() to replace with null

//  Add a Delete Icon to the <li>

// delete icon
// let deleteIconUI = document.createElement("span");
// deleteIconUI.class = "delete-user";
// deleteIconUI.innerHTML = " ☓";
// deleteIconUI.setAttribute("userid", key);
// deleteIconUI.addEventListener("click", deleteButtonClicked)

// $li.append(deleteIconUI)

function deleteButtonClicked(e) {
    e.stopPropagation();
    const userID = e.target.getAttribute("userid");
    const userRef = dbRef.child('users/' + userID);
    userRef.remove()
  }