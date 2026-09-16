<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active"> Home (Week 5) </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active"
            >Firebase Register</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/FireLogin" class="nav-link" active-class="active"
            >Firebase Login</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/FireLogout" class="nav-link" active-class="active"
            >Firebase Logout</router-link
          >
        </li>

        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active"> About </router-link>
        </li>
      </ul>
    </header>
  </div>
</template>
