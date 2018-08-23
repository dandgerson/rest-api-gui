'use strict';

import './main.scss';

export default class Interface {
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    const _template = `
      <div class="interface">
        <input type='button' value='Clear' data-button='clear'>
        <input type='button' value='Show users' data-button='showUsers'>
        <input type='button' value='Create user' data-button='createUser'>
      </div>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;
  }
}