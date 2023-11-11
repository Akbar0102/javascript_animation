/* TEXT ANIMATION */
const logo = document.querySelector(".logo");
const letters = logo.textContent.split("");

logo.textContent = "";

letters.forEach((letter) => {
  logo.innerHTML += '<span class="letter">' + letter + "</span>";
});
gsap.set(".letter", { display: "inline-block" });
gsap.fromTo(
  ".letter",
  { y: "100%" },
  { y: 0, delay: 0.5, stagger: 0.05, ease: "black.out(3)" }
);

/* COLOR CONSTANT */
const color = {
  bug: "#9dc130",
  dark: "#5f606d",
  dragon: "#0773c7",
  electric: "#edd53f",
  fairy: "#ef97e6",
  fighting: "#d94256",
  fire: "#fc6c6d",
  flying: "#9bb4e8",
  ghost: "#7975d4",
  grass: "#5dbe62",
  ground: "#d78555",
  ice: "#98d8d8",
  normal: "#9a9da1",
  poison: "#b563ce",
  psychic: "#f85888",
  rock: "#cec18c",
  steel: "#b8b8d0",
  water: "#60a5fa",
};

/* FUNC */
function capitalizeFirstLetter(text) {
  // Ambil huruf pertama dan sisanya
  const firstLetter = text[0].toUpperCase();
  const restOfText = text.slice(1);

  // Gabungkan dan kembalikan teks yang telah dimodifikasi
  return firstLetter + restOfText;
}

let url = "https://pokeapi.co/api/v2/pokemon";
let listPokemon = [];

const getAllPokemon = async (limit, offset) => {
  url += `?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  const data = await response.json();

  listPokemon = data.results.map((pokemon) => {
    return {
      name: pokemon.name,
      url: pokemon.url,
      sprite: null,
      types: [],
    };
  });
};

const getDetailPokemon = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

function generateHtml(pokemon) {
  const pokeContainer = document.createElement("div");
  pokeContainer.classList.add("poke-container");

  const spriteImg = document.createElement("img");
  spriteImg.classList.add("sprite");
  spriteImg.src = pokemon.sprites.other["official-artwork"].front_default;
  spriteImg.alt = "";

  const textContainer = document.createElement("div");
  textContainer.classList.add("text");

  const pokeTitle = document.createElement("h2");
  pokeTitle.classList.add("poke-title");
  pokeTitle.textContent = capitalizeFirstLetter(pokemon.name);

  const pokeType = document.createElement("p");
  pokeType.classList.add("poke-type");
  pokeType.textContent = "Type: ";

  const pokeSubtitle = document.createElement("p");
  pokeSubtitle.classList.add("poke-subtitle");
  pokeSubtitle.textContent = pokemon.types.map((type) =>
    capitalizeFirstLetter(type.type.name)
  );
  pokeContainer.style.background = color[pokemon.types[0].type.name];

  const okButton = document.createElement("button");
  okButton.classList.add("btn-catch");
  okButton.textContent = "Show Abilities!";
  okButton.dataset.pokemonId = pokemon.id;

  okButton.addEventListener("click", (event) => {
    const clickedPokemonId = event.target.dataset.pokemonId;
    openModal(clickedPokemonId);
  });

  textContainer.appendChild(pokeTitle);
  textContainer.appendChild(pokeType);
  textContainer.appendChild(pokeSubtitle);
  textContainer.appendChild(okButton);

  pokeContainer.appendChild(spriteImg);
  pokeContainer.appendChild(textContainer);

  return pokeContainer;
}

const listContainer = document.getElementById("list-container");
const btnMore = document.getElementById("btn-more");
getAllPokemon(10, 0).then(async () => {
  showLoading();
  for (const pokemon of listPokemon) {
    let pokeData = await getDetailPokemon(pokemon.url);
    let componen = generateHtml(pokeData);
    listContainer.appendChild(componen);
  }

  url = "https://pokeapi.co/api/v2/pokemon";
  updateLoadMoreVisibility();
  hideLoading();
});

function updateLoadMoreVisibility() {
  if (listContainer.children.length > 0) {
    btnMore.style.display = "block";
  } else {
    btnMore.style.display = "none";
  }
}

let currentOffset = 0;
btnMore.addEventListener("click", () => {
  showLoading();
  const newLimit = 10;
  currentOffset += newLimit;

  getAllPokemon(newLimit, currentOffset).then(async () => {
    for (const pokemon of listPokemon) {
      let pokeData = await getDetailPokemon(pokemon.url);
      let component = generateHtml(pokeData);
      listContainer.appendChild(component);
    }
    url = "https://pokeapi.co/api/v2/pokemon";
    updateLoadMoreVisibility();
    hideLoading();
  });
});

const loadingOverlay = document.getElementById("loadingOverlay");
function showLoading() {
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
function openModal(pokemonId) {
  modalOverlay.style.display = "flex";
  getDetailPokemon(url + "/" + pokemonId).then((pokemon) => {
    document.getElementById("modalTitle").textContent = capitalizeFirstLetter(
      pokemon.name
    );
    document.getElementById("modalAbilities").textContent =
      pokemon.abilities.map((ability) =>
        capitalizeFirstLetter(ability.ability.name)
      );
  });
}

function closeModal() {
  modalOverlay.style.display = "none";
  document.getElementById("modalTitle").textContent = "";
  document.getElementById("modalAbilities").textContent = "";
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});
