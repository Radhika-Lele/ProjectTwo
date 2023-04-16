import app from "./firebase.js";
import {getDatabase, ref} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const database = getDatabase(app);
const dbRef = ref(database);

console.log(dbRef);



//Hamburger Menu 
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.menu');
    const navLinks = document.querySelectorAll('.menu li');
    //toggle Nav
    burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');

    //Animate links
    navLinks.forEach((link, index) => {
    if (link.style.animation) {
        link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
    });

    //Burger Animation
    burger.classList.toggle('toggle');
});
}
navSlide();

//Instagram section popup modal
document.querySelectorAll('.instaGallery img').forEach(image => {
image.onclick = () => {
    document.querySelector('.popupImage').style.display = 'block';
    document.querySelector('.popupImage img').src = image.getAttribute('src');
 }
});
document.querySelector('.popupImage span').onclick = () => {
document.querySelector('.popupImage').style.display = 'none';
}

//featured Sale section Image slider
// document.getElementById('next').onclick = function(){
//     const widthItem = document.querySelector('.productSlide').offsetWidth;
//     document.querySelector('.shoppingGalleryOne').scrollLeft += widthItem;
// }
// document.getElementById('prev').onclick = function(){
//     const widthItemOne = document.querySelector('.productSlide').offsetWidth;
//     document.querySelector('.shoppingGalleryOne').scrollLeft -= widthItemOne;
// } 


//BEGIN Image Carousel for featured sale section
function modulo(number, mod) {
    let result = number % mod;
        if (result < 0) {
            result += mod;
        }
            return result;
}
function setUpCarousel(carousel) {
function handleNext() {
    if (currentSlide<4)
    {
    currentSlide = modulo(currentSlide + 1, numSlides);
    changeSlide(currentSlide);
    }
    if (currentSlide == 4)
    {
    buttonNext.display=none;
    }
}

function handlePrevious() {
if (currentSlide>0)
    {
        currentSlide = modulo(currentSlide - 1, numSlides);
        changeSlide(currentSlide);
    }
    if (currentSlide == 0)
        {
        buttonPrevious.display='none';
        }
}

function changeSlide(slideNumber) {
    carousel.style.setProperty('--current-slide', slideNumber);
}

// get elements
const buttonPrevious = carousel.querySelector('[data-carousel-button_previous]');
const buttonNext = carousel.querySelector('[data-carousel-button_next]');
const slidesContainer = carousel.querySelector('[data-product_slides]');

// carousel state we need to remember
let currentSlide = 0;
const numSlides = slidesContainer.children.length;

// set up events
buttonPrevious.addEventListener('click', handlePrevious);
buttonNext.addEventListener('click', handleNext);
}

const carousels = document.querySelectorAll('[data-carousel_gallery]');
carousels.forEach(setUpCarousel);
//END Image Carousel for featured sale section



// OPEN AND CLOSE CART
const cartIcon = document.querySelector('#iconOfCart');
const cart = document.querySelector('.addToCart');
const closecart = document.querySelector('#cartClose');

cartIcon.addEventListener('click', ()=>{
    cart.classList.add('active');
});

closecart.addEventListener('click', ()=>{
    cart.classList.remove('active');
});

//Start when document is ready
if(document.readyState == "loading"){
    document.addEventListener('DOMContentLoaded',start);
}else{
    start();
}
// START
function start(){
    addEvents();
}

//UPDATE & RERENDER
function update(){
    addEvents();
    updateTotal();
}

//function addEvents
function addEvents(){
    // remove items from cart
    let cartRemoveButtons = document.querySelectorAll('.cart-remove');
    console.log(cartRemoveButtons);
    cartRemoveButtons.forEach( (btn) =>{
        btn.addEventListener('click',handle_removeCartItem);
    });
   
    //change item Quantity
    let cartQuantityInputs = document.querySelectorAll('.cartQuantity');
    cartQuantityInputs.forEach((input) =>{
        input.addEventListener('change', handleChangeItemQuantity);
    });

    //add item to cart
    let addCartButtons = document.querySelectorAll('.addCart');
    console.log(addCartButtons);
    addCartButtons.forEach( (button) =>{
        button.addEventListener('click', handleAddCartItem);
    });

    //Buy Order
    const buyButton = document.querySelector('.buyButton');
    buyButton.addEventListener('click', handleBuyOrder);
} 
// HANDLE EVENTS FUNCTIONS
let itemsAdded = [];

function handleAddCartItem(){
    let product = this.parentElement;
    product = product.parentElement;
    // console.log(product);
    let title = product.querySelector('.productTitle').innerHTML;
    let price = product.querySelector('.productPrice').innerHTML;
    let imgSrc = product.querySelector('.productImg').src;
    console.log(title, price, imgSrc);

    let newToAdd = {
        title,
        price,
        imgSrc
    };

    //handle item already exist
    if(itemsAdded.find(el => el.title == newToAdd.title)){
        alert("This Item is Already Exist!");
        return;
    }else{
        itemsAdded.push(newToAdd);
    }
    
    //Add product to cart
    let cartBoxElement = cartBoxComponent(title,price,imgSrc);
    let newNode = document.createElement('div');
    newNode.innerHTML = cartBoxElement;
    const cartContent = document.querySelector('.cartContent');
    cartContent.appendChild(newNode);

    update();
}

function handle_removeCartItem(){
    this.parentElement.remove();
    itemsAdded = itemsAdded.filter((el) => el.title != this.parentElement.querySelector('.cartProductTitle').innerHTML);
    update();
}

function handleChangeItemQuantity(){
    if(isNaN(this.value)  || this.value < 1){
        this.value = 1;
    }
    this.value = Math.floor(this.value);  //to keep it integer
    
    update();
}

function handleBuyOrder(){
    if(itemsAdded.length <= 0){
        alert("There is no order place yet.")
        return;
    }
    const cartContent = cart.querySelector('.cartContent');
    cartContent.innerHTML = '';
    alert("Your order placed successfully");
    itemsAdded = [];

    update();
}

// UPDATE & RERENDER FUNCTIONS
function updateTotal(){
    let cartBoxes = document.querySelectorAll('.cartBox')
    const totalElement = cart.querySelector('.totalPrice');
    let total = 0;
    cartBoxes.forEach((cartBox) =>{
       let priceElement = cartBox.querySelector('.cartPrice');
       let price = parseFloat(priceElement.innerHTML.replace('$', ''));
       let quantity = cartBox.querySelector('.cartQuantity').value;
       total += price * quantity;
    });

    //keep 2 digits after the decimal point
    total = total.toFixed(2);
    // //or you can also
    // total = Math.round(total * 100) / 100;
    totalElement.innerHTML = '$' + total;
}

// HTML COMPONENTS
function cartBoxComponent(title,price,imgSrc){
    return `
    <div class="cartBox">
        <img src=${imgSrc} alt="" class="cartImage">
        <div class="detailBox">
            <div class="cartProductTitle">${title}</div>
            <div class="cartPrice">${price}</div>
            <input type="number" value="1" class="cartQuantity">
        </div>
        <!-- REMOVE CART -->
        <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`
}
        