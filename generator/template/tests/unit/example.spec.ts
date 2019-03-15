<%_ if (hasTS) { _%>
import test from 'ava'
import { shallowMount } from '@vue/test-utils'
<%_ if (!rootOptions.bare) { _%>
import HelloWorld from '@/components/HelloWorld.vue'

test('HelloWorld.vue should render', t => {
  const msg = 'new message'
  const wrapper = shallowMount(HelloWorld, {
    propsData: { msg }
  })
  t.regex(wrapper.text(), new RegExp(msg))
})
<%_ } else { _%>
import App from '@/App.vue'

test('App should render', t => {
  const wrapper = shallowMount(App)
  t.regex(wrapper.text(), new RegExp('Welcome to Your Vue.js App'))
})
<%_ } _%>
<%_ } _%>
