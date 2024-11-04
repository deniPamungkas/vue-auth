<script setup lang="js">

import { formControlRegister } from '@/assets/constans';
import CustomForm from '@/components/customForm.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import * as z from 'zod'
import { firebaseConfig } from '@/helpers/firebase';
import { initializeApp } from 'firebase/app';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const loadingRef = ref(false)
const router = useRouter()

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const { toast } = useToast()

const schema = z.object({
    username: z.string().min(5).max(10).trim(),
    email: z.string().email(),
    password: z.string().min(8)
})

const { values, defineField, errors } = useForm(
    {
        validationSchema: toTypedSchema(schema),
    }
)

const [usernameValue, username] = defineField('username')
const [emailValue, email] = defineField('email')
const [passwordValue, password] = defineField('password')

const propsField = {
    username, email, password
}

const em = (data) => {
    usernameValue.value = data.username
    emailValue.value = data.email
    passwordValue.value = data.password
}

const handleSubmitRegister = () => {
    try {
        loadingRef.value = true
        const auth = getAuth(firebaseApp);
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user.accessToken)
                window.localStorage.setItem('accessToken', user.accessToken)
                setTimeout(() => {
                    router.push('/home')
                }, 3000);
                // ...
                toast({
                    title: 'Sweet notification!',
                    description: 'berhasil membuat akun',
                    class: 'bg-green-300'
                })
            })
            .catch((error) => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // // ..
                // console.log(errorCode, 'errorCode')
                // console.log(errorMessage, 'errorMessage')
                toast({
                    title: 'Error notification!',
                    description: error.code,
                    class: 'bg-red-300'
                })
            });
    } catch (error) {
        loadingRef.value = true
        toast({
            variant: 'destructive',
            title: 'Sweet notification!',
            description: 'some error occur'
        })
    } finally {
        loadingRef.value = false
    }
}

</script>

<template>
    <section class="w-[320px] md:w-[500px] m-auto my-10">
        <CustomForm :form-control="formControlRegister" :form-data="values" :handle-submit="handleSubmitRegister"
            :error-field="errors" @change="em" :props-field="propsField" :loading="loadingRef" />
    </section>
    <div class="m-auto w-fit">
        <span>Already have an account? <strong>Login</strong> {{ " " }}
            <RouterLink to="/login" class="underline text-blue-900">here</RouterLink>
        </span>
    </div>
</template>