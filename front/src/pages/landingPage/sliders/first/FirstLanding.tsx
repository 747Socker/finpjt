import { MenuItem, Menu, Header, Icon, Button } from 'semantic-ui-react';
import logo from '../../../../assets/images/logo.svg';
import scroll from '../../../../assets/images/scrolldown.png';
import { TestLogin } from '../../TestLogin';
import {useLogout} from "../../../../utils/logout.ts";
import { useNavigate } from 'react-router-dom';
import './FirstLanding.css';
import {useEffect, useState} from "react";

export const FirstLandingPage = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const logout = useLogout();
	const navigate = useNavigate();

	const handleRedirect = () => {
		navigate('/main'); // This will navigate to the '/main' route
	};
	// const githubAuth = () => {
	// 	location.href = `https://github.com/login/oauth/authorize?client_id=a82095fde8aa68bb396d&scope=user:email&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}`;
	// };
	// //&response_type=code

	useEffect(() => {
		const checkLoginStatus = () => {
			const token = localStorage.getItem('auth-storage');
			console.log("token: ", token);
			setIsLoggedIn(!!token);
		};
		checkLoginStatus();
	}, []);

	const handleLogin = () => {
		location.href = `https://github.com/login/oauth/authorize?client_id=a82095fde8aa68bb396d&scope=user:email&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}`;
	};

	const handleLogout = () => {
		localStorage.removeItem('auth-storage');
		const token = localStorage.getItem('auth-storage');
		console.log("token: ", token);
		setIsLoggedIn(!!token);
		logout();
	}

	return (
		<>
			<div className='Entire'>
				<div className='LandingPage'>
					<div className='Content'>
						{/* 헤더 */}
						<div className='Navigation'>
							<Menu secondary size='large'>
								<MenuItem>
									<img alt='URTurn' src={logo} style={{ width: '125px' }} />
								</MenuItem>
								<MenuItem name='Waiting Room' position='right'>
									{isLoggedIn ? (
										<Button circular className='ButtonColor' onClick={handleLogout}>
											<Icon name='sign-out' size='big' /> 로그아웃
										</Button>
									) : (
										<Button circular className='ButtonColor' onClick={handleLogin}>
											<Icon name='github' size='big' /> 로그인
										</Button>
									)}
								</MenuItem>
							</Menu>
						</div>

						{/* 동영상 영역 */}
						<div className='Video'>
							<iframe
								width='560'
								height='315'
								src='https://www.youtube.com/embed/rub7vg6YG7k?si=MRm32a7ITC80DZWu'
								title='YouTube video player'
								frameBorder='0'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								referrerPolicy='strict-origin-when-cross-origin'
								allowFullScreen
							></iframe>
						</div>

						{/* CTA 문구 & 버튼 영역 */}
						<div className='CTA'>
							<Header as='h3' textAlign='left' style={{ marginBottom: '-1vh' }}>
								URTurn으로 코드를 넘어서
							</Header>
							<Header as='h3' textAlign='left' style={{ marginBottom: '-1vh' }}>
								당신의 개발 역량을 한 단계 업그레이드하세요.
							</Header>
							<Header as='h3' textAlign='left' style={{ marginBottom: '2vh' }}>
								지금 바로 시작해보세요!
							</Header>
							{isLoggedIn ? (
								<Button circular className='ButtonColor' onClick={handleRedirect}>
									<Icon name='github' size='huge' /> <span className='FontSize'>Github로 시작하기</span>
								</Button>
							) : (
								<Button circular className='ButtonColor' onClick={handleLogin}>
									<Icon name='github' size='huge' /> <span className='FontSize'>Github로 시작하기</span>
								</Button>
							)}
						</div>
						<div className='ScrollDown'>
							<img alt='scroll' src={scroll} style={{ width: '80px' }} />
							<TestLogin />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
