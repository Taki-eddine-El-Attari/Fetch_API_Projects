// ============= FETCH DOG BREEDS LIST =============
// Get list of all dog breeds from the API
fetch("https://dog.ceo/api/breeds/list/all")
  .then((reponse) => reponse.json())
  .then((chiens) => {
    // Get DOM elements
    let select = document.getElementById("select");
    let search = document.getElementById("search");

    // ============= POPULATE SELECT FUNCTION =============
    // Function to fill the dropdown with dog breeds
    function RemplireSelect(races) {
      select.innerHTML = "";
      races.forEach((chien) => {
        // Create option for each breed
        let list = document.createElement("option");
        list.textContent = chien;
        list.value = chien;
        select.appendChild(list);
      });
    }

    // Get array of breed names from response object
    let races_options = Object.keys(chiens.message);

    // Initial population of select dropdown
    RemplireSelect(races_options);

    // ============= SEARCH FUNCTIONALITY =============
    // Filter breeds list as user types in search box
    search.addEventListener("input", function () {
      let searchTerm = search.value.toLowerCase();

      // Filter breeds that start with search term
      let filtrerraces = races_options.filter((chien) =>
        chien.toLowerCase().startsWith(searchTerm)
      );

      // Update select with filtered results
      RemplireSelect(filtrerraces);
    });

    // ============= IMAGE DISPLAY FUNCTIONALITY =============
    // Event handler for breed selection button
    let boutton = document.getElementById("button");
    boutton.addEventListener("click", () => {
      // Get selected dog breed
      let race = select.value;

      // Fetch images for selected breed
      fetch(`https://dog.ceo/api/breed/${race}/images`)
        .then((reponse) => reponse.json())
        .then((images) => {
          // Get grid container
          const grid = document.getElementById("grid");

          // Clear previous images
          grid.innerHTML = "";

          // Add first 30 images to grid
          images.message.slice(0, 30).forEach((imageUrl) => {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = race;
            grid.appendChild(img);
          });
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));
