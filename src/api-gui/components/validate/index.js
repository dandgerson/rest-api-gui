'use strict';

import './main.scss';

export default class Validate {
  constructor({ form, fields, conditions, errorTexts, successTexts }) {
    this.form = form;
    this.fields = fields;
    this.conditions = conditions;
    this.errorTexts = errorTexts;
    this.successTexts = successTexts;

    this.result = this.validate();

    // this.form.addEventListener('click', event => {
    //   (event.target.name === 'check' || event.target.type === 'submit') 
    //   && (this.result = this.validate());
    // });
  }

  validate() {
    this._reset();
    return this._validateFields({
      fields: this.fields,
      conditions: this.conditions,
      errorTexts: this.errorTexts,
      successTexts: this.successTexts,
    });
  }

  _validateFields({ fields, conditions, errorTexts, successTexts }) {
    let validate = [];
    for (let i = 0; i < conditions.length; i++) {
      if (!conditions[i]) {
        fields[i].classList.add('errorElement');
        this._errorText(fields[i], errorTexts[i]);
        validate.push(false);
        continue;
      }
      fields[i].classList.add('successElement');
      this._successText(fields[i], successTexts[i]);
      validate.push(true);
    }
    if (validate.includes(false)) {
      this._errorText(this.form.querySelector('[type="submit"]'), ' Form is Not ready to submit.');
      return false;
    } else {
      this._successText(this.form.querySelector('[type="submit"]'), ' Form is READY to submit.');
      return true;
    }
  }

  _reset() {
    let elements = this.form.elements;
    for (let elem of elements) {
      if (
        elem.classList.contains('errorElement') ||
        elem.classList.contains('successElement')
      ) {
        elem.classList.remove('errorElement');
        elem.classList.remove('successElement');
      }
    }
    let texts = this.form.querySelectorAll(
      '[data-error-text], [data-success-text]'
    );
    for (let text of texts) {
      text.remove();
      text = null;
    }
  }

  _errorText(elem, text) {
    let errorText = document.createElement('span');
    errorText.setAttribute('data-error-text', text);
    errorText.classList.add('errorText');
    errorText.append(errorText.dataset.errorText);
    elem.after(errorText);
  }

  _successText(elem, text) {
    let successText = document.createElement('span');
    successText.setAttribute('data-success-text', text);
    successText.classList.add('successText');
    successText.append(successText.dataset.successText);
    elem.after(successText);
  }
}