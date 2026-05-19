import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { cloneDeep } from 'lodash-es'
import { getState } from '../state/index.js'
import { getPathsToTargetObjectInSourceObject, isTargetObjectChildOfSourceObject } from './object-helpers.js'

describe('getPathsToDeepObject', () => {
  let dataObject
  beforeEach(() => {
    dataObject = cloneDeep(getState())
  })

  it('should get the path to a unique nested object', () => {
    const pathsToObject = getPathsToTargetObjectInSourceObject(dataObject, dataObject.products)
    expect(pathsToObject.length).to.equal(1)
    expect(pathsToObject).to.deep.equal([['products']])
  })

  it('should get the path to a unique nested object', () => {
    const pathsToObject = getPathsToTargetObjectInSourceObject(dataObject, dataObject.products[0].options[0])
    expect(pathsToObject.length).to.equal(4)
    expect(pathsToObject).to.deep.equal([
      ['options', '0'],
      ['products', '0', 'options', '0'],
      ['products', '2', 'options', '0'],
      ['products', '4', 'options', '0']
    ])
  })

  it('should get the path to a property of an object', () => {
    const pathsToObject = getPathsToTargetObjectInSourceObject(dataObject, dataObject.products[0].options[0].price.amount)
    expect(pathsToObject.length).to.equal(4)
    expect(pathsToObject).to.deep.equal([
      ['options', '0', 'price', 'amount'],
      ['products', '0', 'options', '0', 'price', 'amount'],
      ['products', '2', 'options', '0', 'price', 'amount'],
      ['products', '4', 'options', '0', 'price', 'amount']
    ])
  })

  it('should reflect mutations in the source object', () => {
    let pathsToObject = getPathsToTargetObjectInSourceObject(dataObject, dataObject.products[1]);
    expect(pathsToObject.length).to.equal(1)
    expect(pathsToObject).to.deep.equal([['products', '1']])

    dataObject.customer.selectedProduct = dataObject.products[1];
    pathsToObject = getPathsToTargetObjectInSourceObject(dataObject, dataObject.products[1]);
    expect(pathsToObject.length).to.equal(2)
    expect(pathsToObject).to.deep.equal([
      ['customer', 'selectedProduct'],
      ['products', '1']
    ])
  })
});

describe('isTargetObjectChildOfSourceObject', () => {
  let dataObject
  beforeEach(() => {
    dataObject = cloneDeep(getState())
  })

  it('should get parent child relationship based on deep path structure', () => {
    expect(isTargetObjectChildOfSourceObject(dataObject, dataObject.products)).to.equal(true);
    expect(isTargetObjectChildOfSourceObject(dataObject, dataObject.customer)).to.equal(true);
    expect(isTargetObjectChildOfSourceObject(dataObject.products, dataObject.customer)).to.equal(false);
    expect(isTargetObjectChildOfSourceObject(dataObject.products, dataObject.options[0])).to.equal(true);
    expect(isTargetObjectChildOfSourceObject(dataObject.products, dataObject.options[1].price)).to.equal(true);
    expect(isTargetObjectChildOfSourceObject(dataObject.products[0], dataObject.options[0])).to.equal(true);
    expect(isTargetObjectChildOfSourceObject(dataObject.products[2], dataObject.options[1])).to.equal(false);
    expect(isTargetObjectChildOfSourceObject(dataObject.products[0], dataObject.options[0].price)).to.equal(true);

    expect(isTargetObjectChildOfSourceObject(dataObject.customer, dataObject.options[0].price)).to.equal(false);

    dataObject.customer.selectedProduct = dataObject.products[0];
    expect(isTargetObjectChildOfSourceObject(dataObject.customer, dataObject.options[0].price)).to.equal(true);

    dataObject.customer.selectedProduct = dataObject.products[1];
    expect(isTargetObjectChildOfSourceObject(dataObject.customer, dataObject.options[0].price)).to.equal(false);
    expect(isTargetObjectChildOfSourceObject(dataObject.customer, dataObject.options[1].price)).to.equal(true);

  })
})
