const buttonsContainer = document.getElementById("buttons-container");

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
    .then((data) => console.log(data.data));
};

displayCategories();
