///<reference types="../@types/jquery" />

let rowData = document.getElementById("rowData");
let SearchData = document.getElementById("SearchData");
let submitBtn;

$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading").fadeOut(500)
      $("body").css( "overflow" ,"visible")
      
  })
})

// Side Navigation
function openSideNav() {
  $(".side-nav").animate({
      left: 0
  }, 500)


  $(".open").removeClass("fa-align-justify");
  $(".open").addClass("fa-x");


  for (let i = 0; i < 5; i++) {
      $(".links li").eq(i).animate({
          top: 0
      }, (i + 5) * 100)
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav .nav-tab").outerWidth()
  $(".side-nav").animate({
      left: -boxWidth
  }, 500)

  $(".open").addClass("fa-align-justify");
  $(".open").removeClass("fa-x");


  $(".links li").animate({
      top: 300
  }, 500)
}

closeSideNav()
$(".side-nav i.open").on("click",() => {
  if ($(".side-nav").css("left") == "0px") {
      closeSideNav()
  } else {
      openSideNav()
  }
})
//Search Functions
async function searchByName(term) {
  $(".loadingScreen").fadeIn(500);
  try {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    let data = await response.json();
    displayMeals(data.meals);
  } catch (error) {
    console.error('Error fetching meals by name:', error);
  }
 finally {
  
  $(".loadingScreen").fadeOut(500);
}
}

searchByName("");
function displayMeals(meals) {
  if (!meals) {
    rowData.innerHTML = '<p class="text-center">No meals found.</p>';
    return;
  }

  let box = meals.map(meal => `
    <div class="col-md-3">
      <div onclick="getMealDetails('${meal.idMeal}')" class="food position-relative overflow-hidden rounded-2">
        <img class="w-100 cursor " src="${meal.strMealThumb}" alt="Food">
        <div class="food-layer position-absolute d-flex align-items-center text-black p-2">
          <h3>${meal.strMeal}</h3>
        </div>
      </div>
    </div>`).join('');
  rowData.innerHTML = box;
}


// Categories
async function getCategories() {
  rowData.innerHTML = "";
  $(".loadingScreen").fadeIn(500);
  SearchData.innerHTML = "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  let data = await response.json();
  displayCategories(data.categories);
  $(".loadingScreen").fadeOut(500);
}

function displayCategories(categories) {
  let box = categories.map(category => `
    <div class="col-md-3">
      <div onclick="getCategoryMeals('${category.strCategory}')" class="food position-relative overflow-hidden rounded-2">
        <img class="w-100" src="${category.strCategoryThumb}" alt="Food">
        <div class="food-layer position-absolute text-center text-black p-2">
          <h3>${category.strCategory}</h3>
          <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
      </div>
    </div>`).join('');
  rowData.innerHTML = box;
}

// Areas
async function getArea() {
  rowData.innerHTML = "";
  $(".loadingScreen").fadeIn(500);
  SearchData.innerHTML = "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  let data = await response.json();
  displayArea(data.meals);
  $(".loadingScreen").fadeOut(500);
}

function displayArea(areas) {
  let box = areas.map(area => `
    <div class="col-md-3">
      <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${area.strArea}</h3>
      </div>
    </div>`).join('');
  rowData.innerHTML = box;
}

// Ingredients
async function getIngredients() {
  rowData.innerHTML = "";
  $(".loadingScreen").fadeIn(500);
  SearchData.innerHTML = "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  let data = await response.json();
  displayIngredients(data.meals.slice(0, 20));
  $(".loadingScreen").fadeOut(500);
}

function displayIngredients(ingredients) {
  let box = ingredients.map(ingredient => `
    <div class="col-md-3">
      <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h3>${ingredient.strIngredient}</h3>
        <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
      </div>
    </div>`).join('');
  rowData.innerHTML = box;
}

// Meals by Category, Area, Ingredients
async function getCategoryMeals(category) {
  $(".loadingScreen").fadeIn(500);
  await fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  $(".loadingScreen").fadeOut(500)
}

async function getAreaMeals(area) {
  $(".loadingScreen").fadeIn(500);
  await fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  $(".loadingScreen").fadeOut(500)
}

async function getIngredientsMeals(ingredient) {
  $(".loadingScreen").fadeIn(500);
  await fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
}

async function fetchMeals(url) {
  rowData.innerHTML = "";
  $(".loadingScreen").fadeIn(500);
  let response = await fetch(url);
  let data = await response.json();
  displayMeals(data.meals.slice(0, 20));
  $(".loadingScreen").fadeOut(500);
}

// Meal Details
async function getMealDetails(mealID) {
  rowData.innerHTML = "";
  $(".loadingScreen").fadeIn(500);
  closeSideNav();
  SearchData.innerHTML = "";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  let data = await response.json();
  displayMealDetails(data.meals[0]);
  $(".loadingScreen").fadeOut(500);
}

function displayMealDetails(meal) {
  SearchData.innerHTML = "";
  let ingredients = getIngredientsList(meal);
  let tagsStr = getTagsList(meal.strTags);

  let box = `
    <div class="col-md-4">
      <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
      <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
      <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
      <h3>Recipes:</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
      <h3>Tags:</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsStr}</ul>
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;
  rowData.innerHTML = box;
}

function getIngredientsList(meal) {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  return ingredients;
}

function getTagsList(tagsStr) {
  let tags = tagsStr ? tagsStr.split(",") : [];
  return tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join('');
}

// Search Input
function searchInput() {
  SearchData.innerHTML = `
    <div class="row py-4">
      <div class="col-md-6">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
    </div>`;
  rowData.innerHTML = "";
}

// Search By First Letter
async function searchByFirstLetter(term) {
  $(".loadingScreen").fadeIn(500);
  term = term || "a";
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
  let data = await response.json();
  displayMeals(data.meals);
  
    $(".loadingScreen").fadeOut(500);
  
}

// Contact Us
function contactUs() {
  rowData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
        <div class="row g-4">
          <div class="col-md-6">
            <input id="nameInput" class="form-control" type="text" placeholder="Enter Your Name">
            <div class="alert mt-1 alert-danger d-none" id="nameAlert" role="alert">
              Special Characters and Numbers not allowed
            </div>
          </div>
          <div class="col-md-6">
            <input id="emailInput" class="form-control" type="email" placeholder="Enter Email">
            <div class="alert mt-1 alert-danger d-none" id="emailAlert" role="alert">
              Enter valid email. *Ex: xxx@yyy.zzz
            </div>
          </div>
          <div class="col-md-6">
            <input id="phoneInput" type="text" class="form-control" placeholder="Enter Phone">
            <div class="alert mt-1 alert-danger d-none" id="phoneAlert" role="alert">
              Enter valid Phone Number
            </div>
          </div>
          <div class="col-md-6">
            <input id="ageInput" class="form-control" type="number" placeholder="Enter Age">
            <div class="alert mt-1 alert-danger d-none" id="ageAlert" role="alert">
              Enter valid age
            </div>
          </div>
          <div class="col-md-6">
            <input id="passwordInput" class="form-control" type="password" placeholder="Enter Password">
            <div class="alert mt-1 alert-danger d-none" id="passwordAlert" role="alert">
              Enter valid password. *Minimum eight characters, at least one letter and one number:*
            </div>
          </div>
          <div class="col-md-6">
            <input id="repasswordInput" class="form-control" type="password"   placeholder="Repassword">
            <div class="alert mt-1 alert-danger d-none" id="repasswordAlert" role="alert">
              Enter valid repassword
            </div>
          </div>
        </div>
        <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3" disabled>Submit</button>
      </div>
    </div>`;
  addValidationEvents();
}

// Validation Functions
function addValidationEvents() {
  document.getElementById("nameInput").addEventListener("focus", () => validateForm());
  document.getElementById("emailInput").addEventListener("focus", () => validateForm());
  document.getElementById("phoneInput").addEventListener("focus", () => validateForm());
  document.getElementById("ageInput").addEventListener("focus", () => validateForm());
  document.getElementById("passwordInput").addEventListener("focus", () => validateForm());
  document.getElementById("repasswordInput").addEventListener("focus", () => validateForm());
}

function validateForm() {
  let nameValid = validateName();
  let emailValid = validateEmail();
  let phoneValid = validatePhone();
  let ageValid = validateAge();
  let passwordValid = validatePassword();
  let repasswordValid = validateRepassword();
  
  document.getElementById("submitBtn").disabled = !(nameValid && emailValid && phoneValid && ageValid && passwordValid && repasswordValid);
}

function validateName() {
  let nameInput = document.getElementById("nameInput");
  let nameAlert = document.getElementById("nameAlert");
  let regex = /^[a-zA-Z ]+$/;
  if (regex.test(nameInput.value)) {
    nameAlert.classList.add("d-none");
    return true;
  } else {
    nameAlert.classList.remove("d-none");
    return false;
  }
}

function validateEmail() {
  let emailInput = document.getElementById("emailInput");
  let emailAlert = document.getElementById("emailAlert");
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (regex.test(emailInput.value)) {
    emailAlert.classList.add("d-none");
    return true;
  } else {
    emailAlert.classList.remove("d-none");
    return false;
  }
}

function validatePhone() {
  let phoneInput = document.getElementById("phoneInput");
  let phoneAlert = document.getElementById("phoneAlert");
  let regex = /^(\+?\d{1,4}[\s-]?)?\d{10}$/;
  if (regex.test(phoneInput.value)) {
    phoneAlert.classList.add("d-none");
    return true;
  } else {
    phoneAlert.classList.remove("d-none");
    return false;
  }
}

function validateAge() {
  let ageInput = document.getElementById("ageInput");
  let ageAlert = document.getElementById("ageAlert");
  let regex = /^[1-9][0-9]?$/;
  if (regex.test(ageInput.value)) {
    ageAlert.classList.add("d-none");
    return true;
  } else {
    ageAlert.classList.remove("d-none");
    return false;
  }
}

function validatePassword() {
  let passwordInput = document.getElementById("passwordInput");
  let passwordAlert = document.getElementById("passwordAlert");
  let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (regex.test(passwordInput.value)) {
    passwordAlert.classList.add("d-none");
    return true;
  } else {
    passwordAlert.classList.remove("d-none");
    return false;
  }
}

function validateRepassword() {
  let passwordInput = document.getElementById("passwordInput");
  let repasswordInput = document.getElementById("repasswordInput");
  let repasswordAlert = document.getElementById("repasswordAlert");
  if (repasswordInput.value === passwordInput.value) {
    repasswordAlert.classList.add("d-none");
    return true;
  } else {
    repasswordAlert.classList.remove("d-none");
    return false;
  }
}
