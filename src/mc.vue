<template>
  <div>
    <span>{{haha}}</span>
    <router-link to="/test">{{$route.path}}</router-link>
  </div>
</template>

<script>
export default {
  data: () => ({
    haha: 121
  })
}
</script>