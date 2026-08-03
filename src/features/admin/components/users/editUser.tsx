

import UserForm, { userProps } from './userForm'

export default function EditUser({params}:userProps) {
  const {idUser}= params
  return (
    <UserForm userId={idUser} mode={'edit'}/>
  )
}
