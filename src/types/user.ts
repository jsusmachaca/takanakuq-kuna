export interface UserData {
  id?: number
  username?: string
  first_name?: string
  last_name?: string
  description?: string | null
  profile_image?: string | null
  email?: string
  is_admin?: boolean
  is_staff?: boolean
  password?: string
  confirm_password?: string
}