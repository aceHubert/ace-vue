  
import Vue, { VNode } from 'vue'
import { Options } from '../src/index'
import { AsyncFactory, SuspenseComponent } from '../src/Suspense'

declare module 'vue/types/vue' {
  interface Vue {
    asyncFactorys: Set<AsyncFactory<any, SuspenseComponent>>
    resolved: boolean
    _e(): VNode
    _uid: number
    _render(createElement: typeof Vue.prototype.$createElement): VNode
    promiser: Promise<any>
    displayLoading: boolean
    readonly delay: number
    setupLoading(): void
    _self: Vue
    [key: string]: any
  }
  interface VueConstructor {
    setSuspenseOptions(options: Options): void
  }
}