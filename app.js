const buttonsContainer = document.getElementById("buttons-container");
const cardsContainer = document.getElementById("cards-container");
const oopsContainer = document.getElementById("opps-container");

const displayCategories = () => {
  fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then((data) => displayButton(data.data));
};

const displayButton = (data) => {
  data.forEach((categoryObj) => {
    let category = categoryObj.category;
    let id = categoryObj.category_id;

    const button = document.createElement("button");
    button.textContent = category;
    button.className =
      "category-button bg-blue-500 text-white px-4 py-2 rounded";
    if (button.textContent == "All") handleButtonClicked(button, id);

    button.addEventListener("click", () => {
      handleButtonClicked(button, id);
    });

    buttonsContainer.appendChild(button);
  });
};

const handleButtonClicked = (button, id) => {
  document.querySelectorAll(".category-button").forEach((btn) => {
    btn.classList.remove("bg-red-700");
  });
  button.classList.add("bg-red-700");

  fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    .then((res) => res.json())
    .then((data) => handleCards(data.data));
};

const handleCards = (datas) => {
  if (datas.length == 0) {
    cardsContainer.classList.add("hidden");
    oopsContainer.classList.remove("hidden");
  } else {
    oopsContainer.classList.add("hidden");
    cardsContainer.classList.remove("hidden");
    cardsContainer.innerHTML = "";

    datas.forEach((data) => {
      const card = document.createElement("div");
      card.innerHTML = `
    <div class="relative max-w-fit">
          <img
            class="w-72 h-48 bg-cover bg-center rounded-lg"
            src="${data.thumbnail}"
            alt=""
          />
          <span
            class="absolute bottom-3 right-3 text-white p-1 bg-[#171717] rounded"
            >3hrs 56 min ago</span
          >
        </div>
        <div class="flex py-5">
          <div class="w-10 h-10">
            <img class="w-10 h-10 bg-cover bg-center pr-3 rounded-full" src="${data.authors[0].profile_picture}" alt="" />
          </div>
          <div>
            <h2 class="text-base font-bold text-[#171717]">
              ${data.title}
            </h2>
            <p
              class="text-sm font-normal text-[#171717] pt-2.5 flex items-center gap-1"
            >
              ${data.authors[0].profile_name}
              <img class="h-4 w-4" src="./images/verified.svg" alt="" />
            </p>
            <p class="text-sm font-normal text-[#171717] pt-2.5">${data.others.views} views</p>
          </div>
        </div>
    `;
      cardsContainer.appendChild(card);
    });
  }
};

displayCategories();
