import Navbar from './Navbar'
import TawkTo from './TawkTo'


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen pt-16">
      <Navbar />
       <TawkTo />
      <div className="px-4">{children}</div>
    </div>
  )
}

export default Layout
