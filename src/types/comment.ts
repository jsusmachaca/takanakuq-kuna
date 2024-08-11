export interface commentRequest {
  comment: string
}

export interface commentQuery {
  id: number
  username: string
  profile_image: string
  comment: string
  date: Date
}