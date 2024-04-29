import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import  MainPage  from './pages/mainPage/MainPage.tsx';
import { LandingPage } from './pages/landingPage/LandingPage.tsx';
import { MyPage } from './pages/myPage/MyPage.tsx';
import SolvePage from './pages/SolvePage.tsx';

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<LandingPage />} />
					<Route path='/main' element={<MainPage />} />
					<Route path='/myPage' element={<MyPage />} />
					<Route path='/solve' element={<SolvePage />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
