import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

function UserPage() {
  return (
    <>
      <UserHeader/> 
      <UserPost likes={241} replies={345} postImg = "/post1.png " postTitle ="Lets talk about threads"/>
      <UserPost likes={451} replies={214} postImg ="/post2.png" postTitle =" Nice tutorial"/>
      <UserPost likes={134} replies={213} postImg ="/post3.png" postTitle =" Not a nice guy"/>
      <UserPost likes={435} replies={543}  postTitle =" This is my first post"/>
      
    </>
  )
}

export default UserPage
