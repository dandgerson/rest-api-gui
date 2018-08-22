'use strict';
import './main.scss';


export default class Loader {
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    const _template = `
      <span class="loader">
        loading...
      </span>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;
  }
}