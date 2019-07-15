<%_ if (!hasTS) { _%>
<%_ if (hasBabel) { _%>
import test from 'ava'
import { shallowMount } from '@vue/test-utils'
<%_ if (!rootOptions.bare) { _%>
import HelloWorld from '@/components/HelloWorld.vue'

test('HelloWorld.vue should render', t => {
  const wrapper = shallowMount(HelloWorld)
  t.is(wrapper.constructor.name, 'VueWrapper')
})
<%_ } else { _%>
import App from '@/App.vue'

test('App should render', t => {
  const wrapper = shallowMount(App)
  t.is(wrapper.constructor.name, 'VueWrapper')
})
<%_ } _%>
<%_ } _%>
<%_ if (!hasBabel) { _%>
const test = require('ava')
const { shallowMount } = require('@vue/test-utils')
<%_ if (!rootOptions.bare) { _%>
const HelloWorld = require('../../src/components/HelloWorld.vue')

test('HelloWorld.vue should render', t => {
  const wrapper = shallowMount(HelloWorld)
  t.is(wrapper.constructor.name, 'VueWrapper')
})
<%_ } else { _%>
import App from '@/App.vue'

test('App should render', t => {
  const wrapper = shallowMount(App)
  t.is(wrapper.constructor.name, 'VueWrapper')
})
<%_ } _%>
<%_ } _%>
<%_ } _%>
