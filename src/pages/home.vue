<script setup>
import { Button } from '@/components/ui/button';
import { firebaseConfig } from '@/helpers/firebase';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref } from 'vue';


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp);
const userRef = ref(auth.currentUser);
console.log(userRef.value)
// if (user) {
//   // User is signed in, see docs for a list of available properties
//   // https://firebase.google.com/docs/reference/js/auth.user
//   // ...
// } else {
//   // No user is signed in.
// }

onAuthStateChanged(auth, (user) => {
    if (user) {
        userRef.value = user
        console.log('logged in : ', user)
    } else {
        userRef.value = user
        console.log('logged out', user)
    }
})


const handleLogout = () => {
    if (userRef) {
        try {
            const auth = getAuth(firebaseApp);
            signOut(auth).then((data) => {
                // Sign-out successful.
                window.localStorage.removeItem('accessToken')
                console.log('successfully logged out')
                console.log(data)
            }).catch((error) => {
                console.log(error)
                // An error happened.
            });

        } catch (error) {
            console.log(error, 'catch')
        }
    } else {
        console.log('not logged in')
    }
}
</script>
<template>
    <main class="m-5">
        <div v-if="userRef">
            <h1 class="text-center text-2xl font-bold">selamat datang {{ userRef.email }}</h1>
        </div>
        <div v-else>
            <h1 class="text-center text-2xl font-bold">selamat datang, silahkan login</h1>
        </div>
    </main>
    <div class="w-fit m-auto">
        <RouterLink to="/login" v-show="!userRef">
            <Button>
                Login
            </Button>
        </RouterLink>
        <Button @click="handleLogout" v-show="userRef">
            Logout
        </Button>
    </div>
</template>