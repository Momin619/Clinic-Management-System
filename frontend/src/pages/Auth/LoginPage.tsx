
import Login from '../../components/Auth/Login'
export default function LoginPage()
{
  return (
    <div className="min-h-screen flex items-center justify-center
          bg-neutral-100 dark:bg-zinc-900 
          px-6 py-12">
      <div className="w-full max-w-md">
        <Login />
      </div>
    </div>
  )
}
