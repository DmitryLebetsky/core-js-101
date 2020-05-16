/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: '',
  isSelectorHaveElement: false,
  isSelectorHaveId: false,
  isSelectorHavePseudoElement: false,
  rightOrder: ['element', 'id', 'class', 'attribute', 'pseudo-class', 'pseudo-element'],
  currentOrder: [],
  isOrderRight(currentSelector) {
    const patternArr = this.rightOrder.slice(this.rightOrder.indexOf(currentSelector) + 1);
    if (this.currentOrder.some((sel) => patternArr.includes(sel))) {
      return false;
    }
    return true;
  },
  element(value) {
    if (!this.isOrderRight('element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.isSelectorHaveElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const copyObj = { ...this };
    copyObj.result += value;
    copyObj.isSelectorHaveElement = true;
    copyObj.currentOrder = [...copyObj.currentOrder, 'element'];
    return copyObj;
  },

  id(value) {
    if (!this.isOrderRight('id')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.isSelectorHaveId) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const copyObj = { ...this };
    copyObj.result += `#${value}`;
    copyObj.isSelectorHaveId = true;
    copyObj.currentOrder = [...copyObj.currentOrder, 'id'];
    return copyObj;
  },

  class(value) {
    if (!this.isOrderRight('class')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const copyObj = { ...this };
    copyObj.result += `.${value}`;
    copyObj.currentOrder = [...copyObj.currentOrder, 'class'];
    return copyObj;
  },

  attr(value) {
    if (!this.isOrderRight('attribute')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const copyObj = { ...this };
    copyObj.result += `[${value}]`;
    copyObj.currentOrder = [...copyObj.currentOrder, 'attribute'];
    return copyObj;
  },

  pseudoClass(value) {
    if (!this.isOrderRight('pseudo-class')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const copyObj = { ...this };
    copyObj.result += `:${value}`;
    copyObj.currentOrder = [...copyObj.currentOrder, 'pseudo-class'];
    return copyObj;
  },

  pseudoElement(value) {
    if (!this.isOrderRight('pseudo-element')) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.isSelectorHavePseudoElement) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const copyObj = { ...this };
    copyObj.result += `::${value}`;
    copyObj.isSelectorHavePseudoElement = true;
    copyObj.currentOrder = [...copyObj.currentOrder, 'pseudo-element'];
    return copyObj;
  },

  combine(selector1, combinator, selector2) {
    const copyObj = { ...this };
    copyObj.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return copyObj;
  },

  stringify() {
    const shouldReturn = this.result.slice();
    this.result = '';
    this.currentOrder = [];
    return shouldReturn;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
