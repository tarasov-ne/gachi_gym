import {useState} from 'react'
import { useFormik } from "formik"
import * as Yup from "yup"
import './UserAddPage.css'
import apiAxiosInstance from "../../api/axios"
import { useMutation } from "@tanstack/react-query"

const valScheme = Yup.object({
    name: Yup.string().required(),
    surname: Yup.string().required(),
    login: Yup.string().required(),
    e_mail: Yup.string().required().email(),
    password: Yup.string().required(),
    phone_number: Yup.string().required(),
})

export default function UserAddPage() {
    const [isSending, setIsSending] = useState(false)
    const [isError, setIsError] = useState(false)
    
    const addUserFormik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            login: "",
            password: "",
            e_mail: "",
            phone_number: "", 
            membership_active: false
        },
        validationSchema: valScheme,
        onSubmit: (values) => {
            sendMutation.mutate(values)
            console.log(values)
        }
    })

    const sendMutation = useMutation({
        mutationFn: async (values: any) =>{
            await apiAxiosInstance.post('/addClient', values)
        },
        onMutate: (_values) => {
            setIsSending(true)
            setIsError(false)
        },
        onError: (_error) => {
            setIsError(true)
        },
        onSuccess: () => {
            addUserFormik.values.name = ''
            addUserFormik.values.surname = ""
            addUserFormik.values.login = ""
            addUserFormik.values.password = ""
            addUserFormik.values.e_mail = ""
            addUserFormik.values.phone_number = ""   
        },
        onSettled: () => {
            setIsSending(false)
        }
    })

  return (
    <div className='userAddForm'>
        <div>User add form</div>
         
        <div className='addUserFormWrapper'>
            <form onSubmit={addUserFormik.handleSubmit}>
                <div className='addUserInputFieldWrapper'>
                    <label>Name</label>
                    <input id='nameField' name='name' type='text'
                    value={addUserFormik.values.name} onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}/>
                    {addUserFormik.errors.name && addUserFormik.touched.name ? <p style={{margin: 0, color: 'red'}}>{addUserFormik.errors.name}</p> : <></>}
                </div>

                <div className='addUserInputFieldWrapper'>
                    <label>Surname</label>
                    <input id='surnameField' name='surname' type='text'
                    value={addUserFormik.values.surname} onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}/>
                    {addUserFormik.errors.surname && addUserFormik.touched.surname ? <p style={{margin: 0, color: 'red'}}>{addUserFormik.errors.surname}</p> : <></>}
                </div>

                <div className='addUserInputFieldWrapper'>
                    <label>Nickname</label>
                    <input id='nicknameField' name='login' type='text'
                    value={addUserFormik.values.login} onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}/>
                    {addUserFormik.errors.login && addUserFormik.touched.login ? <p style={{margin: 0, color: 'red'}}>{addUserFormik.errors.login}</p> : <></>}
                </div>

                <div className='addUserInputFieldWrapper'>
                    <label>Email</label>
                    <input id='emailField' name='e_mail' type='text'
                    value={addUserFormik.values.e_mail} onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}/>
                    {addUserFormik.errors.e_mail && addUserFormik.touched.e_mail ? <p style={{margin: 0, color: 'red'}}>{addUserFormik.errors.e_mail}</p> : <></>}
                </div>

                <div className='addUserInputFieldWrapper'>
                    <label>Password</label>
                    <input id='passwordField' name='password' type='password'
                    value={addUserFormik.values.password} onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}/>
                    {addUserFormik.errors.password && addUserFormik.touched.password ? <p style={{margin: 0, color: 'red'}}>{addUserFormik.errors.password}</p> : <></>}
                </div>


                <div className='addUserInputFieldWrapper'>
                    <label>Phone number</label>
                    <input id='work_modeField' name='phone_number' type='text'
                    value={addUserFormik.values.phone_number} onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}>
                    </input>
                    {addUserFormik.errors.phone_number && addUserFormik.touched.phone_number ? <p style={{margin: 0, color: 'red'}}>{addUserFormik.errors.phone_number}</p> : <></>}
                </div>

                

                <div className='addUserSubmitButton'>
                    <button disabled={isSending ? true : false} type='submit'>{!isSending ? 'Submit' : 'Sending...'}</button>
                </div>
                <div style={{width: '100%', marginLeft: '25%'}}>
                    {isError ? "Something went wrong... Try again." : null}
                </div>
            </form>
        </div>
    </div>
  )
}
