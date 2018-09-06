'use strict';

import Modal from '../modal';
import './main.scss';

import Validate from '../validate';

export default class VerificationModal extends Modal {
  onInput() {
    this.validate();
    event.stopPropagation();
  }
  _render() {
    // debugger;
    super._render();
    this._renderInput();
    this._elem.addEventListener('input', this.onInput.bind(this));
  }
  _renderPane() {
    this._pane = document.createElement('div');
    this._pane.classList.add('modal-pane');
    this._pane.append(`to confirm operation repeat command "${this.question}" in input area:`);
    this._container.append(this._pane);
  }
  _renderInput() {
    const _template = `
    <form>
      <input type="text" name="verification" placeholder="input the phrase">
    </form>`;
    this._pane.insertAdjacentHTML('afterEnd', _template);
  }
  validate() {
    const form = this._elem.querySelector('form');
    const validate = new Validate({
      form: form,
      fields: [form.verification],
      conditions: [form.verification.value === this.question],
      errorTexts: [' phrase don\'t match'],
      successTexts: [' phrase is match'],
    });
    return validate.result;
  }
}