'use strict';
import './main.scss';

import Validate from '../validate';

export default class Form {
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() { 
    const _template = `
      <form class="form">
        <fieldset>
          <legend>Personal user data:</legend>
          <div class="row">
            <div class="col-2 ">
              <label class="m-0" for="fullName">fullName:</label>
            </div>
            <div class="col-10 ">
              <input class="m-0" type="text" name="fullName" id="fullName" placeholder="Name must be present">
            </div>
          </div>
          <div class="row">
            <div class="col-2 ">
              <label for="email">email:</label>
            </div>
            <div class="col-10 ">
              <input type="email" name="email" id="email" placeholder="Email is required">
            </div>
          </div>
          <div class="row">
            <div class="col-2 ">
              <label for="avatarUrl">avatarUrl:</label>
            </div>
            <div class="col-10 ">
              <input type="text" name="avatarUrl" id="avatarUrl" placeholder="Avatar must be an url">
            </div>
          </div>
          <div class="row">
            <div class="col-2 ">
              <label for="birthdate">birthdate:</label>
            </div>
            <div class="col-10 ">
              <input type="text" name="birthdate" id="birthdate" placeholder="birthdate">
            </div>
          </div>
          <div class="row">
            <div class="col-2 ">
              <label for="gender">gender:</label>
            </div>
            <div class="col-10 ">
              <input type="text" name="gender" id="gender" placeholder="M or F">
            </div>
          </div>
          <div class="row">
            <div class="col-2 ">
              <label for="address">address:</label>
            </div>
            <div class="col-10 ">
              <input type="text" name="address" id="address" placeholder="address">
            </div>
          </div>
          <div class="row">
            <div class="col ">
              <input type="submit" value="Submit">
            </div>
          </div>
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
        ' Name must be present', // текст ошибки для первого поля
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
  fill(user) {
    const elements = this._elem.elements;
    for (let element of elements) {
      if (element.name in user)
        element.value = user[element.name];
    }
  }
}