<script setup>
import { formControlLogin } from '@/assets/constans';
import CustomForm from '@/components/customForm.vue';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod'
import { browserSessionPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from '@/components/ui/toast/use-toast';
import { useRouter } from 'vue-router';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/helpers/firebase';


const { toast } = useToast()
const router = useRouter()

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})
const { values, defineField, errors } = useForm({
    validationSchema: toTypedSchema(schema),
})

const [emailValue, email] = defineField('email')
const [passwordValue, password] = defineField('password')

const propsField = {
    email, password
}

const em = (data) => {
    emailValue.value = data.email
    passwordValue.value = data.password
}

const handleSubmit = () => {
    try {
        console.log(values)
        const auth = getAuth(firebaseApp);
        setPersistence(auth, browserSessionPersistence).then(
            () => {
                signInWithEmailAndPassword(auth, values.email, values.password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        window.localStorage.setItem('accessToken', user.accessToken)
                        router.push('/home')
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        console.log(errorCode, 'errorCode')
                        toast({
                            title: 'Error notification!',
                            description: error.code,
                            class: 'bg-red-300'
                        })
                    })
            }
        ).catch((err) => {
            console.log(err)
        })
    } catch (error) {
        console.log(error)
    }
}

</script>
<template>
    <section class="w-[320px] md:w-[500px] m-auto my-10">
        <CustomForm :form-control="formControlLogin" :form-data="values" :props-field="propsField"
            :handle-submit="handleSubmit" @change="em" :error-field="errors" />

    </section>
    <div class="m-auto w-fit">
        <span>Don't have any account? <strong>Register</strong>{{ " " }}
            <RouterLink to="/register" class="underline text-blue-900">here
            </RouterLink>
        </span>
    </div>
</template>