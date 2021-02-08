//------------------------------------------------------------------
//------------------ Function for easy code ------------------------
//------------------------------------------------------------------

const cElem = (tagName, className, text) => {
   const elem = document.createElement(tagName);
   elem.className = className || '';
   elem.innerText = text || '';
   elem.clear = function() {
      this.innerHTML = '';
   }
   return elem;
}

const gElem = param => {
   const elem = document.querySelector(param);
   elem.clear = function() {
      this.innerHTML = '';
      return this;
   }
   elem.add = function (listOfElems) {
      this.append(...listOfElems);
      return this;
   }
   return elem;
}

const listContainer = gElem('.cards')



//------------------------------------------------------------------
//--------------------- Slider -------------------------------------
//------------------------------------------------------------------

$(document).ready(function() {
   $('.header__slider').slick({
      arrows: false,
      dots: false,
      autoplay: true,
      autoplayspeed: 5000,
      speed: 1000,
      fade: true,      
   });
});

const bannerUrls = [
   {name: 'banners/air_pods_max_banner.jpg', id: 33},
   {name: 'banners/airpods_pro_banner.png', id: 32},
   {name: 'banners/apple_tv_banner.png', id: 30},
   {name: 'banners/ipad_air_banner.jpg', id: 34},
   {name: 'banners/iphone_12_banner.jpg', id: 16},
   {name: 'banners/mac_book_banner.jpg', id: 6},
   {name: 'banners/Apple_watch_banner.jpg', id: 13},
];

const renderSlideItem = banner => {
   const sliderItem = cElem('div', 'header__slider__item');
   const img = cElem('img', 'header__slider__item__img');
   const itemName = banner.name.split('/')[1].slice(0, -11).split('_')
                          .map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
   const title = cElem('h1', 'header__slider__item__title', itemName)
   const btn = cElem('button', 'header__slider__item__btn', 'Add to cart...');
   btn.onclick = e => {
      cartInstance.addToCart(banner.id);
   }
   img.src = `img/${banner.name}`;
   sliderItem.append(img, title, btn);
   gElem(".header__slider").append(sliderItem);
}

const elems = bannerUrls.forEach(item => renderSlideItem(item));

//------------------------------------------------------------------
//-------------------------- Render cards --------------------------
//------------------------------------------------------------------

const renderCard = device => {
   const chekedBtn = () => {
      if (device.orderInfo.inStock === 0) {
         return 'card__btnDis';
      } return 'card__btn';
   }
   const btnClass = chekedBtn();

   const container = cElem('div', 'card');
   const innerCard = {
      img: cElem('img', 'card__img'),
      title: cElem('h2', 'card__title', device.name),
      onStock: cElem('p', 'card__stock', `${device.orderInfo.inStock} left in stock`),
      price: cElem('p', 'card__price', `Price: ${device.price} $`),
      btnAddToCart: cElem('button', btnClass, 'Add to cart...'),
      statistic: cElem('div', 'card__stats'),
   }
   innerCard.img.src = `img/${device.imgUrl}`;

   if (innerCard.btnAddToCart.classList[0] === 'card__btn') {
      innerCard.btnAddToCart.onclick = e => {
         e.stopPropagation();
         cartInstance.addToCart(device.id);
      }
   }

   const statsLeft = cElem('div', 'card__stats__left');
   const statsRight = cElem('div', 'card__stats__right');
   let reviewsStatus = '';
   device.orderInfo.reviews >= 50 ? reviewsStatus = 'above ' : reviewsStatus = 'belowe ';
   statsLeft.innerHTML = `<p>${device.orderInfo.reviews}% Positive reviews<br/>${reviewsStatus}avarage</p>`
   statsRight.innerHTML = `<p>${device.price}<br/>orders</p>`
   innerCard.statistic.append(statsLeft, statsRight);
   container.append(...(Object.values(innerCard)));

   container.id = device.id;
   container.btn = btnClass;
   container.addEventListener('click', e => {
      renderModalWindow(container);
   })

   return container;
}

const renderCards = list => {
   const elems = list.map(item => renderCard(item));
   listContainer.clear().add(elems);
}

renderCards(items);

//------------------------------------------------------------------
//--------------------- Modal window for card ----------------------
//------------------------------------------------------------------

const renderModalWindow = (card) => {
   const device = items.find(item => item.id === +card.id);
   const modalWindowCard = gElem('.modalWindowCard');
   modalWindowCard.classList.add('visible');
   const container = cElem('div', 'modalWindowCard__container');
   const containerLeft = cElem('div', 'modalWindowCard__container__left');
   const containerMid = cElem('div', 'modalWindowCard__container__mid');
   const containerRight = cElem('div', 'modalWindowCard__container__right');
   const img = cElem('img', 'modalWindowCard__container__left__img');
   img.src = `img/${device.imgUrl}`;
   modalWindowCard.addEventListener('click', e => {
      e.stopPropagation();
      e.target.classList[0] === 'modalWindowCard' && modalWindowCard.classList.remove('visible');
   })
   containerLeft.append(img);

   const deviceInfo = {
      name: cElem('h2', 'modalWindowCard__container__mid__title', device.name),
      stats: cElem('div', 'card__stats'),
      color: cElem('p', 'modalWindowCard__container__mid__color', `Color: ${device.color}`),
      os: cElem('p', 'modalWindowCard__container__mid__os', `Operation System: ${device.os}`),
      chip: cElem('p', 'modalWindowCard__container__mid__chip', `chip: ${device.chip.name}`),
      itemHeight: cElem('p', 'modalWindowCard__container__mid__height', `Height: ${device.size.height}`),
      itemWidth: cElem('p', 'modalWindowCard__container__mid__width', `Width: ${device.size.width} cm`),
      itemDepth: cElem('p', 'modalWindowCard__container__mid__depth', `Depth: ${device.size.depth} cm`),
      itemWeight: cElem('p', 'modalWindowCard__container__mid__weight', `Weight: ${device.size.weight} kg`),
   }
   deviceInfo.stats.innerHTML = card.querySelector('.card__stats').innerHTML;
   containerMid.append(...(Object.values(deviceInfo)));

   const price = cElem('p', 'modalWindowCard__container__right__price', `$ ${device.price}`);
   const stock = cElem('p', 'modalWindowCard__container__right__stock', `Stock: ${device.orderInfo.inStock} pcs.`);
   const btn = cElem('button', card.btn, 'Add to cart...');
   if (btn.classList[0] === 'card__btn') {
      btn.onclick = e => {
         e.stopPropagation();
         cartInstance.addToCart(device.id);
      }
   }
   containerRight.append(price, stock, btn);

   container.append(containerLeft, containerMid, containerRight);
   modalWindowCard.clear().append(container);
}

//------------------------------------------------------------------
//-------------------------- Filters -------------------------------
//------------------------------------------------------------------

class Utils {
   constructor() {
      this.renderItems = [...items];
      this.config = {
         searchValue: '',
         sortValue: 'def',
      }

      this.colors = this._getColors();
      this.operationSystem = this._getOperationSystem();
      this.priceRange = this._getPriceRange();
      this.storage = this._getStorage();
   }

   _getColors() {
      let result = [];
      this.renderItems.forEach(item => {
         item.color.forEach(col => {
            result.includes(col) || result.push(col)
         })
      })
      return result;
   }

   _getOperationSystem() {
      let result = [];
      this.renderItems.forEach(item => {
         result.includes(item.os) || result.push(item.os)
      })
      return result;
   }

   _getPriceRange() {
      const sortByAsc = [...items]
         .sort((a, b) => a.price - b.price);
      return {
         from: sortByAsc[0].price,
         to: sortByAsc[sortByAsc.length - 1].price,
      }
   }

   _getStorage() {
      let result = [];
      this.renderItems.forEach(item => {
         result.includes(item.storage) || result.push(item.storage)
      })
      return result;
   }
}

utils = new Utils();

//--------------- Create filter logic -------------------

class Filter {
   constructor() {
      this.filtersArr = [
         {
            type: 'range',
            classFr: 'inputFrom',
            classTo: 'inputTo',
            title: 'Price',
            variant: utils.priceRange,
            changes: {...utils.priceRange}
         },
         {
            type: 'check',
            title: 'Colors',
            class: 'colorCheck',
            variants: utils.colors,
            checked: [],
         },
         {
            type: 'check',
            title: 'Storage memory',
            class: 'storageCheck',
            variants: utils.storage,
            checked: [],
         },
         {
            type: 'check',
            title: 'OS',
            class: 'osCheck',
            variants: utils.operationSystem,
            checked: [],
         },
         {
            type: 'check',
            title: 'Display',
            class: 'displayCheck',
            variants: ['<2 - inch', '2 - 5 inch', '5 - 7 inch', '7 - 12 inch', '12 - 16 inch', '>16 - inch'],
            checked: [],
         },
      ]
   }

   changesPrice(type, price) {
      if (isNaN(price)) {
         return;
      }
      if (type === 'from' && price < this.filtersArr[0].variant.from) {
         gElem('.inputRangeFrom').value = +this.filtersArr[0].variant.from
      }
      if (type === 'to' && price > this.filtersArr[0].variant.to) {
         gElem('.inputRangeTo').value = +this.filtersArr[0].variant.to
      } else {
         this.filtersArr[0].changes[type] = +price;
      }
      
      filtration.runFilter();
   }

   changesChecked(data, index) {
      const switchIndex = this.filtersArr[index].checked.indexOf(data);
      if (switchIndex > -1) {
         this.filtersArr[index].checked.splice(switchIndex, 1)
      } else {
         this.filtersArr[index].checked.push(data);
      }
      filtration.runFilter();
   }
}
const filter = new Filter;

//---------- Render aside filters ------------------------

class RenderFilter extends Filter {
   constructor() {
      super();
      
   }

   get contentRenderMethod() {
      return {
         check: this._renderContenCheck.bind(this),
         range: this._renderContenRange.bind(this),
      }
   }

   _renderCategory(item) {
      const container = cElem('div', 'filterItem');
      const title = cElem('div', 'filterItem__title');
      title.innerHTML = `
         <span>${item.title}</span>
         <div class="arrow"></div>
      `
      title.onclick = function () {
         this.classList.toggle('filterItem__title--active');
         const content = this.parentElement.children[1];
         content.classList.toggle('filterItem__content--active');
      }
      const content = cElem('div', 'filterItem__content');
      const chooseMethod = this.contentRenderMethod[item.type];
      const filterContent = chooseMethod(item);
      content.append(...filterContent);
      container.append(title, content);
      return container;
   }

   renderFilters() {
      const container = gElem('.filterContainer');
      const filters = this.filtersArr.map(item => this._renderCategory(item));
      container.innerHTML = '';
      container.append(...filters);
      
   }

   _renderContenCheck(item) {
      const indexToRemove = item.variants.indexOf(null);
      indexToRemove === -1 || item.variants.splice(indexToRemove, 1);
      return item.variants.map(variant => {
         const title = cElem('span', null, variant);
         if (item.title === 'Storage memory') {
            title.innerText += ' Gb';
         }
         const label = cElem('label');
         const inp = cElem('input');
         inp.type = 'checkbox';
         inp.name = variant;
         inp.classList.add(item.class);
         label.append(inp, title);
         return label;
      })
   }

   _renderContenRange(item) {
      const containerFrom = cElem('div');
      const labelFrom = cElem('label', null, 'From');
      const inputFrom = cElem('input', 'inputRangeFrom');
      inputFrom.value = item.variant.from;
      inputFrom.classList.add(item.classFr);
      const setRangeSlider = (i, value) => {
         let arr = [null, null];
         arr[i] = value;
         rangeSlider.noUiSlider.set(arr);
      }
      inputFrom.addEventListener('change', (e) => {
         setRangeSlider(0, e.currentTarget.value);
      })
      containerFrom.append(labelFrom, inputFrom);

      const containerTo = cElem('div');
      const labelTo = cElem('label', null, 'To');
      const inputTo = cElem('input', 'inputRangeTo');
      inputTo.value = item.variant.to;
      inputTo.classList.add(item.classTo);
      inputTo.addEventListener('change', (e) => {
         setRangeSlider(1, e.currentTarget.value);
      })
      containerTo.append(labelTo, inputTo);

      const inputs = [inputFrom, inputTo];
      const rangeSlider = cElem('div', 'rangeSlider');
      noUiSlider.create(rangeSlider, {
         start: [utils.priceRange.from, utils.priceRange.to],
         connect: true,
         step: 1,
         padding: 10,
         range: {
             'min': 0,
             'max': 4000,
         }
     });

     rangeSlider.noUiSlider.on('update', function(values, handle) {
        inputs[handle].value = Math.round(values[handle]);
     })

      return [containerFrom, containerTo, rangeSlider];
   }
}

const asideFilter = new RenderFilter();
asideFilter.renderFilters();

//------------------------------------------------------------------
//--------------------- Filtration ---------------------------------
//------------------------------------------------------------------

class Filtration extends Filter{
   constructor(){
      super();
      
      this.runFilter = () => {
         this.filteredCards = [...items];

         this.sortItems();

         this.filteredCards = this.filteredCards.filter(item => {
            
            const name = item.name.toLowerCase();
            const fbn = name.includes(utils.config.searchValue);

            const fbp = item.price >= this.filtersArr[0].changes.from 
               && item.price <= this.filtersArr[0].changes.to;

            const fbc = this.filtersArr[1].checked.length < 1 ||
               item.color.some(color => this.filtersArr[1].checked.includes(color));

            const fbs = this.filtersArr[2].checked.length < 1 ||
               this.filtersArr[2].checked.includes(item.storage);

            const fbo = this.filtersArr[3].checked.length < 1 ||
               this.filtersArr[3].checked.includes(item.os);


            const ranges = this.filtersArr[4].checked.map(range => {
               if (range === '>16 - inch') {
                  return [16, 100];
               }
               if (range === '<2 - inch') {
                  return [0, 2];
               }
                 return range.split(' ').filter(num => !isNaN(num))
            })
            const fbd = this.filtersArr[4].checked.length < 1 ||
               (item.display !== null) &&
               ranges.some(elem => {
                  const from = +elem[0];
                  const to = +elem[1];
                  const res = from <= item.display && to >= item.display;
                  return res;
               })


            return fbn && fbp && fbc && fbs && fbo && fbd;
         })

         renderCards(this.filteredCards);
      }
   }

   sortItems(value = utils.config.sortValue, arr = this.filteredCards) {
      if (value === 'def') {
         return;
      }
      arr.sort((a, b) => {
         if (a.price > b.price) return value === 'asc' ? -1 : 1
         if (a.price < b.price) return value === 'asc' ? 1 : -1
         return 0;
      })
   }
}


const filtration = new Filtration();

//------------------ Events -----------------------------------

const nameInp = gElem('#deviceInp');
nameInp.oninput = (e) => {
   utils.config.searchValue = e.target.value.toLowerCase();
   filtration.runFilter();
};
const colorInp = gElem('#sortDevices');
colorInp.onchange = (e) => {
   utils.config.sortValue = e.target.value;
   filtration.runFilter()
};
const inpPriceF = gElem('.inputFrom');
inpPriceF.onblur = (e) => {
   const value = e.target.value;
   filtration.changesPrice('from', value);
};
const inpPriceT = gElem('.inputTo');
inpPriceT.onblur = (e) => {
   const value = e.target.value;
   filtration.changesPrice('to', value);
};
const rangeSliderLower = gElem ('.noUi-handle-lower');
rangeSliderLower.onmouseup = () => {
   filtration.changesPrice('from', inpPriceF.value);
}
const rangeSliderUpper = gElem ('.noUi-handle-upper');
rangeSliderUpper.onmouseup = () => {
   filtration.changesPrice('to', inpPriceT.value);
}
const inpsColor = document.querySelectorAll('.colorCheck');
inpsColor.forEach(item => {
   item.oninput = (e) => {
      const color = e.target.name;
      filtration.changesChecked(color, 1);
   }
})
const inpsStorage = document.querySelectorAll('.storageCheck');
inpsStorage.forEach(item => {
   item.oninput = (e) => {
      const storageSize = +e.target.name;
      filtration.changesChecked(storageSize, 2);
   }
})
const inpsOS = document.querySelectorAll('.osCheck');
inpsOS.forEach(item => {
   item.oninput = (e) => {
      const os = e.target.name;
      filtration.changesChecked(os, 3);
   }
})
const checkOS = document.querySelectorAll('.displayCheck');
checkOS.forEach(item => {
   item.oninput = (e) => {
      const displaysRange = e.target.name;
      filtration.changesChecked(displaysRange, 4);
   }
})

//------------------------------------------------------------------
//------------------------ Cart ------------------------------------
//------------------------------------------------------------------

class Cart {
   constructor() {
      this. items = [];
      this.totalCount = 0;
      this.totalPrice = 0;
      this._getFromLS();
   }

   _getFromLS() {
      const cartAsJson = localStorage.getItem('cart');
      if (cartAsJson !== null) {
         const cart = JSON.parse(cartAsJson);
         Object.assign(this, cart);
      }
   }

   _setCartToLS() {
      const cartAsJson = JSON.stringify(this);
      localStorage.setItem('cart', cartAsJson);
   }

   addToCart(id, count = 0) {
      const currentItem = items.find(item => item.id === id);
      const objInItems = this.items.find(item => item.id === id);

      if (count < 4) {
         if (!objInItems) {
            this.items.push({id, count: 1, price: currentItem.price})
         } else {
            objInItems.count++;
            objInItems.price += currentItem.price;
         }
      }

      this._reAmounTotalProperties();
   }
   
   removeFromCart(id, count) {
      const currentItem = items.find(item => item.id === id);
      const indexOfItem = this.items.findIndex(item => item.id === id);

      if (count > 1) {
         this.items[indexOfItem].count--;
         this.items[indexOfItem].price -= currentItem.price;
      }
 
      this._reAmounTotalProperties();
   }

   removeItemFromCart(id) {
      const indexOfItem = this.items.findIndex(item => item.id === id);
      this.items.splice(indexOfItem, 1)
      this._reAmounTotalProperties();
   }

   _reAmounTotalProperties() {
      this.totalCount = 0;
      this.totalPrice = 0;

      const totalAmountResult = this.items.forEach(item => {
         const currentItem = items.find(gadget => item.id === gadget.id);
         this.totalCount += item.count;
         this.totalPrice += currentItem.price * item.count;
      })

      this._setCartToLS();
      renderCartInstance.renderContent();
      renderCartInstance._renderModalContent();
      renderCartInstance._renderTotalInfo();
   }
}

const cartInstance = new Cart();

//------------------ Render Cart -------------------------

const cartInfo = cElem('div', 'cartCounter', `${cartInstance.totalCount}`);
const innerCart = gElem('.innerCart')
const cartBtn = gElem('.header__wrapper__top__cart');
const cartHeader = cElem('div', 'cartHead',);
const cartItems = cElem('div', 'cartItems',);
const cartTotalInfo = cElem('div', 'cartTotalInfo');
const cartBottom = cElem('div', 'cartBottom');

cartHeader.innerHTML = `
   <h2>
      Shopping Cart
   </h2>
   <p>
      Checkout is almost done!
   </p>
`

cartTotalInfo.innerHTML=`
         <p>Total amount: <b>${cartInstance.totalCount} ptc.</b></p>
         <p>Total price: <b>${cartInstance.totalPrice}$</b></p>
      `

cartBottom.innerHTML = `
   <button class="cartBuy" type="submit">Buy</button>
`

innerCart.append(cartHeader, cartItems, cartTotalInfo, cartBottom);

cartBtn.append(cartInfo);

class RenderCart {
   constructor() {
      this.renderContent();
      this.renderModal();
   }

   renderModal() {
      cartBtn.onclick = () => {
         const isShowModal = innerCart.classList.toggle('active')
         if (isShowModal) {
            this._renderModalContent();
            this._renderTotalInfo();
         }
      }
   }

   renderContent() {
      cartInfo.innerText = `${cartInstance.totalCount}`
   }

   _renderModalContent() {
      cartItems.innerHTML = '';
      if (cartInstance.totalCount === 0) {
         cartItems.innerHTML = `<h5>Cart is empty</h5>`;
         return;
      }

      const itemsFromCart = cartInstance.items;
      const itemsForRender = [];

      items.forEach(gadget => {
         const itemFromCart = itemsFromCart.find(item => item.id === gadget.id);
         if (itemFromCart) {
            itemsForRender.push({
               data: gadget,
               count: itemFromCart.count,
               totalPrice: itemFromCart.price,
            })
         }
      })

      itemsForRender.forEach(item => {
         let fixBtnUp = '';
         let fixBtnDown = '';
         if (item.count > 1) {
            fixBtnUp = 'upBtn'
         } else {
            fixBtnUp = 'upBtnDis'
         }
         if (item.count < 4) {
            fixBtnDown = 'downBtn'
         } else {
            fixBtnDown = 'downBtnDis'
         }

         const container = cElem('div', 'cartItems__item');
         const img = cElem('img', 'cartImg');
         img.src = `img/${item.data.imgUrl}`;
         const lSide = cElem('div', 'lSide');
         const middle = cElem('div', 'middle');
         const rSide = cElem('div', 'rSide');
         const pieces = cElem('div', 'pcsContainer');
         const cartItemCount = cElem('div', 'cartItemCount', item.count);
         const cartArrowL = cElem('div', 'cartArrow', 'V');
         const cartArrowR = cElem('div', 'cartArrow', 'V');
         const cartUpBtn = cElem('div', fixBtnUp);
         cartUpBtn.append(cartArrowL);
         cartUpBtn.id = item.data.id;
         cartUpBtn.count = item.count;
         cartUpBtn.onclick = (e) => {
            const cartId = Number(e.currentTarget.id);
            const cartCount = Number(e.currentTarget.count);
            cartInstance.removeFromCart(cartId, cartCount);
         }

         const cartDownBtn = cElem('div', fixBtnDown);
         cartDownBtn.append(cartArrowR);
         cartDownBtn.id = item.data.id;
         cartDownBtn.count = item.count;
         cartDownBtn.onclick = (e) => {
            const cartId = Number(e.currentTarget.id);
            const cartCount = Number(e.currentTarget.count);
            cartInstance.addToCart(cartId, cartCount);
         }

         const cartCloseBtn = cElem('div', 'close', 'X');
         cartCloseBtn.id = item.data.id;
         cartCloseBtn.onclick = (e) => {
            const cartId = Number(e.currentTarget.id);
            cartInstance.removeItemFromCart(cartId);
         }

         pieces.append(cartUpBtn, cartItemCount, cartDownBtn);
         rSide.append(pieces, cartCloseBtn);
         middle.innerHTML = `
            <p>${item.data.name}</p>
            <div class="priceWrapper">
               <p>$${item.data.price}</p>
            </div>
         `

         lSide.append(img);
         container.append(lSide, middle, rSide);
         cartItems.append(container);
      })
   }

   _renderTotalInfo() {
      cartTotalInfo.innerHTML=`
         <p>Total amount: <b>${cartInstance.totalCount} ptc.</b></p>
         <p>Total price: <b>${cartInstance.totalPrice}$</b></p>
      `
   }
}

const renderCartInstance = new RenderCart();



