<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {};
    },
    methods: {},
    computed: {},
    watch: {}
};
</script>

<style lang="scss">
html,
body {
    height: 100%;
    width: 100%;
}
#app {
    height: 100%;
    width: 100%;
    overflow: auto;
    padding: 10px;
}
</style>
