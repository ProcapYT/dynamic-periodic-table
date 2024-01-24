/*
 TODO Focus blur
*/

const autosuggestContainer = document.querySelector(".autoSuggest");
const searchAtomButton = document.querySelector(".searchAtomButton");

const getElementNames = async () => {
  try {
    const res = await fetch("../test.json");

    if (!res.ok) {
      throw new Error("Error fetching data");
    }

    const data = await res.json();

    return Object.keys(data);
  } catch (e) {
    throw new Error(e);
  }
};

getElementNames().then((names) => {
  searchAtomInput.addEventListener("input", () => {
    const cleanSerchInput = searchAtomInput.value
      .replace(/[\s]/g, "")
      .toLowerCase();
    const filteredSuggestions = names.filter((name) =>
      name.toLowerCase().includes(cleanSerchInput)
    );

    if (cleanSerchInput.length > 1) {
      autosuggestContainer.innerHTML = "";

      if (filteredSuggestions.length === 0) {
        autosuggestContainer.classList.add("hidden");
        searchAtomInput.classList.remove("autosuggest");
      } else {
        filteredSuggestions.forEach((suggestion) => {
          autosuggestContainer.classList.remove("hidden");
          searchAtomInput.classList.add("autosuggest");
          const suggestionItem = document.createElement("button");
          suggestionItem.classList.add("suggestion-item");
          suggestionItem.textContent = suggestion;

          suggestionItem.addEventListener("click", () => {
            searchAtomInput.value = suggestion;
            autosuggestContainer.innerHTML = "";
            autosuggestContainer.classList.add("hidden");
            searchAtomInput.classList.remove("autosuggest");
            searchAtomButton.click();
          });

          autosuggestContainer.appendChild(suggestionItem);
        });
      }
    } else {
      autosuggestContainer.innerHTML = "";
      autosuggestContainer.classList.add("hidden");
      searchAtomInput.classList.remove("autosuggest");
    }
  });
});
