$(document).ready(function() {
    // Function to handle form submission for Personal Info
    $("#form").submit(function(event) {
      event.preventDefault(); // Prevent default form submission
  
      // Retrieve form data
      var firstName = $("#Fname1").val();
      var lastName = $("#Lname1").val();
      var date = $("#date").val();
      var phoneNumber = $("#phone").val();
      var lNumber = $("#Lnum").val();
  
      // Do something with the form data (you can customize this part)
      console.log("Personal Info:");
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Date:", date);
      console.log("Phone Number:", phoneNumber);
      console.log("L Number:", lNumber);
    });
  
    // Function to handle form submission for Survey
    $("#form2").submit(function(event) {
      event.preventDefault(); // Prevent default form submission
  
      // Retrieve form data
      var activities = [];
      $("input[name='bunjump']:checked").each(function() {
        activities.push($(this).val());
      });
      $("input[name='zline']:checked").each(function() {
        activities.push($(this).val());
      });
      $("input[name='sdive']:checked").each(function() {
        activities.push($(this).val());
      });
      $("input[name='flying']:checked").each(function() {
        activities.push($(this).val());
      });
      $("input[name='desert']:checked").each(function() {
        activities.push($(this).val());
      });
  
      var landmark = $("input[name='Paris']:checked").val() || $("input[name='India']:checked").val() || $("input[name='China']:checked").val();
      var food = $("#dest").val();
      var places = $("#text").val();
  
      // Do something with the form data (you can customize this part)
      console.log("Survey:");
      console.log("Activities:", activities);
      console.log("Landmark:", landmark);
      console.log("Food:", food);
      console.log("Places:", places);
    });
  });
  