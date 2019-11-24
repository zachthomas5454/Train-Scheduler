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

  // Employee Info
  console.log(name);
  console.log(destination);
  console.log(frequency);
  console.log(firstTrainTime)

  // Format the Train Start Time
  var estMinutesFormat = moment.unix(firstTrainTime).format("HH:mm");

// Calculate the minutes left for arrival
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(estMinutesFormat, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log(moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var remainder = diffTime % frequency;
  console.log(remainder);

  // Minute Until Train
  var tMinutesTillTrain = frequency - remainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Format the Train Start Time
  var estMinutesFormat = moment.unix(firstTrainTime).format("HH:mm");


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(estMinutesFormat),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

