import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Articles from './components/articles/Articles';
import Article from './components/articles/Article';
import Navigation from './components/navigation/Navigation';
import Home from './components/home/Home';
import NotFound from './components/notFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/articles" element={<Articles />} />
        <Route path="/article" element={<Article />} />
        <Route exact path="/" element={<Home />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
