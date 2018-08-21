'use strict';

import Validate from '../validation';

export default class Form {
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    const _template = `
      <form>
        <fieldset>
          <legend>Personal user data:</legend>
          fullName: <input type="text" name="fullName" placeholder="Dmitry G. Anderson I" ><br>
          email: <input type="email" name="email" placeholder="dandgerson@gmail.com" ><br>
          avatarUrl: <input type="text" name="avatarUrl" placeholder="https://s.gravatar.com/avatar/48993353f0c5319f31e8250f3f4adab7?s=80"><br>
          birthdate: <input type="text" name="birthdate" placeholder="1988-01-22"><br>
          gender: <input type="text" name="gender" placeholder="'M' or 'F'"><br>
          address: <input type="text" name="address" placeholder="ул.Волжская набережная, Россия, 152903"><br>
          <input type="submit" value="Submit">
        </fieldset>
      </form>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;
  }
  validate() {
    const validate = new Validate({
      form: this._elem,
      fields: [
        this._elem.fullName, // первое проверяемое поле
        this._elem.email,
        this._elem.avatarUrl,
        this._elem.birthdate,
        this._elem.gender,
        this._elem.address,
      ],
      conditions: [
        this._elem.fullName.value, // условие для проверки первого поля
        this._elem.email.value,
        this._elem.avatarUrl.value || true,
        this._elem.birthdate.value || true,
        this._elem.gender.value
        && (this._elem.gender.value === 'M' || this._elem.gender.value === 'F') || true,
        this._elem.address.value || true,
      ],
      errorTexts: [
        ' fullName is required', // текст ошибки для первого поля
        ' email is required',
        ' (optional)',
        ' (optional)',
        ' (optional)',
        ' (optional)',
      ],
      successTexts: [
        ' fullName is ok', // текст успешной проверки для первого поля
        ' email is ok',
        ' (optional)',
        ' (optional)',
        ' (optional)',
        ' (optional)',
      ],
    });
    return validate.result;
  }
  process() {
    const elements = this._elem.elements;
    const data = {};
    for (let element of elements) {
      element.name && element.value &&
        (data[element.name] = element.value);
    }
    return data;
  }
}