let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");
let currentProducts = products;

let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");

    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let generateCartItems = () => {
    if(basket.length !== 0){
        return (ShoppingCart.innerHTML = basket
            .map((x) => {
            let { id, item } = x;
                let search = currentProducts.find((y) => y.id === id) || [];
                return `
                <div id=product-id-${id} class="item productItem ${search.sale ? "onSale" : ""}">
                <img src="${search.image}" alt="Product Photo">
                <p class="productName">${search.name}</p>
                <div class="productPrice">
                    <span class="price">${search.price.toFixed(2)} zł</span>

                    <span class="priceSale">${(search.price - search.saleAmount).toFixed(2)} zł</span>
                </div>

                <div class="buttons">
                    <button onclick="decrement(${id})" class="bi">-</button>
                    <div id=${id} class="quantity">${item}</div>
                    <button onclick="increment(${id})" class="bi">+</button>
                </div>

                <button data-id="${id}" class="productRemoveFromBasket mainButton" onclick="removeItem(${id})">Usuń z koszyka</button>

                <div class="productPrice">
                    <span class="price">${item * search.price.toFixed(2)} zł</span>

                    <span class="priceSale">${item * (search.price - search.saleAmount).toFixed(2)} zł</span>
                </div>

                <p class="productItemSaleInfo">Promocja</p>
                </div>
                `;
            })
            .join(""));
    } else {
        ShoppingCart.innerHTML = '';
        label.innerHTML = `
        <h3>Basket is empty!</h3>
        <a href="index.html">
        <button class="HomeBtn">Back to home</button>
        </a>
        `;
    }
};

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    if(search === undefined){
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    generateCartItems();
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
    console.log(basket);
    console.log(search.id);
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem.id);

    if(search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1;
    }

    calculation();
    update(selectedItem.id);
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    let search = basket.find((x) => x.id === id);

    console.log(search.item);
    document.getElementById(id).innerHTML = search.item;

    calculation();
    TotalAmount();
};

let removeItem = (id) => {
    let selectedItem = id;

    basket = basket.filter((x) => x.id !== selectedItem.id);

    calculation();
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
    basket = [];
    calculation();
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};


let TotalAmount = () => {
    if(basket.length !== 0) {
        let amount = basket
        .map((x) => {
            let { item, id } = x;
            let search = currentProducts.find((y) => y.id === id) || [];

            if(search.sale === true){
                return item * (search.price - search.saleAmount).toFixed(2);
            }else{
                return item * search.price.toFixed(2);
            }
            
        })
        .reduce((x, y) => x + y, 0).toFixed(2);

        label.innerHTML = `
        <h2>Total Bill: </h2><h2>${amount} zł</h2>
        <button onclick="clearCart()">Clear Basket</button>
        <button>submit your order</button>
        `;
    } else return;
};

TotalAmount();
