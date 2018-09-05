'use strict';

import './main.scss';

export default class Modal {
  constructor(question) {
    this.question = question;
  }
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    this._elem.classList.add('modal');
    this._renderContainer();
    this._renderPane();
    this._renderInterface();
  }
  _renderContainer() {
    this._container = document.createElement('div');
    this._container.classList.add('modal-container');
    this._elem.append(this._container);
  }
  _renderPane() {
    this._pane = document.createElement('div');
    this._pane.classList.add('modal-pane');
    this._pane.append(this.question);
    this._container.append(this._pane);
  }
  _renderInterface() {
    const _template = `
      <div class="modal-interface">
        <input type="button" data-button="modal-delete-user-ok" name="ok" value="ok">
        <input type="button" data-button="modal-delete-user-cancel" name="cancel" value="cancel">
      </div>`;
    this._interface = document.createElement('div');
    this._interface.insertAdjacentHTML('afterBegin', _template);
    this._interface = this._interface.firstElementChild;
    this._container.append(this._interface);
  }
}