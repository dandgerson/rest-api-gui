'use stict';

import './main.scss';

import _ from 'lodash';
import ApiGui from './api-gui';


const apiGui = new ApiGui({
  url: 'http://test-api.javascript.ru/v1/',
  account: 'dandgerson'
});

document.body.prepend(apiGui.getElem());