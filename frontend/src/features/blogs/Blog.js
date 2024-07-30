import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useGetBlogsQuery } from './blogsApiSlice'
import { memo } from 'react'


const Blog = ({blogId}) => {

    const {blog} = useGetBlogsQuery("blogslist",{
        selectFromResult:({data}) => ({
            blog: data?.entities[blogId]
        }),
    })

    const navigate = useNavigate()
    if(blog){
        const created = new Date(blog.createdAt).toLocaleString('en-US',{ day : 'numeric', month: 'long'})

        const updated = new Date(blog.updatedAt).toLocaleString('en-US',{ day : 'numeric', month: 'long'})

        const handleEdit = () => navigate(`/dash/blogs/${blogId}`)

        return(
            <tr className='table__row'>
                <td className='table__cell blog__title'>{blog.title}</td>
                {/*<td className='table__cell blog__roles'>{blog.textContent}</td>*/}
                <td className='table__cell blog__created'>{created}</td>
                <td className='table__cell blog__updated'>{updated}</td>
                <td className='table__cell'>
                    <button 
                        className='icon-button table__button'
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare}/>
                    </button>
                </td>
            </tr>
        )
    } else return null
}
//Avoiding unecessary component pre-renders
const memoizedBlog = memo(Blog)

export default memoizedBlog
