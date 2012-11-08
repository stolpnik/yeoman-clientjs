chai = require 'chai'
expect = chai.expect
chai.should()

describe 'なんかテスト', ->
	it "おっけー？", ->
		expect("ok").be("ok")