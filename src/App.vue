<template>
  <nav>
    <router-link to="/incomes">Доходы</router-link> |
    <router-link to="/orders">Заказы</router-link> |
    <router-link to="/sales">Продажи</router-link> |
    <router-link to="/stocks">Склады</router-link>
  </nav>
  <router-view/>
</template>

<style>
/* يمكننا إضافة بعض التنسيق البسيط هنا */
nav {
  padding: 30px;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983; /* اللون الأخضر الخاص بـ Vue */
}
</style>
