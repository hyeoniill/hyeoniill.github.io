기존 vue2 에서는 option API 방식을 사용한다.  
 
```javascript
export default {
    data() {...}
    methods: {...}
    computed: {...}
}
```
option API 방식에서는 데이터 영역 메서드 영역, computed영역 등으로 구분해서 사용한다.  
이렇게 할 경우 관련된 코드가 각각의 영역에 흩어지게 되어 기능 단위로 보기 힘들고 가독성 측면에서도 떨어지게 된다.  
또한 규모가 커지면 커질수록 관리하기도 힘들다.  

```javascript
data() {
  return { count: 0 };
},
methods: {
  increment() { this.count++; }
}
```
그렇기 때문에 기존의 옵션 기준 분리에서 기능 기준으로 분리하고 재사용하는 방식이 Composition API 이다.

## setup()

Composition API 에서는 data, methods, computed 와 같은 옵션 방식을 사용하지 않고, setup()이라는 과정에서 객체의 형태로 리턴한다.  
초기화 작업은 setup()에서 정의한다.  

```javascript
import {ref} from 'vue';
export default {
    name: "Calc",
    setup() {
        const x = ref(10);
        const y = ref(20);
        return {x, y}
    }
}
```

setup()에서는 두 개의 인자가 들어갈 수 있다.
- props: 부모 컴포넌트로부터 전달 받음
- context: 기존 option API에서 attrs, emit, slots에 해당

Vue2의 Option API방식에서는 this를 사용해야 했다.  
this는 동적 바인딩이기 때문에 혼란을 유발할 수 있고 타입 추론도 어렵다.  
그래서 setup()에서는 this를 제거하고 명시적으로 변수를 선언하도록 하여 가독성을 높였다.

기존의 생명 주기도 변경되어 `beforeCreate`, `created`과정 이전에 `setup()`이 실행된다.
setup()에서 기존 beforeCreate, create의 작업을 대신 실행한다.  
created 전상태이기 때문에 data나 method가 초기화 되기 전이다.  
그래서 애초에 this를 사용할 수 없다.  

![라이프사이클](../assets/img/post_image/2026-03-27/composition_lifeCycle.png)


## ref()
> 일반 변수는 반응성이 없다.

Vue는 상태(state)의 변화를 감지하여 화면을 자동으로 업데이트한다.  
하지만 일반 변수는 이러한 **반응성(reactivity)**이 없기 때문에 값이 변경되어도 화면이 갱신되지 않는다.


```javascript
let count = 0;

const increment = () => {
  count++;
};
```

일반 변수를 사용하면 값이 바뀌어도 화면이 바뀌지 않는다.  
변경 감지 기능이 없어서 해당 값이 언제 바뀌었는지 알 수 없기 때문이다.  
그렇기 때문에 반응성이 있는 변수 객체로 만들어주어야 하는데 이 때, ref()를 사용한다.  



```javascript 
import { ref } from "vue";

const count = ref(0);

const increment = () => {
  count.value++;
};
```
ref()는 값을 감싸는 객체를 반환해준다.  
실제 값은 .value로 접근해야 한다. 
Vue2의 data옵션에 해당한다.


### getter / setter
ref()는 getter / setter를 사용하여 값의 변경을 감지한다.  
getter를 통해서 값을 기억하고 있다가 값이 바뀐 것을 감지하면, setter를 사용하여 Vue에 값 변경을 알린다.  
Vue는 값이 변경되었다는 것을 감지하면 화면을 다시 렌더링한다.

## reactive()
reactive()는 **객체(object)나 배열(array)**과 같은 참조형 데이터에 반응성을 부여할 때 사용한다.

```javascript
import { reactive } from "vue";

const state = reactive({
  count: 0
});

state.count++;
```

### computed()
> option API에서 Computed와 동일한 개념이다.

Computed와 동일하게 계산형 속성을 반환하는 반응형 데이터를 만들 때 사용한다.

```javascript
import { computed, ref } from "vue";

const count = ref(0);

const double = computed(() => count.value * 2);
```

### watch()

import {name} from 'vue'; 를 하게 되면 컴포넌트 인스턴스를 무조건 생성하게 된다.

import { defineAsyncComponent } from 'vue'; 를 사용하면 비동기적으로 실제 해당 객체가 사용될 때, import를 하게 할 수 있다.

const CalcCompositionAPI = defineAsyncComponent(() => 
  import('./components/CalcCompositionAPI.vue')
)



watch는 계산이 필요할 때까지 비동기처리가 가능하다. 연산이 오래걸리는 작업에서 비동기 처리를 하기 위해 사용한다.

## WatchEffect

Watch는 즉시 실행되지 않는다. 반면 WatchEffect는 즉시 실행된다.
