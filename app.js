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
  handleSort = () => {
    datas.forEach((item) => {
      item.viewsNumeric = parseFloat(item.others.views.replace("K", "")) * 1000;
    });
    datas.sort((a, b) => b.viewsNumeric - a.viewsNumeric);
    handleCards(datas);
  };

  if (datas.length == 0) {
    cardsContainer.classList.add("hidden");
    oopsContainer.classList.remove("hidden");
  } else {
    oopsContainer.classList.add("hidden");
    cardsContainer.classList.remove("hidden");
    cardsContainer.innerHTML = "";

    datas.forEach((data) => {
      const card = document.createElement("div");
      const postedDate = parseInt(data.others.posted_date);
      data.postedDateFormatted = convertPostedDate(postedDate);
      let time = data.postedDateFormatted;

      card.innerHTML = `
    <div class="relative max-w-fit">
          <img
            class="w-72 h-48 bg-cover bg-center rounded-lg"
            src="${data.thumbnail}"
            alt=""
          />
          <span
            class="time absolute bottom-3 right-3 text-white p-1 bg-[#171717] rounded"
            >${time} ago</span
          >
        </div>
        <div class="flex py-5">
          <div class="w-fit">
            <img class="w-10 h-10 bg-cover bg-center mr-3 rounded-full" src="${data.authors[0].profile_picture}" alt="" />
          </div>
          <div>
            <h2 class="text-base font-bold text-[#171717]">
              ${data.title}
            </h2>
            <p
              class="text-sm font-normal text-[#171717] pt-2.5 flex items-center gap-1"
            >
              ${data.authors[0].profile_name}
              <img class="verified" src="./images/verified.svg" alt="" />
            </p>
            <p class="text-sm font-normal text-[#171717] pt-2.5">${data.others.views} views</p>
          </div>
        </div>
    `;
      cardsContainer.appendChild(card);

      const verifiedBatch = card.querySelector(".verified");
      if (data.authors[0].verified === true) {
        verifiedBatch.classList.add("h-4", "w-4");
      } else {
        verifiedBatch.classList.add("hidden");
      }
      const timeBlock = card.querySelector(".time");
      if (time !== "NaNs") {
        timeBlock.classList.remove("hidden");
      } else {
        timeBlock.classList.add("hidden");
      }
    });
  }
};

function convertPostedDate(postedDate) {
  const postDate = postedDate * 1000;

  const seconds = Math.floor(postDate / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d:${hours % 24}h:${minutes % 60}m:${seconds % 60}s`;
  } else if (hours > 0) {
    return `${hours}h:${minutes % 60}m:${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m:${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

displayCategories();
