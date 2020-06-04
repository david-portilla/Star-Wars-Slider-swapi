import { selectId } from '../helpers'
import Slider from './Slider'

/*eslint-disable */

class Fetch {
  constructor() {
    // console.log('Fetch.js')
    // this.selectId = document.getElementById.bind(document);
    this.loading = selectId('loading')
    this.container = selectId('listContainer')

    // bind methods
    this.showLoading = this.showLoading.bind(this)

    // call init method
    this.init()
  }
  init () {
    // console.log('init Fetch')

    let slider = new Slider()  // eslint-disable-line

    // call type element to draw
    this.fetchItem('starships')
  }


  // generate random number btew 0 - 9
  // getRandomNumber (max, min) {
  //   return Math.floor(Math.random() * (max - min) + min);
  // }

  // fetch Data from SWAPI
  async fetchItem (id) {
    try {
      data ? this.showLoading(false) : this.showLoading(true)
      /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
      const url = `https://swapi.dev/api/${ id }/`;
      const response = await fetch(url);
      const data = await response.json();

      // const firstItemToDraw = this.getRandomNumber(data.results.length, 0);
      // console.log("firstItemToDraw : ", firstItemToDraw);
      // add first item availabe
      // addDataToDOM(data.results[ firstItemToDraw ])


      // add items in parallel
      Promise.all(data.results)
        .then((values) => {
          this.awaitMovies(values)
        })
        .catch(function () {
          console.log("Promise all failure!");
        });
    } catch (error) {
      console.log("Fetch Item Failed: ", error.message);
    }
  }

  // await each related movie
  async awaitMovies (results) {
    try {
      for (let k = 0;k < results.length;k++) {
        results[ k ].films = await this.fetchRelatedMovies(results[ k ].films)
        this.addDataToDOM(results[ k ]);
        results ? this.showLoading(false) : this.showLoading(true)
      }
      // when all data is ready initialize Slider
      // let slider = new Slider()  // eslint-disable-line
    } catch (error) {
      console.log("Awaiting Movies Failed: ", error.message);
    }
  }

  // fecth related movies for each Item
  async fetchRelatedMovies (moviesURL) {
    let movieNames = [];
    let filmObj = [];
    let filmName = [];
    try {
      for (let i = 0;i < moviesURL.length;i++) {
        filmObj[ i ] = await fetch(moviesURL[ i ]);
        filmName[ i ] = await filmObj[ i ].json();
        movieNames[ i ] = filmName[ i ].title;
      }
    } catch (error) {
      console.log("Fetch Related Movies Failed: ", error.message);
    }
    return movieNames;
  }

  // drawing DATA into DOM
  addDataToDOM (data) {
    // console.log('data to add:', data)
    const cardElement = document.createElement("div");
    cardElement.classList.add("c-card");
    cardElement.innerHTML = `
      <div class="c-card__info">
        ${this.createHTML(data) }
      </div>
      `;
    this.container.appendChild(cardElement);
  }

  // remove empty or undefined keys and add inner HTML
  createHTML (data) {
    let str = "";
    for (const property in data) {
      // console.log(`${ property }: ${ data[ property ].length }`);
      if (
        data[ property ] !== "" &&
        data[ property ] !== undefined &&
        data[ property ].length > 0
      ) {
        str += `<p class="c-card__info-text"> <i>${ property }: </i> ${ data[ property ] }</p>`;
      }
    }
    return str;
  }

  // loading data animation
  showLoading (bol) {
    if (bol === true) {
      this.loading.classList.add("show");
    } else {
      this.loading.classList.remove("show");
    }
  }
}
export default Fetch

/*eslint-enable */