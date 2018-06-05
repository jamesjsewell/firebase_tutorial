
// -------------------------------------------------------
//Database Reference: The First line of the code below has a reference to the main root of the Firebase database. The second line has a reference to the users key root of the database. If we want to get all the values of the users, we simply use users root.
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');
// -------------------------------------------------------

// -------------------------------------------------------
// userListUI: Get a DOM element reference for userList
const userListUI = document.getElementById("userList");

//Get User List using Child_Added() method:
usersRef.on("child_added", snap => {
    let user = snap.val();
    let $li = document.createElement("li");
    $li.innerHTML = user.name;
    $li.setAttribute("child-key", snap.key); 
    $li.addEventListener("click", userClicked)
    userListUI.append($li);
});
// child_added: Attach a child_added event to the userRef database reference object. It is a Firebase event similar to click event in JavaScript and it typically retrieves a list of items from the Firebase database.
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

    var userID = e.target.getAttribute("child-key");

    const userRef = dbRef.child('users/' + userID);

    const userDetailUI = document.getElementById("userDetail");
    userDetailUI.innerHTML = ""
  
    userRef.on("child_added", snap => {
        var $p = document.createElement("p");
        $p.innerHTML = snap.key + " - " + snap.val()
        userDetailUI.append($p);
    });
  
}

// userID: get the child-key attribute on clicking the username (li)
// userRef: This time the root is “users/” +  userID. which will give us a specific user object when we use child_added event.
// child_added:  get the snap object on each iteration which will have all the key-value pairs of a user object.
// Finally, add each key and value into p element then append them into userDetailUI DOM element.
// -------------------------------------------------------

//At this state, you should have an application that can talk to Firebase database and retrieve data to the browser using vanilla JavaScript.

//I recommend using push unique key because it has a timestamp in it to avoid overwrites when multiple users push() data at the same time.
//I hope I convinced you to use push() method. 🙂

// Oh. Let me explain other two methods set() and update() later in the  STEP #2 Update section.

// Attach Click Event to the Add User Button: Cache #add-user-btn DOM element which is inside the Add User Form. Then, attach a click event to it with the callback function addUserBtnClicked().
const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked);

// Create a new user Object: Inside the call back function, create a Firebase Database reference path where you want to insert the new user data.
const usersRef = dbRef.child('users');

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
    
    //Assign the 'key' and 'value' variables to the newUser object on each iteration. So, you will have an object something like this.
    // {
    //     "age" : "21",
    //     "email" : "rtamil@email.com",
    //     "name" : "Raja Tamil"
    // }
    newUser[key] = value;

}