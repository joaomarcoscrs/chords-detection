import { ref } from 'vue'

export default {
  setup() {
    const count = ref(null)
    return { count }
  },
  count() {
    console.log("COUNT")
  }
  template: `<div>count is {{ count }}</div>`
}
