let currentProducts = products;
let categories = new Set();
let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];


let generateShop = () => {

    return (shop.innerHTML = currentProducts
        .map((x) => {
            let { id, name, description, category, price, image, sale, saleAmount } = x;
            let search = basket.find((x) => x.id === id) || [];
            return `
            <div id=product-id-${id} class="item productItem ${sale ? "onSale" : ""}">
            <img src="${image}" alt="product-photo">
                    <p class="productName">${name}</p>
                    <p class="productDescription">${description}</p>

                    <div class="productPrice">
                    <span class="price">${price.toFixed(2)} zł</span>

                    <span class="priceSale">${(price -saleAmount).toFixed(2)} zł</span>
                    </div>
                    <div class="buttons">
                        <button onclick="decrement(${id})" class="bi">-</button>
                        <div id=${id} class="quantity">
                        ${search.item === undefined ? 0 : search.item}
                        </div>
                        <button onclick="increment(${id})" class="bi">+</button>
                    </div>
                    <button data-id="${id}" class="productAddToBasket mainButton" onclick="increment(${id})">Dodaj do koszyka</button>
                    
                    <p class="productItemSaleInfo">Promocja</p>
            </div>
            `;
        })
        .join(""));
};
generateShop();

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }
  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);

  localStorage.setItem("data", JSON.stringify(basket));
};


let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();


// KATEGORIE
const renderCategories = (items) => {
    for(let i = 0; i < items.length; i++){
    categories.add(items[i].category)
    }
    const categoriesItems = document.querySelector(".categoriesItems");
    
    categories = ["wszystkie",...categories];

    categories.forEach((category, index) => {
        const newCategory = document.createElement('button');
        newCategory.innerHTML = category;
        newCategory.dataset.category = category;

        index === 0 ? newCategory.classList.add('active') : '';
        categoriesItems.appendChild(newCategory);
    });
};

// document.onload = generateShop(currentProducts);
document.onload = renderCategories(currentProducts);

const categoriesButtons = document.querySelectorAll('.categoriesItems button');

categoriesButtons.forEach((btn) => btn.addEventListener('click', (e) => {
    const category = e.target.dataset.category;

    categoriesButtons.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentProducts = products;

    if(category === "wszystkie"){
        currentProducts = products;
    }
    else{
        currentProducts = currentProducts.filter((product) => product.category === category
        );
    }
    generateShop(currentProducts);
    })
);

// WYSZUKIWARKA

const searchBarInput = document.querySelector(".searchBarInput");

searchBarInput.addEventListener("input", (e) =>{

    const search = e.target.value;
    const foundProducts = currentProducts.filter((product) => {
        if(product.name.toLowerCase().includes(search.toLowerCase())){
            return product;
        }
    });

    currentProducts = foundProducts;

    generateShop();

    if(foundProducts.length === 0) currentProducts = products;
});

const clearSearch = document.getElementById("close");

clearSearch.addEventListener("click", () => {
    currentProducts = products;
    generateShop();
});

const filtrButton = document.getElementById("filtr");

filtrButton.addEventListener("click", () => {

  let highPrice = document.getElementById("highPrice").value;
  let lowPrice = document.getElementById("lowPrice").value;

  const foundProducts = currentProducts.filter((product) => {
    if((product.price <= highPrice || product.price - product.saleAmount <= highPrice) && (product.price >= lowPrice || product.price - product.saleAmount >= lowPrice)) return product;
  });

  currentProducts = foundProducts;
  generateShop();

  currentProducts = products;
});


filtrButton.addEventListener("onmouseup", () => {
  let highPrice = document.getElementById("highPrice").value;
  let lowPrice = document.getElementById("lowPrice").value;

  lowPrice = "";
  console.log(lowPrice)
});