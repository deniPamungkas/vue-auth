<script setup>
import { ref } from 'vue';
import Button from './ui/button/Button.vue';
import Input from './ui/input/Input.vue';
import Label from './ui/label/Label.vue';
import { useToast } from './ui/toast/use-toast';

const { toast } = useToast()

const props = defineProps({
    formControl: Array,
    formData: Object,
    handleSubmit: Function,
    errorField: Object,
    propsField: Object,
    loading: Boolean
})

const emit = defineEmits(['change'])

const localData = props.formControl.reduce((acc, key) => {
    acc[key.name] = props.formData[key.name]
    return acc;
}, {})

const data = ref(localData)

const sendToParent = () => {
    emit('change', data.value)
}

const handleSubmit = () => {
    try {
        if (Object.keys(props.errorField).length === 0) {
            props.handleSubmit()
        } else {
            const firstErrKey = Object.keys(props.errorField)[0]
            toast({
                title: `Field ${firstErrKey} not correctly filled`,
                description: props.errorField[firstErrKey],
                class: 'bg-red-100'
            })
        }
    } catch (error) {
        console.log(error, 'error')
    }
}

</script>
<template>
    <form action="" @submit.prevent="handleSubmit" class="m-auto border-2 p-2 flex flex-col gap-7">
        <div v-for="formItem of props.formControl" class="text-foreground">
            <Label class="text-sm md:text-base">{{ formItem.label }}</Label>
            <Input :id="formItem.name" :type="formItem.type" :placeholder="formItem.label" v-model="data[formItem.name]"
                v-bind="props.propsField[formItem.name]" @input="sendToParent" required
                class="rounded-xl bg-slate-100 border-none text-sm md:text-base" />
            <span class="text-red-500 text-xs md:text-base">{{ props.errorField[formItem.name] }}</span>
        </div>
        <Button type="submit" class="bg-stone-600 text-sm md:text-base hover:bg-stone-800 text-white"
            :disabled="props.loading">{{
                $route.path == '/login' ? 'Login' : 'Register' }}</Button>
    </form>

</template>