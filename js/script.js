const cElem = (tagName, className, text) => {
   const elem = document.createElement(tagName);
   elem.className = className || '';
   elem.innerText = text || '';
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
   'banners/air_pods_max_banner.jpg',
   'banners/airpods_pro_banner.png',
   'banners/apple_tv_banner.png',
   'banners/ipad_air_banner.jpg',
   'banners/iphone_12_banner.jpg',
   'banners/mac_book_banner.jpg',
   'banners/watch_banner.jpg'
];

const renderSlideItem = banner => {
   const sliderItem = cElem('div', 'header__slider__item');
   const img = cElem('img', 'header__slider__item__img');
   const itemName = banner.split('/')[1].slice(0, -11).split('_')
                          .map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
   const title = cElem('h1', 'header__slider__item__title', itemName)
   const btn = cElem('button', 'header__slider__item__btn', 'Add to cart...');
   img.src = `img/${banner}`;
   sliderItem.append(img, title, btn);
   gElem(".header__slider").append(sliderItem);
}

const elems = bannerUrls.forEach(item => renderSlideItem(item));

//------------------------------------------------------------------
//-------------------------- Render card ---------------------------
//------------------------------------------------------------------

const renderCard = device => {
   const container = cElem('div', 'card');
   const innerCard = {
      img: cElem('img', 'card__img'),
      title: cElem('h2', 'card__title', device.name),
      onStock: cElem('p', 'card__stock', `${device.orderInfo.inStock} left in stock`),
      price: cElem('p', 'card__price', `Price: ${device.price} $`),
      btnAddToCart: cElem('button', 'card__btn', 'Add to cart...'),
      statistic: cElem('div', 'card__stats'),
   }
   innerCard.img.src = `img/${device.imgUrl}`;
   const statsLeft = cElem('div', 'card__stats__left');
   const statsRight = cElem('div', 'card__stats__right');
   statsLeft.innerHTML = `<p>${device.orderInfo.reviews}% Positive reviews<br/>avarage</p>`
   statsRight.innerHTML = `<p>${device.price}<br/>orders</p>`
   innerCard.statistic.append(statsLeft, statsRight);
   container.append(...(Object.values(innerCard)));
   return container;
}

const renderCards = list => {
   const elems = list.map(item => renderCard(item));
   listContainer.clear().add(elems);
}

renderCards(items);


class Filter {
   constructor(){
      this.renderItems = [...items];
      this.config = {
         searchValue: '',
         sortValue: '',
      }
   }
   
   filterByName(value = this.config.searchValue) {
      value = value.toLowerCase();
      this.config.searchValue = value;
      this.renderItems = items.filter((item) => {
         const name = item.name.toLowerCase();
         return name.includes(value);
      });
      this.sortItems();
      renderCards(this.renderItems);
   }

   sortItems(value = this.config.sortValue) {
      this.config.sortValue = value;
      if (value === 'def') {
         this.filterByName();
         return;
      }
      this.renderItems.sort((a, b) => {
         if (a.price > b.price) return value === 'asc' ? -1 : 1
         if (a.price < b.price) return value === 'asc' ? 1 : -1
         return 0;
      })
      renderCards(this.renderItems);
   }
}

const filter = new Filter();

gElem('#deviceInp').oninput = (e) => filter.filterByName(e.target.value);
gElem('#sortDevices').onchange = (e) => filter.sortItems(e.target.value);




