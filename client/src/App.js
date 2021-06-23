import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './assets/css/bootstrap.css'
import './assets/css/style.css'
import { isConnected } from './components/Function'
import NavigBar from './components/NavigBar'
import Home from './Home'

function App() {
  const connected = useDispatch()

  useEffect(() => {
    // savoir si un utilisateur est connecté
    isConnected().then(res=>{
      // changer l'etat de connexion
      connected({type: "connected", value: res})
    })
    // eslint-disable-next-line
  }, [])

  return (
    <Router>
      <NavigBar/>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  )
}

export default App
