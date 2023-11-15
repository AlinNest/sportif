import  { products, productCard }  from "./arrayproducts.js";

const burger = document.querySelector(".header-burger");
const menu =  document.querySelector(".menu");
const body =  document.querySelector("body");
const search = document.querySelector(".search-navigation");
const searchMain = document.querySelector(".search__main");
const searchOptions = document.querySelector(".options");
const filterIcon = document.querySelector(".filter-icon");
const filterBlock = document.querySelectorAll(".block-filter");  //все блоки меню фильтрации для скрытия
const cardsGoods = document.querySelector(".catalog-cards");
const titlePage = document.querySelector("title").textContent;
const catalogFilters = document.querySelector(".catalog-filter");
const list = document.querySelector('.list');
const pagination = document.querySelector(".catalog-pagination");
const btnClean = document.querySelector(".clean");
const goodPage = document.querySelector(".section__card");
const cartProductsList = document.querySelector(".cart-content__list");//сюда добавляем отрисовку выбранных товаров
const cartContent = document.querySelector(".cart-content");//блок карточки товара
const cartQuantity = document.querySelector(".cart__quantity");//общее количество товаров в корзине
const fullPrice = document.querySelector(".fullprice");//итоговая сумма в корзине
const blockBasket = document.querySelector('.basket'); //блок корзины


let total = 0;
let arrProducts = [];


//фильтрация товаров по категориям, чтобы отнести их на соответствующие страницы
const fiterGoodsOfTitle = products.filter(function(el){return el.title === titlePage});

const onPage = 4; // количество товаров на странице
const pagSection = document.createElement("section");//блок для паггинации
pagSection.classList.add('pagDiv');
const btnPag = document.createElement("div");//кнопки для паггинации
btnPag.classList.add('pagDiv');

if(burger || filterIcon){
  burger.addEventListener('click', burgerActive);
}
if(filterIcon){
  filterIcon.addEventListener('click', menuActive);
}
if(list){
  list.addEventListener('click', applyFilters);
list.addEventListener('click', arrowActive);
}

if(search){
  search.addEventListener('keyup', display);
}

if(btnClean){
  btnClean.addEventListener('click', cleanValueFilters);
}

//первичная отрисовка товаров
if(cardsGoods){
  displayCatalog(fiterGoodsOfTitle);
}

document.addEventListener('click', sliderImgGood);
searchMain.addEventListener('keyup', dispayOptions);
document.addEventListener('click', paginationWork);
blockBasket.addEventListener('click', basketActive);


//активирование бургера
function burgerActive(e) {
  burger.classList.toggle('active');
  menu.classList.toggle('active');
  body.classList.toggle('lock');
}

//открытие и закрытие пунктов меню фильтров
function arrowActive(e) {
  const targetId = e.target.dataset.id;
  e.target.classList.toggle('arrow-active');
  filterBlock.forEach(filter => {
    if(filter.classList.contains(targetId)){
      filter.classList.toggle('hide');
    }
  })
}

//открытие и скрытие меню фильтров
function menuActive(e) {
  if(filterIcon){
  catalogFilters.classList.toggle('filter-active');
}
}

// сбор данных по выбранным фильтрам и фильтрация по ним товаров
function applyFilters() {
  const selectedSizes =  Array.from(document.querySelectorAll('input[name="size"]:checked')).map(input => Number(input.value));
  const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(input => input.value);
  const selectedRating = document.querySelector('#rating').value;
  const selectedPriceMin = document.querySelector('#price-min').value;
  const selectedPriceMax = document.querySelector('#price-max').value;

  filterProducts(selectedSizes, selectedColors, selectedRating, selectedPriceMin, selectedPriceMax);
}

//перебор массива выбранных параметров в фильтре и сравнение с параметрами в товарах
function filtersArrayParams (filtersCheck, products) {
  const array = [];

  filtersCheck.forEach((e) => {
    const value = products.includes(e);
    array.push(value);
  })

  if (array.length !== 0) {
    return array.includes(true);
}
}

// Фильтрация товаров
function filterProducts(sizes, colors, rating, priceMin, priceMax) {
  
  const filterGoods = fiterGoodsOfTitle.filter(product => (
    (!sizes.length || filtersArrayParams(sizes, product.size)) &&
    (!colors.length || filtersArrayParams(colors, product.color)) &&
    (!rating || rating <= product.rating) &&
    (!priceMin || priceMin <= product.price) &&
    (!priceMax || priceMax >= product.price)
  ));
  
 displayCatalog (filterGoods);
}

//очистка фильтра
function cleanValueFilters(sizes, colors, rating, priceMin, priceMax){
   
  rating = document.querySelector('#rating').value;
  priceMin = document.querySelector('#price-min').value;
  priceMax = document.querySelector('#price-max').value;
  sizes = document.querySelectorAll('input[name="size"]:checked');
  colors = document.querySelectorAll('input[name="color"]:checked');

  if(sizes !== null)
  sizes.forEach((e) => {
    e.checked = false;
  })

  if(colors !== null)
  colors.forEach((e) => {
    e.checked = false;
  })
  
  if(rating !== null){
    document.querySelector('#rating').value = '';
    document.querySelector('#price-min').value = '';
    document.querySelector('#price-max').value = '';
  }

  displayCatalog (fiterGoodsOfTitle);
}

//фильтрация товаров согласно введенному пользователум в поисковой строке
function filterSearch(word, products) {
  return products.filter( p => {
    const regex = new RegExp(word, 'gi');
    return p.description.match(regex);
  })
}

//отображение в шапке списка отфильтрованных товаров по полю поиска
function dispayOptions() {
  
  const options = filterSearch(this.value, products);

  const listSearchGoods = options
  .map(products => {

    const regex = new RegExp(this.value, 'gi');
    const productName = products.description.replace(regex, 
      `<span class="hl">${this.value}</span>`
      )

    return `<a href=""><li><span>${productName}</span></li></a>`;
  })
  .slice(0, 5)
  .join('');

  searchOptions.innerHTML = this.value ? listSearchGoods : null;
  displayCatalog (options);
}

//отрисовка карточек товаров в каталоге
function createCardGoods ({description, image, rating, price, color, article})  {
 
  const creatDivForCards = document.createElement("div");
  creatDivForCards.classList.add('fortydiscountcard');
  creatDivForCards.setAttribute('id', `${article}`)
  cardsGoods.append(creatDivForCards);
  creatDivForCards.insertAdjacentHTML("beforeend", `
   
    <div class="cart-img">
    <a href="../card/index.html?id=${article}">
      <img class="cart-img-item" id="${article}" src="${image}" alt="${description}">
    </a> 
    </div>
    <a href="../card/index.html?id=${article}">
    <div class="cart-name">${description}</div>
    </a> 
    <div class="rating">
    <div class="rating-body">
      <div class="rating-active" style="width: ${rating/0.05}%;">
        <div class="rating-items">
          <input type="radio" class="rating-item" value="1" name="rating">
          <input type="radio" class="rating-item" value="2" name="rating">
          <input type="radio" class="rating-item" value="3" name="rating">
          <input type="radio" class="rating-item" value="4" name="rating">
          <input type="radio" class="rating-item" value="5" name="rating">
        </div>
      </div>
    </div>
  </div>
    <div class="cart-price">As low as <span class="currency">$</span><span class="price">${price}</span></div>
    <div class="cart-color">
    ${color.map((el) => {
      return `<span class="colors" style="background-color: ${el};"></span>`
  }).join(" ")}
  </div>
    <div class="cart-button">
       <button class="cart-button-push">ADD TO CART</button>
    </div>`
    );
  return creatDivForCards;
}

//отрисовка цвета и размеров в меню фильтров
function renderColorSize (array, parent, article, type) { 
  for (let value in array) {
      const elementOutput = document.createElement('input');
      const elementLabel = document.createElement('label');
      elementOutput.setAttribute('type', type);
      elementOutput.setAttribute('class', 'checkbox');
      elementOutput.setAttribute('value', `${array[value]}`);
      if (array[value].length === 7) {
          elementOutput.setAttribute('name', 'color');
          elementOutput.setAttribute('id', `color${article}.${value}`);
          elementLabel.setAttribute('for', `color${article}.${value}`);
          elementLabel.style.backgroundColor = `${array[value]}`;
      } else {
          elementOutput.setAttribute('name', 'size');
          elementOutput.setAttribute('id', `size${article}.${value}`);
          elementLabel.setAttribute('for', `size${article}.${value}`);
          elementLabel.innerHTML = `<span>${array[value]}</span>`;
      }
      parent && parent.append(elementOutput, elementLabel);
  }
}

//отбор из базы товаров имеющихся в наличии цветов и размеров
function selectionFilters (array, menuSizeSelector, menuColorSelector) {
  const allSizeCatalog = [];
  const allColorCatalog = [];
  
  const menuSize = document.querySelector(menuSizeSelector);
  const menuColor = document.querySelector(menuColorSelector);
  
  for (let i = 0; i < array.length; i++) {
      for (let key in array[i].size) {
          allSizeCatalog.push(array[i].size[key]);
      }
      for (let key in array[i].color) {
          allColorCatalog.push(array[i].color[key]);
      }
  }
  const newAllSizeCatalog = new Set(allSizeCatalog);
  const newAllColorCatalog = new Set(allColorCatalog);
  const uniqueSizeCatalog = Array.from(newAllSizeCatalog);
  const uniqueColorCatalog = Array.from(newAllColorCatalog);
  renderColorSize (uniqueSizeCatalog, menuSize, 'size', 'checkbox');
  renderColorSize (uniqueColorCatalog, menuColor, 'color', 'checkbox');
}

selectionFilters(products,'.menu-size', '.menu-color');


//отрисовка товаров из поиска
function display(products) {
  const goodsOfSearch = (filterSearch(this.value, fiterGoodsOfTitle));
  displayCatalog (goodsOfSearch);
}

//отрисовка товаров после использования фильтров
function displayCatalog (products) {
 const options = products.slice(0, onPage);
 const optionsOfBtn = products;
 btnPag.innerHTML = paintPaginationButton(numberBtns(optionsOfBtn, onPage));
 cardsGoods.innerHTML = '';
 pagination.append(pagSection);
 pagSection.append(btnPag);

 pbAction();
 renderCards(options);
 addToCart();
}

//выделение кнопок пагинации
function pbAction(){
  const pb = document.querySelector('.pb');
  if(pb.textContent === '1'){
    pb.classList.add('pag-active');
  }
}


// количество кнопок пагинации
function numberBtns(products, onPage){
  if(products.length > 0){
  return Math.ceil(products.length / onPage);
  }

}

//отрисовка кнопок пагинации
function paintPaginationButton(count){ 
  let btn = '';
  for(let i=1; i <= count; i++){
     btn += `<button class="pb">${i}</button>`;
  }
  return btn;
}

  //сама отрисовка отобранных товаров
  function renderCards(array){
    array.forEach(({ title, size, description, image, rating, price, color, article }) =>{
      return cardsGoods.append(createCardGoods({ title, size, description, image, rating, price, color, article }));
    })
  }

  //отрисовка товаров на последующих листах при кликах по кнопкам пагинации
function paginationWork(event){
  let active = document.querySelector('.pag-active');
 
    if(active){
          active.classList.remove('pag-active')
         }

    if ([...event.target.classList].includes("pb")){
         const pb = event.target.textContent;
         event.target.classList.add('pag-active');
         const start = onPage*(pb - 1);
         const end = start + onPage;
         let el = fiterGoodsOfTitle.slice(start, end);
         cardsGoods.innerHTML = '';
        renderCards(el);
        addToCart();
      }else{
         //console.log(event.target)
      }
}

//отрисовка выбранной карточки товара
function createCard (arr)  {

  if (goodPage){
 const idProduct = new URLSearchParams(window.location.search).get('id');
  const currentUrl = document.querySelector('.card-url');
  
  arr.forEach(elem => {
   
  if(elem.article === parseInt(idProduct)) {
    
  const element = document.createElement('div');
  const urlName = document.createElement('span');
  urlName.innerHTML = `${elem.description}`;
  currentUrl.append(urlName);
  element.classList.add('card-product');
  const priceProduct = parseFloat(elem.price).toFixed(2);
  element.innerHTML = `
    <div class="card-product-img">
      <div id="cart-max" class="cart-image-max">
        <img class="cart-img-item-max" id="${elem.article}" src="${elem.image}" alt="${elem.description}">
      </div> 
      <div class="cart-image-min">
        <div class="cart-min cart-min-activ">
          <img class="cart-img-item-mini" id="${elem.article}" src="${elem.image}" alt="${elem.description}">
        </div> 
        <div class="cart-min">
          <img class="cart-img-item-mini" id="${elem.article}" src="${elem.image2}" alt="${elem.description}">
        </div> 
      </div> 
    </div>
    <div class="card-content" id="${elem.article}">
    <div class="card-name">${elem.description}</div>
    <div class="card-rating">
    <div class="rating-body">
      <div class="rating-active" style="width: ${elem.rating/0.05}%;">
        <div class="rating-items">
          <input type="radio" class="rating-item" value="1" name="rating">
          <input type="radio" class="rating-item" value="2" name="rating">
          <input type="radio" class="rating-item" value="3" name="rating">
          <input type="radio" class="rating-item" value="4" name="rating">
          <input type="radio" class="rating-item" value="5" name="rating">
        </div>
      </div>
    </div>
  </div>
    <div class="card-price">As low as <div class="card-price-content"><span>$</span><div class="price-card">${priceProduct}</div></div></div>
    <div class="menu-color block-filter card-color">COLOR:
        <div class="card-colors" id="article-color${elem.article}"></div>
    </div>
    <div class="card-color">SIZE:
    <div class="card-size" id="article-size${elem.article}"></div>
    </div>
   
    <div class="card-buttons">
       <button class="card-button card-button-bag">ADD TO BAG</button>
       <button class="card-button card-button-wishlist">ADD TO WISHLIST</button>
    </div>
    
    <div class="card-color">
    <a href="#"><img class="fb" src="../img/facebook.svg"alt="fb"></a>  
    <a href="#"><img class="fb" src="../img/twitter 1.svg" alt="tw"></a>
    <a href="#"><img class="fb" src="../img/pinterest.svg" alt="pint"></a>
    <a href="#"><img class="fb" src="../img/link.svg" alt="link"></a>
    </div>

    <div class="free-shopping">
    <div class="free-header">- Worry Free Shopping -</div>
    <div class="free-line"></div>

    <div class="free-content">
    <div class="free-content-left">
    <div><img src="../img/free-delivery.svg" alt="delivery"></div>
    <div class="free-content-left-text">FREE PRIORITY SHIPPING ON ORDERS $99+*</div>
    </div>
    <div class="free-content-left">
    <div><img src="../img/exchange.svg" alt="exchange"></div>
    <div class="free-content-left-text">FREE RETURNS & EXCHANGES*</div>
    </div>
    </div>
    </div>
    </div>`
  
    goodPage.append(element);
    const availableColorGoods = elem.color;
    const cardColor = document.getElementById(`article-color${elem.article}`);
    renderColorSize(availableColorGoods, cardColor, elem.article, 'radio');

    const arraySize = elem.size;
    const cardSize = document.getElementById(`article-size${elem.article}`);
    renderColorSize(arraySize, cardSize, elem.article, 'radio');

  }
  });
  }
  }

createCard(products);

//смена картинок в карточке товаров
function sliderImgGood(event) {
  
  if (event.target.className === "cart-img-item-mini") {
    const target = event.target.getAttribute('src');
    document.querySelector('.cart-img-item-max').setAttribute('src', target);
    
    if (event.target.parentNode.className !== "cart-min-activ"){
      const minGoodImgs = document.querySelectorAll(".cart-min");
         
      minGoodImgs.forEach(e => {
        e.classList.toggle('cart-min-activ');
      })
    }
}
  }

                             //добавление товара в корзину


//отрисовка корзины
function generateCartProduct (img, title, sum, id, color, size, quantity, price) {
 return `
 <li class="cart-content__item" data-id='${id}'>
              <img src="${img}" alt="pants" class="card-product__img">
              <div class="card-product__text">
                <h3 class="card-product__title">${title}</h3>
                <div class="card-product__content">
                <div class="card-product__color">COLOR:
                  <span class="color-card" id="article-color">
                    <input type="color" value="${color}" disabled="">
                  </span>
              </div>
              <div class="card-product__size">SIZE:
                <span class="size-card" id="article-size">${size}</span>
              </div>
              <div class="card-product__quantity">
                <span class="quantity-decr">-</span>
                <span class="quantity">${quantity}</span>
                <span class="quantity-incr">+</span>
              </div>
              <div class="card-product__size">Price:
                <span>$</span><span class="card-product__price">${price}</span>
              </div>
              <div class="card-product__size">Sum:
                <span>$</span><span class="card-product__sum">${sum}</span>
              </div>
              
              <div class="card-product__delete">
                <button class="" aria-label="Delet product"></button>
              </div>
              </div>
            </li>
 `;
}

//суммирование итоговой стоимости корзины
function sumFull (sum) {
  let lists = document.querySelectorAll(".cart-content__item");
  total = 0;
  
    for (const item of lists) {
      const sum = Number(item.querySelector('.card-product__sum').textContent);
      total += sum;
    }
  fullPrice.textContent = total.toFixed(2);
}

//сумма по одному товару
function sumOneGoods (price, quantity){
 let sumOneUnicGood =  (quantity * price).toFixed(2);
return sumOneUnicGood;
}


//уменьшение количества отдельного товара в корзине
function quantutyGoodDec (quantity) {
  return --quantity;
  }

//отрисовка количества уникальных товаров в корзине
function printQuantity () {
  let length = cartProductsList.children.length;
  cartQuantity.textContent = length;
  }


//уменьшение итоговой стоимости корзины
function minusFullPrice (currentPrice) {
    return total -= currentPrice;
  }

  //открытие и закрытие корзины
function basketActive(e) {
  cartContent.classList.toggle('cart-content-active');
}

  //удаление продуктов из корзины
function deleteProducts(productParent){
  let id = productParent.dataset.id;
  let currentPrice = Math.round(productParent.querySelector('.card-product__price').textContent * 100 / 100);
  let currentSum = Math.round(productParent.querySelector('.card-product__sum').textContent * 100 / 100);
  minusFullPrice(currentPrice);
  productParent.remove();
  printQuantity();
  sumFull();
}

//отправка товаров в корзину при клике на кнопку "Add to bag" в карточке товара
function addToBag() {
  const btnAddToBag = document.querySelector('.card-button-bag');//кнопка "Add to Bag"
  if(btnAddToBag){
    btnAddToBag.addEventListener('click', addToBasketwithProduct);
   document.addEventListener('change', choiceOptions);
  }
  }

  if(goodPage){
    addToBag();
  }

//запись в продукт выбраного цвета и размера
function choiceOptions() {
 
 let options = document.querySelectorAll('.checkbox');
  
  options.forEach(option => {
   
    if(option.name === 'color') {
      if(option.checked){
        productCard.color = option.value;
      }
    }
    if(option.name === 'size') {
      if(option.checked){
        productCard.size = option.value;
      }
    }
    });
}

//отрисовка товаров в корзине при клике в карточке товара
function addToBasketwithProduct () {
  let btnAddToBag = document.querySelector('.card-button-bag');
  btnAddToBag.setAttribute('disabled', 'true');
  btnAddToBag.classList.add('cart-button-bag-disabled');
  productCard.image = document.querySelector('.cart-img-item-max').getAttribute('src');
  productCard.title = document.querySelector('.card-name').textContent;
  productCard.price = Math.round(document.querySelector('.price-card').textContent * 100 / 100);
  productCard.article = document.querySelector('.card-content').getAttribute('id');
  let lists = document.querySelectorAll(".cart-content__item");
  let quantity = 1;
  let sum = sumOneGoods(productCard.price, quantity);

  for (const item of lists) {
      
    if(productCard.article === item.getAttribute('data-id')){
      let quantity = incremGood();
      const sumSpan = item.querySelector('.card-product__sum');
      let sum = sumOneGoods(productCard.price, quantity.textContent);
      sumSpan.textContent = sum; 
      addToArray(productCard);
      save();
      cartInit();
   return;
  }
  }

  cartProductsList.insertAdjacentHTML('afterbegin', generateCartProduct (productCard.image, productCard.title, sum, productCard.article, productCard.color, productCard.size, quantity, productCard.price));
  sumFull(sum);
  printQuantity();
  addToArray(productCard);
  save();
}

//отрисовка товаров в корзине при клике на карточку товара в каталоге
function addToCart (){
 const btnAddToCarts = document.querySelectorAll(".cart-button");
 console.log(btnAddToCarts);

 if(btnAddToCarts){
  btnAddToCarts.forEach(el => {
  el.addEventListener('click', addToBasket);
})
 }
}

addToCart();

//определение элементов для отрисовки корзины товаров
function addToBasket(e){

  let self = e.currentTarget;
  let buttonAdd = self.children[0];
  buttonAdd.setAttribute('disabled', 'true');
  let parent = self.closest(".fortydiscountcard"); //карточка товара в каталоге на которую кликнули
  let lists = document.querySelectorAll(".cart-content__item"); //все записи товаров в корзине
  
  productCard.article = parent.id;
  productCard.size = "";
  productCard.color  = '';
  productCard.price = parseFloat(parent.querySelector('.price').textContent);
  productCard.count = 1;
  let sum = sumOneGoods(productCard.price, productCard.count);
  productCard.image = parent.querySelector('.cart-img-item').getAttribute('src');
  productCard.title = parent.querySelector('.cart-name').textContent;

 
  for (const item of lists) { //без этой проверки в корзину добавляются такие товары, даже если уже есть
    console.log(productCard.article);
    console.log(item.dataset.id);
    if(productCard.article === item.dataset.id){
      productCard.count = incremGood();
      const sumSpan = document.querySelector('.card-product__sum');
      let sum = sumOneGoods(productCard.price, productCard.count.textContent);
      sumSpan.textContent = sum; 
      sumFull(sum);
      addToArray(productCard);
      save();
   return;
  }
  }
 
  cartProductsList.insertAdjacentHTML('afterbegin', generateCartProduct(productCard.image, productCard.title, sum, productCard.article, productCard.color, productCard.size, productCard.count, productCard.price));
  console.log(productCard);
  addToArray(productCard);
  console.log(arrProducts);
  save();
  sumFull(sum);
  printQuantity();
}

// добавление товара в массив товаров
function addToArray(product) {

      for (const item of arrProducts) {
        if (item.article === product.article) {
          item.count ++;
          return;
        }
      }

  const newProduct = product;
  arrProducts.push(newProduct);
}

cartInit(); //когда это активно отрисовывается корзина

//отрисовка ранее добавленных товаров в корзине
arrProducts.forEach((item) => {
  const { image, title, article, color, size, count, price } = item;
  let sum = count * price;
  cartProductsList.insertAdjacentHTML('afterbegin', generateCartProduct(image, title, sum, article, color, size, count, price));
  sumFull(sum);
  printQuantity();
})


//слушатель на нажатие + и - в корзине
cartProductsList.addEventListener('click', (e) => {
  const eTargetID = e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
  
  if(e.target.classList.contains('quantity-incr')){
    let quantity = incremGood();
    let price = e.target.parentElement.nextElementSibling.childNodes[2].textContent;
    const sumSpan = document.querySelector('.card-product__sum');
    let sum = sumOneGoods(price, quantity.textContent);
    sumSpan.textContent = sum;
    sumFull(sum);
    for (let i = 0; i < arrProducts.length; i += 1){
      const { article } = arrProducts[i];
      if(article === eTargetID){
        arrProducts[i].count += 1;
      }
    }
    save();
    
  }
  if(e.target.classList.contains('quantity-decr')){
    if(e.target.nextElementSibling.textContent > 1){
      let quantity = decremGood();
      let price = e.target.parentElement.nextElementSibling.childNodes[2].textContent;
      const sumSpan = document.querySelector('.card-product__sum');
      let sum = sumOneGoods(price, quantity.textContent);
      sumSpan.textContent = sum;
      sumFull(sum);
      for (let i = 0; i < arrProducts.length; i += 1){
        const { article } = arrProducts[i];
        if(article === eTargetID){
          arrProducts[i].count -= 1;
        }
      }
      save();
    }else{
      deleteProducts(e.target.closest('.cart-content__item'));
    }
    
  }
})

//слушатель для удаления товаров из корзины
cartProductsList.addEventListener('click', (e) => {
  if(e.target.classList.contains('card-product__delete')){
    deleteProducts(e.target.closest('.cart-content__item'));
    const id = e.target.closest('.cart-content__item').dataset.id;
    for (let i = 0; i < arrProducts.length; i += 1){
      const {article} = arrProducts[i];
      if(article === id){
        arrProducts.splice(i, 1);
      }
    }
    save();
    if(arrProducts.length < 1) {
      arrProducts = [];
      save();
    }
  }
})

//увеличение количества товаров в корзине при клике на +
function incremGood (){
  const quantitySpan = document.querySelector('.quantity');
  quantitySpan.textContent ++;
  return quantitySpan;
}

//уменьшение количества товаров в корзине при клике на -
function decremGood(){
  const quantitySpan = document.querySelector('.quantity');
  let quantity = quantutyGoodDec(quantitySpan.textContent);
  quantitySpan.textContent = quantity;
  return quantitySpan;
}

  // инициализация корзины из Local Storage
   function cartInit() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart !== null ) {
      arrProducts = JSON.parse(storedCart);
      return arrProducts;
    }
    return [];
  }

  // cохраняем корзину в Local Storage
  function save() {
    localStorage.setItem('cart', JSON.stringify(arrProducts));
  }
