document.addEventListener("DOMContentLoaded", () => {
  //Elements
  const content = document.querySelector(".content");
  const filterSortPrice = document.querySelector("[sort-price]");
  const filterSortModel = document.querySelector("[sort-model]");
  const filterSubmit = document.querySelector("[filter-submit]");

  //API URL config
  const API_URL = `https://gx.pandora.caps.pl/zadania/api/offers.json`;

  //Fetch Function
  const fetchData = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        createModelFilter(data);
        renderData(data, [0, "all"]);
        setDataCache(data);
      });
  };

  //Create unique options to model filter
  const createModelFilter = (data) => {
    const carsModels = data.results;
    let filterData = [];
    carsModels.forEach((carModel) => {
      filterData.push(carModel.params.model);
    });

    const uniqueFilterData = filterData.filter((v, i, a) => a.indexOf(v) === i);

    uniqueFilterData.forEach((element) => {
      const filterOption = document.createElement("option");
      filterOption.innerText = element;
      filterOption.value = element;
      filterSortModel.appendChild(filterOption);
    });
  };

  //Clear component of all elements or childs
  const clearElement = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  //Create card
  const createCard = (item) => {
    //Create container for the card
    const cardContainer = document.createElement("div");
    cardContainer.className = "col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 g-3";

    //create single card element
    const card = document.createElement("div");
    card.className = "card card--new h-100 rounded-0 border-dark";

    //Create card header
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header d-flex justify-content-between";

    //Create brand of header
    const cardHeader_BrandLeft = document.createElement("img");
    cardHeader_BrandLeft.src = "./images/image.webp";
    cardHeader_BrandLeft.classList = "col-4";

    //Create brand of header
    const cardHeader_BrandRight = document.createElement("img");
    cardHeader_BrandRight.src = "./images/image.webp";
    cardHeader_BrandRight.classList = "col-4";

    //create image element in card
    const cardImage = document.createElement("img");
    cardImage.className = "card-img-top rounded-0";
    cardImage.src = item.photos[1]["320x240"];

    //create card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    //create h4 (title) element in card
    const cardTitle = document.createElement("h4");
    cardTitle.className = "card-title text-uppercase";
    //assign data to title
    cardTitle.innerText = item.params.model;

    //create card text (params)
    const cardText_Params = document.createElement("div");
    cardText_Params.classList = "card-text";
    cardText_Params.innerText += `${item.params.year} • `;
    cardText_Params.innerText += `${item.params.mileage}km • `;
    cardText_Params.innerText += `${item.params.engine_power}KM • `;
    cardText_Params.innerText += `${item.params.fuel_type}`;

    //creater card text (description)
    const cardText_Description = document.createElement("div");
    cardText_Description.classList = "card-text";
    cardText_Description.innerText = `${item.title}`;

    //create card footer
    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer text-end bg-white border-0";

    //create footer price
    const cardFooter_Pirce = document.createElement("div");
    cardFooter_Pirce.className = "h4 card-text text-danger";
    cardFooter_Pirce.innerText = `${item.params.price[1]} ${item.params.price["currency"]}`;

    //create footer price description
    const cardFooter_Desciption = document.createElement("div");
    cardFooter_Desciption.className = "card-text";
    cardFooter_Desciption.innerText = `brutto / Faktura VAT`;

    //append element
    content.appendChild(cardContainer);
    cardContainer.appendChild(card);
    card.appendChild(cardHeader);
    cardHeader.appendChild(cardHeader_BrandLeft);
    cardHeader.appendChild(cardHeader_BrandRight);
    card.appendChild(cardImage);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText_Params);
    cardBody.appendChild(cardText_Description);
    card.appendChild(cardFooter);
    cardFooter.appendChild(cardFooter_Pirce);
    cardFooter.appendChild(cardFooter_Desciption);
  };

  //Render Data
  const renderData = (data, sortData) => {
    clearElement(content);

    const items = data.results;

    const [priceValue, modelValue] = sortData;

    switch (priceValue) {
      case "risingPrice":
        items.sort(
          (a, b) =>
            parseFloat(a.params.price[1]) - parseFloat(b.params.price[1])
        );
        break;
      case "decreasingPrice":
        items.sort(
          (a, b) =>
            parseFloat(b.params.price[1]) - parseFloat(a.params.price[1])
        );
        break;
      default:
        console.log('Missing arguments');
    }

    items.forEach((item) => {
      if (modelValue == "all") {
        createCard(item);
      } else {
        if (item.params.model == modelValue) {
          createCard(item);
        }
      }
    });
  };

  //Event Listener of sort price
  const setDataCache = (data) => {
    filterSubmit.addEventListener("click", () => {
      const filterSortPriceValue = filterSortPrice.value;
      const filterSortModelValue = filterSortModel.value;

      const sortResult = [filterSortPriceValue, filterSortModelValue];
      renderData(data, sortResult);
    });
  };

  //run fetch data function
  fetchData();
});
