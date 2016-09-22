var innerHTML = "";
//Login


function userLogin() {
	var x = document.getElementById("loginForm");
	var text = "";
	var i;
	var firebaseElements = [];
	for (i = 0; i < x.length; i++) {
		firebaseElements[i] = x.elements[i].value;
	}
	var user = firebase.auth().currentUser;

	firebase.auth().signInWithEmailAndPassword(firebaseElements[0], firebaseElements[1]).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		if(errorCode){
  			console.log(errorCode);
  		} else {
  			console.log(user);
  			console.log(firebaseElements[0]);
  		}
  	});

	var user = firebase.auth().currentUser;
	if(user){
		if(user.displayName === null){
			var splitEmail = user.email.split("@");
			user.updateProfile({
				displayName: splitEmail[0]
			});
			window.location = "messages.html";
		} else {
			window.location = "messages.html";
		}
	}
}
//Register
function userRegister(){
	var x = document.getElementById("registerForm");
	var i;
	var firebaseElements = [];
	for (i = 0; i < x.length; i++){
		firebaseElements[i] = x.elements[i].value;
	}
	var user = firebase.auth().currentUser;
	firebase.auth().createUserWithEmailAndPassword(firebaseElements[0], firebaseElements[1]).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode);
		if(errorCode === "auth/email-already-in-use"){
			console.log(errorCode);
		} else if (errorCode === "auth/invalid-email"){
			console.log(errorCode);
		} else if (errorCode === "auth/operation-not-allowed"){
			console.log(errorCode);
		} else if (errorCode === "auth/weak-password"){
			console.log(errorCode);
		} else {
			if(errorCode !== "" || errorCode !== null){
				console.log(errorCode);
			} else {
				console.log("Success");
			}

		}
	});	
	firebase.auth().signOut();

} 

function checkAuthenticationState(){
	firebase.auth().onAuthStateChanged(function(user){
		if(user){
			console.log("User Logged In!");
			return true;
		} else {
			window.location= "login.html";
			return false; 
		}
	})
}

function userSignOut(){
	firebase.auth().signOut().then(function(){
		console.log("Sign Out");
		window.location = "login.html";
	}, function(error){
		console.log("There was an error signing out");
	});
}

function sendMessage(){
	var message = document.getElementById("message");
	var database = firebase.database();
	var currentDisplayName = firebase.auth().currentUser.displayName;

	if(message.value.length > 140){
		alert("Message too long");
	} else {

		database.ref("messages").push().set({
			user: currentDisplayName,
			message: message.value
		});
	}

}

function retrieveArray(){
	var user = "";
	var message = "";
	var database = firebase.database().ref("messages");
	
	database.orderByKey().limitToLast(10).on("value", function(snapshot){
		console.log(snapshot.val().message);
	});	
}

function retrieveMessages(){
	var user = "";
	var message = "";
	var database = firebase.database().ref("messages");
	
	database.orderByKey().limitToLast(10).on("child_added", function(snapshot){
		console.log(snapshot.val().message);
		innerHTML = innerHTML + "<div class = 'messageBox'><p class = '" + userClass(snapshot.val().user) +"'>Username: " + snapshot.val().user + "</p>"
		+ "<p class = '" + userClass(snapshot.val().user) + "'>" + snapshot.val().message + "</p></div>"; 

		if(innerHTML != ""){
			displayMessage(innerHTML);
		} else {
			console.log("empty");
		}
	});

}

function displayMessage(message){
	$('.messages').html(message);
	$('.messageBox').css('border-bottom', '1px solid black');
	$('.userCurrent').css('color', 'blue');
	$('.userNotCurrent').css('color', 'green');
}
function userClass(username){
	if(username != firebase.auth().currentUser.displayName){
		return "userNotCurrent";
	} else {
		return "userNotCurrent";
	}

}
