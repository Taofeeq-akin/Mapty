'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// let map, mapEvent; // create global variable to be reuse

class App {
  // define map and mapEvent as ppt of the Object using private class field since we want everythng related right in the App class.. will become private instance ppt
  #map;
  #mapEvent;
  constructor() {
    // Methods in the parent can be called in the contruction
    this._getPosition();

    // Adding Event Listener on form
    form.addEventListener('submit', this._newWorkout.bind(this));

    // Listenening to InputType
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  _getPosition() {
    // How Maps work on JavaScript
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your location');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);
    // console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);

    const coords = [latitude, longitude];

    // How to display map using a third library (leaflet)
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // How to create a marker
    //Add event listener to the map by using map.on, for handling click on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    // Workout form
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Display Maker
    // console.log(mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker({ lat, lng })
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

// Still need to call the parent method like this
const app = new App();
