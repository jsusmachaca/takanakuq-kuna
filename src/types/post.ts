export interface PostRequest {
  post: string
  post_image: string
}

export interface PostData {
  id?: number
  user_id: number
  post?: {
    post: string | null
    post_image: string | null
  }
}

export interface PostQuery {
  id: number
  user_id: number
  profile_image: string
  post: string
  post_image: string
  date_publish: Date
}