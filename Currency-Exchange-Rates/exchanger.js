// ============= FETCH CURRENCY EXCHANGE RATES =============
// Fetch the latest exchange rates from the API
fetch(
  "https://openexchangerates.org/api/latest.json?app_id=Your_App_ID_Here"
)
  .then((response) => response.json())
  .then((data) => {
    // ============= DOM ELEMENTS =============
    // Get references to all input and select elements
    let select1 = document.getElementById("select1"); // Source currency dropdown
    let select2 = document.getElementById("select2"); // Target currency dropdown
    let input1 = document.getElementById("input1"); // Amount to convert
    let result = document.getElementById("input2"); // Conversion result display

    // ============= POPULATE CURRENCY DROPDOWNS =============
    // Extract currency rates from API response
    let rates = data.rates;
    let keys = Object.keys(rates); // Get list of all available currencies

    // Add each currency to both dropdown menus
    keys.forEach((key) => {
      // Add to source currency dropdown
      let option1 = document.createElement("option");
      option1.text = key;
      select1.add(option1);

      // Add to target currency dropdown
      let option2 = document.createElement("option");
      option2.text = key;
      select2.add(option2);
    });

    // ============= CONVERSION EVENT HANDLERS =============
    // Update conversion when user finishes entering a value (change event)
    input1.addEventListener("change", () => {
      // Get the exchange rates for selected currencies
      let rate1 = rates[select1.value];
      let rate2 = rates[select2.value];

      // Calculate and display conversion result
      result.value = (input1.value * rate2) / rate1;
    });

    // Update conversion in real-time as user types (input event)
    input1.addEventListener("input", () => {
      // Get the exchange rates for selected currencies
      let rate1 = rates[select1.value];
      let rate2 = rates[select2.value];

      // Calculate and display conversion result
      result.value = (input1.value * rate2) / rate1;
    });
  })
  .catch((error) => console.error(error));
