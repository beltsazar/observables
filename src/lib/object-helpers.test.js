import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { cloneDeep } from 'lodash-es'
import { getState } from '../state/index.js'
import { getPathsToTargetObject } from './object-helpers.js'

describe('getPathsToDeepObject', () => {
  let dataObject
  beforeEach(() => {
    dataObject = cloneDeep(getState())
  })

  it('should get the path to a unique nested object', () => {
    const pathsToObject = getPathsToTargetObject(dataObject, dataObject.products)
    expect(pathsToObject.length).to.equal(1)
    expect(pathsToObject).to.deep.equal([['products']])
  })

  it('should get the path to a unique nested object', () => {
    const pathsToObject = getPathsToTargetObject(dataObject, dataObject.products[0].options[0])
    expect(pathsToObject.length).to.equal(4)
    expect(pathsToObject).to.deep.equal([
      ['options', '0'],
      ['products', '0', 'options', '0'],
      ['products', '2', 'options', '0'],
      ['products', '4', 'options', '0']
    ])
  })

  it('should get the path to a property of an object', () => {
    const pathsToObject = getPathsToTargetObject(dataObject, dataObject.products[0].options[0].price.amount)
    expect(pathsToObject.length).to.equal(4)
    expect(pathsToObject).to.deep.equal([
      ['options', '0', 'price', 'amount'],
      ['products', '0', 'options', '0', 'price', 'amount'],
      ['products', '2', 'options', '0', 'price', 'amount'],
      ['products', '4', 'options', '0', 'price', 'amount']
    ])
  })

  it('should reflect mutations in the source object', () => {
    let pathsToObject = getPathsToTargetObject(dataObject, dataObject.products[1])
    expect(pathsToObject.length).to.equal(1)
    expect(pathsToObject).to.deep.equal([['products', '1']])

    dataObject.customer.selectedProduct = dataObject.products[1]
    pathsToObject = getPathsToTargetObject(dataObject, dataObject.products[1])
    expect(pathsToObject.length).to.equal(2)
    expect(pathsToObject).to.deep.equal([
      ['customer', 'selectedProduct'],
      ['products', '1']
    ])
  })

  it('should get parent child relationship based on deep path structure', () => {
    expect(getPathsToTargetObject(dataObject, dataObject.products).length > 0).to.equal(true)
    expect(getPathsToTargetObject(dataObject, dataObject.customer).length > 0).to.equal(true)
    expect(getPathsToTargetObject(dataObject.products, dataObject.customer).length > 0).to.equal(false)
    expect(getPathsToTargetObject(dataObject.products, dataObject.options[0]).length > 0).to.equal(true)
    expect(getPathsToTargetObject(dataObject.products, dataObject.options[1].price).length > 0).to.equal(true)
    expect(getPathsToTargetObject(dataObject.products[0], dataObject.options[0]).length > 0).to.equal(true)
    expect(getPathsToTargetObject(dataObject.products[2], dataObject.options[1]).length > 0).to.equal(false)
    expect(getPathsToTargetObject(dataObject.products[0], dataObject.options[0].price).length > 0).to.equal(true)
    expect(getPathsToTargetObject(dataObject.customer, dataObject.options[0].price).length > 0).to.equal(false)

    dataObject.customer.selectedProduct = dataObject.products[0]
    expect(getPathsToTargetObject(dataObject.customer, dataObject.options[0].price).length > 0).to.equal(true)

    dataObject.customer.selectedProduct = dataObject.products[1]
    expect(getPathsToTargetObject(dataObject.customer, dataObject.options[0].price).length > 0).to.equal(false)
    expect(getPathsToTargetObject(dataObject.customer, dataObject.options[1].price).length > 0).to.equal(true)
  })
})
