/* global moment firebase */

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAl9XpNzwdS5ishYZaNOrqXwGKqJEW70o0",
  authDomain: "bootcamp-91e84.firebaseapp.com",
  databaseURL: "https://bootcamp-91e84.firebaseio.com",
  projectId: "bootcamp-91e84",
  storageBucket: "bootcamp-91e84.appspot.com",
  messagingSenderId: "139130417508",
  appId: "1:139130417508:web:e5f41d6580e213ede94a71",
  measurementId: "G-BXYMHP4JBB"
};

firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
var database = firebase.database();

$("#submitButton").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var name = $("#name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var firstTrainTime = moment($("#fttime-input").val().trim(), "HH:mm").format("X");

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    nm: name,
    dest: destination,
    freq: frequency,
    firstTrnTm: firstTrainTime,
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#fttime-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {

  // Store everything into a variable.
  var name = childSnapshot.val().nm;
  var destination = childSnapshot.val().dest;
  var frequency = childSnapshot.val().freq;
  var firstTrainTime = childSnapshot.val().firstTrnTm;

  // Format the Train Start Time
  var firstTrainTimeFormat = moment.unix(firstTrainTime).format("HH:mm");

  // Calculate the minutes left for arrival
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTrainTimeFormat, "HH:mm").subtract(1, "years");

  // Current Time
  var currentTime = moment();

  // Difference between the times
  var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var remainder = diffTime % frequency;
  
  // Minute Until Train
  var tMinutesTillTrain = frequency - remainder;
  
  // Arrival Time
  // Format the Arrival Time
  var arrivalTime = currentTime.add(tMinutesTillTrain, "minutes");
  var estTimeFormat = moment(arrivalTime).format("HH:mm");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(estTimeFormat),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

