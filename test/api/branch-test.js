import { expect } from 'chai'
import { describe, it, setup } from 'mocha'
import { jsonReader } from '../utility/fileOperations/readwrite'
import { contentstackClient } from '../utility/ContentstackClient.js'
import { branch, devBranch } from './mock/branch'

var client = {}
var stack = {}

describe('Branch api Test', () => {
  setup(() => {
    const user = jsonReader('loggedinuser.json')
    stack = jsonReader('stack.json')
    client = contentstackClient(user.authtoken)
  })

  it('Branch query should return master branch', done => {
    makeBranch()
      .query()
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        var item = response.items[0]
        expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
        expect(item.delete).to.not.equal(undefined)
        expect(item.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should create Branch', done => {
    makeBranch()
      .create({ branch })
      .then((response) => {
        expect(response.uid).to.be.equal(branch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${branch.uid}`)
        expect(response.source).to.be.equal(branch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should create Branch from staging', done => {
    makeBranch()
      .create({ branch: devBranch })
      .then((response) => {
        expect(response.uid).to.be.equal(devBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${devBranch.uid}`)
        expect(response.source).to.be.equal(devBranch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Should fetch branch from branch uid', done => {
    makeBranch(devBranch.uid)
      .fetch()
      .then((response) => {
        expect(response.uid).to.be.equal(devBranch.uid)
        expect(response.urlPath).to.be.equal(`/stacks/branches/${devBranch.uid}`)
        expect(response.source).to.be.equal(devBranch.source)
        expect(response.alias).to.not.equal(undefined)
        expect(response.delete).to.not.equal(undefined)
        expect(response.fetch).to.not.equal(undefined)
        done()
      })
      .catch(done)
  })

  it('Branch query should return all branches', done => {
    makeBranch()
      .query()
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(3)
        response.items.forEach(item => {
          expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
          expect(item.delete).to.not.equal(undefined)
          expect(item.fetch).to.not.equal(undefined)
        })
        done()
      })
      .catch(done)
  })

  it('Branch query for specific condition', done => {
    makeBranch()
      .query({ query: { source: 'master' } })
      .find()
      .then((response) => {
        expect(response.items.length).to.be.equal(1)
        response.items.forEach(item => {
          expect(item.urlPath).to.be.equal(`/stacks/branches/${item.uid}`)
          expect(item.source).to.be.equal(`master`)
          expect(item.delete).to.not.equal(undefined)
          expect(item.fetch).to.not.equal(undefined)
        })
        done()
      })
      .catch(done)
  })

  it('Should delete branch from branch uid', done => {
    makeBranch(devBranch.uid)
      .delete()
      .then((response) => {
        expect(response.notice).to.be.equal('Branch deleted successfully.')
        done()
      })
      .catch(done)
  })
})

function makeBranch (uid = null) {
  return client.stack({ api_key: stack.api_key }).branch(uid)
}
