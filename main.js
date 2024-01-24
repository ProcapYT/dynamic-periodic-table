const sliderInput = document.querySelector("#slider");
const atomNameText = document.querySelector(".atomName");
const atomAliasText = document.querySelector(".alias");
const atomNumberText = document.querySelector(".number");
const atomContainer = document.querySelector(".atomProperties");
const searchAtomForm = document.querySelector(".searchAtom");
const searchAtomInput = document.querySelector(".searchAtomInput");
const atomicWeightText = document.querySelector(".atomicWeight");
const atomImg = document.querySelector(".atomImg");
const numberIsotopsText = document.querySelector(".numberIsotops");

let atoms = {};

const getTextColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminosity = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminosity > 0.5 ? "#000000" : "#FFFFFF";
};

const getAtoms = async () => {
  try {
    const res = await fetch("./test.json");

    if (!res.ok) {
      throw new Error("Error fetching data");
    }

    const data = await res.json();

    return data;
  } catch (e) {
    throw new Error(e);
  }
};

getAtoms().then((data) => {
  atoms = data;

  const searchForAtomByNumber = (number) => {
    for (const cleanAtomName in atoms) {
      if (atoms[cleanAtomName].numero === number) {
        atomNameText.textContent = atoms[cleanAtomName].nombre;
        atomAliasText.textContent = atoms[cleanAtomName].alias;
        atomNumberText.textContent = atoms[cleanAtomName].numero;
        atomicWeightText.textContent = atoms[cleanAtomName].pesoAtomico;
        atomContainer.style = `
        background-color: ${atoms[cleanAtomName].color}; 
        color: ${getTextColor(atoms[cleanAtomName].color)};
        `;
        atomImg.src = `./img/${cleanAtomName}.png`;
        atomImg.alt = atoms[cleanAtomName].nombre;
        numberIsotopsText.textContent = atoms[cleanAtomName].cantidadIsotopos;
      }
    }
  };

  searchForAtomByNumber(parseInt(sliderInput.value));

  sliderInput.addEventListener("input", () => {
    searchAtomInput.value = "";
    searchForAtomByNumber(parseInt(sliderInput.value));
  });

  //!--------------------------------------------------------------

  const removeAccent = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  searchAtomForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cleanSearchInput = removeAccent(
      searchAtomInput.value.replace(/ /g, "")
    );

    if (cleanSearchInput) {
      const searchForAtomByName = (name) => {
        for (const cleanAtomName in atoms) {
          if (name === cleanAtomName) {
            searchForAtomByNumber(atoms[cleanAtomName].numero);
            sliderInput.value = atoms[cleanAtomName].numero;
            return true;
          }
        }

        return false;
      };

      if (searchForAtomByName(cleanSearchInput)) {
        searchAtomInput.value = cleanSearchInput;
        searchForAtomByName(cleanSearchInput);

        autosuggestContainer.innerHTML = "";
        autosuggestContainer.classList.add("hidden");
        searchAtomInput.classList.remove("autosuggest");
      } else {
        searchAtomInput.value = "";

        searchAtomInput.placeholder = "Elemento no encontrado";

        autosuggestContainer.innerHTML = "";
        autosuggestContainer.classList.add("hidden");
        searchAtomInput.classList.remove("autosuggest");

        setTimeout(() => {
          searchAtomInput.placeholder = "Busca un elemento.";
        }, 2000);
      }
    }
  });

  addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && document.activeElement !== sliderInput) {
      sliderInput.value++;

      searchAtomInput.value = "";
      searchForAtomByNumber(parseInt(sliderInput.value));
    } else if (
      e.code === "ArrowDown" &&
      document.activeElement !== sliderInput
    ) {
      sliderInput.value--;

      searchAtomInput.value = "";
      searchForAtomByNumber(parseInt(sliderInput.value));
    }
  });
});
