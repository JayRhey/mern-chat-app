import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './component/HomePage/HomePage';
import ChatPage from './component/ChatPage/ChatPage';
import ChatProvider from './component/Context/ChatProvider';

function App() {
  return (
    <Router>
      <ChatProvider>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/chat" component={ChatPage} />
        </Switch>
      </ChatProvider>
    </Router>
  );
}

export default App;
